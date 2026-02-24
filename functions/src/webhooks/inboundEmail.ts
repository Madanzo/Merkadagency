import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { generateAIResponse } from "../ai/generateResponse";
import { getAgentConfig } from "../ai/agentConfig";
import { sendEmail } from "../email/resend";

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

export const handleInboundEmail = functions.https.onRequest(async (req, res) => {
    // Basic method check
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { from, subject, text, html } = req.body;
        // Resend structure is usually: { "from": "Sender <email@example.com>", ... }
        // We'll need to parse the email address.
        // For simplicity assuming 'from' contains the email or specific field 'from_email' depending on provider webhook.
        // Resend Inbound usually sends JSON.

        const senderEmail = extractEmail(from);
        const incomingMessage = text || html || "";

        if (!senderEmail) {
            console.error("No sender email found in webhook", req.body);
            res.status(400).send("Bad Request: No sender");
            return;
        }

        // 1. Find or Create Lead
        const lead = await findOrCreateLead(senderEmail, { source: 'email_inbound' });

        // 2. Determine Agent Type (Default to support for existing, Sales for new?)
        // For now, let's use a simple heuristic or default to Support if they exist, Sales if new.
        // Logic: If we just created the lead, it's Sales. If they existed, maybe Support.
        // But for this MVP, let's determine based on if they have a "customer" tag or active job.
        const agentType = await determineAgentType(lead, incomingMessage);

        // 3. Find or Create Conversation
        const conversationId = await findOrCreateConversation(lead.id, agentType, 'email');

        // 4. Log Inbound Message
        await db.collection(`conversations/${conversationId}/messages`).add({
            direction: 'inbound',
            sender: 'customer',
            channel: 'email',
            content: incomingMessage,
            subject: subject || '',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'received'
        });

        // Update conversation last message
        await db.collection('conversations').doc(conversationId).update({
            'metadata.lastMessageAt': admin.firestore.FieldValue.serverTimestamp(),
            'metadata.messageCount': admin.firestore.FieldValue.increment(1),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 5. Generate AI Response
        // Get history for context
        const historySnapshot = await db.collection(`conversations/${conversationId}/messages`)
            .orderBy('timestamp', 'asc')
            .limitToLast(10)
            .get();

        const history = historySnapshot.docs.map(d => d.data());

        const aiResult = await generateAIResponse({
            conversationId,
            incomingMessage,
            agentType,
            channel: 'email',
            leadData: lead,
            history
        });

        const agentConfig = getAgentConfig(agentType);

        // 6. Action: Send or Queue
        if (aiResult.shouldEscalate) {
            // Escalate logic: Log internal note, notify admin (future)
            await db.collection(`conversations/${conversationId}/messages`).add({
                direction: 'outbound',
                sender: 'system',
                channel: 'email',
                content: `[ESCALATION REQUIRED] AI prevented response. Reason: ${aiResult.reasoning}`,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                status: 'internal_note'
            });

            // Mark conversation as escalated
            await db.collection('conversations').doc(conversationId).update({
                status: 'escalated'
            });

        } else if (agentConfig.responseSettings.autoSend) {
            // Auto Send
            await sendEmail({
                to: senderEmail,
                subject: `Re: ${subject || 'Question'}`,
                html: aiResult.response.replace(/\n/g, '<br>'), // Simple txt to html
            });

            await logOutboundMessage(conversationId, agentType, 'email', aiResult.response, aiResult, 'sent');
        } else {
            // Queue for Approval
            await db.collection('approval_queue').add({
                conversationId,
                agentType,
                channel: 'email',
                originalMessage: incomingMessage,
                proposedResponse: aiResult.response,
                aiReasoning: aiResult.reasoning,
                docsUsed: aiResult.docsUsed,
                priority: 'medium',
                status: 'pending',
                leadEmail: senderEmail,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Log pending message in conversation? Maybe not to avoid confusion, or mark as pending.
            await logOutboundMessage(conversationId, agentType, 'email', aiResult.response, aiResult, 'pending_approval');
        }

        res.status(200).send('Processed');

    } catch (error) {
        console.error("Error processing inbound email:", error);
        res.status(500).send('Internal Server Error');
    }
});

async function findOrCreateLead(email: string, defaults: any) {
    const leadsRef = db.collection('leads');
    const snapshot = await leadsRef.where('email', '==', email).limit(1).get();

    if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    // Create new
    const newLeadRef = leadsRef.doc();
    const newLead = {
        email,
        status: 'new',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...defaults
    };
    await newLeadRef.set(newLead);
    return { id: newLeadRef.id, ...newLead };
}

async function determineAgentType(lead: any, message: string): Promise<'support' | 'sales'> {
    // Simple logic for now
    if (lead.status === 'customer' || lead.tags?.includes('customer')) {
        return 'support';
    }
    // Could add LLM classifier here if needed, but simple is good for now.
    return 'sales';
}

async function findOrCreateConversation(leadId: string, agentType: string, channel: string) {
    const convRef = db.collection('conversations');
    // Try to find active conversation
    const snapshot = await convRef
        .where('leadId', '==', leadId)
        .where('agentType', '==', agentType)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (!snapshot.empty) {
        return snapshot.docs[0].id;
    }

    // Create new
    const newConv = await convRef.add({
        leadId,
        agentType,
        channel,
        status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        metadata: {
            messageCount: 0,
            firstContactAt: admin.firestore.FieldValue.serverTimestamp(),
            lastMessageAt: admin.firestore.FieldValue.serverTimestamp()
        }
    });
    return newConv.id;
}

function extractEmail(fromHeader: string): string | null {
    if (!fromHeader) return null;
    // Format: "Name <email@example.com>" or just "email@example.com"
    const match = fromHeader.match(/<(.+)>/);
    if (match) return match[1];
    if (fromHeader.includes('@')) return fromHeader;
    return null;
}

async function logOutboundMessage(conversationId: string, agentType: string, channel: string, content: string, aiContext: any, status: string) {
    await db.collection(`conversations/${conversationId}/messages`).add({
        direction: 'outbound',
        sender: `ai_${agentType}`,
        channel,
        content,
        aiContext: {
            docsUsed: aiContext.docsUsed,
            confidence: aiContext.confidence,
            reasoning: aiContext.reasoning
        },
        status,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
}

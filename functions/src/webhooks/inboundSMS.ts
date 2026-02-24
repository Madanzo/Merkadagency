import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { generateAIResponse } from "../ai/generateResponse";
import { getAgentConfig } from "../ai/agentConfig";
import * as plivo from 'plivo';

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// PLIVO Client Init
const PLIVO_AUTH_ID = process.env.PLIVO_AUTH_ID;
const PLIVO_AUTH_TOKEN = process.env.PLIVO_AUTH_TOKEN;
// const PLIVO_SOURCE_NUMBER = process.env.PLIVO_SOURCE_NUMBER; // If we need to specify source

const plivoClient = (PLIVO_AUTH_ID && PLIVO_AUTH_TOKEN)
    ? new plivo.Client(PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN)
    : null;

export const handleInboundSMS = functions.https.onRequest(async (req, res) => {
    // Basic method check
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { From, To, Text } = req.body;
        // Plivo sends params in body

        if (!From || !Text) {
            console.error("Missing From or Text in Plivo webhook", req.body);
            res.status(400).send("Bad Request");
            return;
        }

        const incomingMessage = Text;
        const senderPhone = From;

        // 1. Find or Create Lead
        const lead = await findOrCreateLead(senderPhone, { phone: senderPhone, source: 'sms_inbound' });

        // 2. Determine Agent Type
        const agentType = await determineAgentType(lead, incomingMessage);

        // 3. Find or Create Conversation
        const conversationId = await findOrCreateConversation(lead.id, agentType, 'sms');

        // 4. Log Inbound Message
        await db.collection(`conversations/${conversationId}/messages`).add({
            direction: 'inbound',
            sender: 'customer',
            channel: 'sms',
            content: incomingMessage,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'received'
        });

        // Update conv metadata
        await db.collection('conversations').doc(conversationId).update({
            'metadata.lastMessageAt': admin.firestore.FieldValue.serverTimestamp(),
            'metadata.messageCount': admin.firestore.FieldValue.increment(1),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 5. Generate AI Response
        const historySnapshot = await db.collection(`conversations/${conversationId}/messages`)
            .orderBy('timestamp', 'asc')
            .limitToLast(10)
            .get();

        const history = historySnapshot.docs.map(d => d.data());

        const aiResult = await generateAIResponse({
            conversationId,
            incomingMessage,
            agentType,
            channel: 'sms',
            leadData: lead,
            history
        });

        const agentConfig = getAgentConfig(agentType);

        // 6. Action: Send or Queue
        if (aiResult.shouldEscalate) {
            await db.collection(`conversations/${conversationId}/messages`).add({
                direction: 'outbound',
                sender: 'system',
                channel: 'sms',
                content: `[ESCALATION REQUIRED] AI prevented response. Reason: ${aiResult.reasoning}`,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                status: 'internal_note'
            });
            await db.collection('conversations').doc(conversationId).update({ status: 'escalated' });

        } else if (agentConfig.responseSettings.autoSend) {
            // Typing Delay Simulation
            if (agentConfig.responseSettings.typingDelay) {
                // We can't actually sleep explicitly in a cloud function safely if it times out, 
                // but for 2-5 seconds it's usually fine. 
                // Better approach: Scheduling, but simple sleep works for MVP.
                const delay = 2000 + Math.random() * 3000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Send SMS
            if (plivoClient) {
                await plivoClient.messages.create(
                    To, // Source number (customer sent TO this)
                    senderPhone, // Destination (Customer)
                    aiResult.response
                );
            } else {
                console.warn("Plivo client not initialized - skipping actual send");
            }

            await logOutboundMessage(conversationId, agentType, 'sms', aiResult.response, aiResult, 'sent');
        } else {
            // Queue for Approval
            await db.collection('approval_queue').add({
                conversationId,
                agentType,
                channel: 'sms',
                originalMessage: incomingMessage,
                proposedResponse: aiResult.response,
                aiReasoning: aiResult.reasoning,
                docsUsed: aiResult.docsUsed,
                priority: 'medium',
                status: 'pending',
                leadPhone: senderPhone,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            await logOutboundMessage(conversationId, agentType, 'sms', aiResult.response, aiResult, 'pending_approval');
        }

        res.status(200).send('OK');

    } catch (error) {
        console.error("Error processing inbound SMS:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Helpers (Duplicated from email for now to keep files self-contained or could move to common)
// Moving to common helper file would be better, but for speed keeping local or I should extract them.
// Let's create a shared helper file next time. For now, simple duplication is acceptable for MVP speed or I can extract if I want to be clean.
// Given strict TS, extracting is better. I'll put them in `../utils/leadHelpers.ts` if I had time, 
// but currently I'll just duplicate these small helpers.

async function findOrCreateLead(identifier: string, defaults: any) {
    const leadsRef = db.collection('leads');
    // Check email or phone depending on input
    let query = leadsRef.limit(1);
    if (defaults.phone) query = leadsRef.where('phone', '==', identifier);
    else query = leadsRef.where('email', '==', identifier);

    const snapshot = await query.get();

    if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    const newLeadRef = leadsRef.doc();
    const newLead = {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...defaults
    };
    await newLeadRef.set(newLead);
    return { id: newLeadRef.id, ...newLead };
}

async function determineAgentType(lead: any, message: string): Promise<'support' | 'sales'> {
    if (lead.status === 'customer' || lead.tags?.includes('customer')) {
        return 'support';
    }
    return 'sales';
}

async function findOrCreateConversation(leadId: string, agentType: string, channel: string) {
    const convRef = db.collection('conversations');
    const snapshot = await convRef
        .where('leadId', '==', leadId)
        .where('agentType', '==', agentType)
        .where('status', '==', 'active')
        .limit(1)
        .get();

    if (!snapshot.empty) {
        return snapshot.docs[0].id;
    }

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

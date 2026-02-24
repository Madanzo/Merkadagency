import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { getAnthropicClient, getSystemPrompt, CLAUDE_MODEL, safeParseJSON } from './anthropicClient';

const db = getFirestore();

// ============ TYPES ============

interface EmailDraft {
    subject: string;
    body: string;
}

// ============ AGENT 1: CONTRACT & SALES AGENT ============

/**
 * Generate a professional email to accompany a contract.
 * Called from frontend when a contract is created.
 */
export const generateContractEmail = onCall({ maxInstances: 5 }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be authenticated');

    const { clientName, clientBusiness, clientEmail, services, totalAmount, contractNumber, clientId } = request.data;

    logger.info(`Sales Agent: Generating contract email for ${clientName}`);

    try {
        const systemPrompt = await getSystemPrompt();
        const anthropic = getAnthropicClient();

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: `Draft a professional email to send with this contract.

Client: ${clientName} from ${clientBusiness || 'their business'}
Services quoted: ${services || 'Marketing services'}
Total amount: $${totalAmount || 0}
Contract number: ${contractNumber || 'N/A'}

The email should:
- Be warm but professional
- Briefly summarize what was agreed
- Explain next steps after signing
- Sound exactly like MerkadAgency's brand voice
- Be under 150 words

Return as JSON only: { "subject": "email subject", "body": "email body text" }`
            }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const draft = safeParseJSON<EmailDraft>(text);

        if (!draft) {
            // Fallback: use raw text as body
            const fallbackDraft: EmailDraft = {
                subject: `Your Contract ${contractNumber || ''} from MerkadAgency`,
                body: text
            };
            await saveToInbox(clientId, clientName, clientEmail, fallbackDraft, 'sales', 'contract_email');
            return fallbackDraft;
        }

        // Save to inbox for review
        await saveToInbox(clientId, clientName, clientEmail, draft, 'sales', 'contract_email');

        return draft;
    } catch (error) {
        logger.error('Sales Agent error:', error);
        throw new HttpsError('internal', 'Failed to generate contract email');
    }
});

/**
 * Generate onboarding email after contract is signed.
 */
export const generateOnboardingEmail = onCall({ maxInstances: 5 }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be authenticated');

    const { clientName, clientBusiness, clientEmail, services, clientId } = request.data;

    logger.info(`Sales Agent: Generating onboarding email for ${clientName}`);

    try {
        const systemPrompt = await getSystemPrompt();
        const anthropic = getAnthropicClient();

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: `Draft a congratulations + onboarding email for a client who just signed their contract.

Client: ${clientName} from ${clientBusiness || 'their business'}
Services they signed up for: ${services || 'Marketing services'}

The email should:
- Congratulate them on getting started
- Outline the onboarding process (kickoff call, access setup, timeline)
- Set expectations for first deliverables
- Be enthusiastic but professional
- Be under 150 words

Return as JSON only: { "subject": "email subject", "body": "email body text" }`
            }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const draft = safeParseJSON<EmailDraft>(text) || { subject: 'Welcome to MerkadAgency!', body: text };

        await saveToInbox(clientId, clientName, clientEmail, draft, 'sales', 'onboarding_email');

        return draft;
    } catch (error) {
        logger.error('Sales Agent error:', error);
        throw new HttpsError('internal', 'Failed to generate onboarding email');
    }
});

/**
 * Generate follow-up email for stale contracts or quotes.
 */
export const generateFollowUpEmail = onCall({ maxInstances: 5 }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be authenticated');

    const { clientName, clientBusiness, clientEmail, itemType, itemNumber, daysSince, clientId } = request.data;

    logger.info(`Sales Agent: Generating follow-up for ${clientName} (${itemType} stale ${daysSince} days)`);

    try {
        const systemPrompt = await getSystemPrompt();
        const anthropic = getAnthropicClient();

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 800,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: `Draft a friendly follow-up email for a ${itemType} that hasn't received a response.

Client: ${clientName} from ${clientBusiness || 'their business'}
${itemType} number: ${itemNumber || 'N/A'}
Days since last contact: ${daysSince || 3}

The email should:
- Be gentle, not pushy
- Reference the specific ${itemType}
- Ask if they have questions
- Offer to adjust terms if needed
- Be under 100 words

Return as JSON only: { "subject": "email subject", "body": "email body text" }`
            }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const draft = safeParseJSON<EmailDraft>(text) || { subject: `Following up on your ${itemType}`, body: text };

        await saveToInbox(clientId, clientName, clientEmail, draft, 'sales', 'follow_up_email');

        return draft;
    } catch (error) {
        logger.error('Sales Agent error:', error);
        throw new HttpsError('internal', 'Failed to generate follow-up email');
    }
});

// ============ HELPER: SAVE TO INBOX ============

async function saveToInbox(
    clientId: string,
    clientName: string,
    clientEmail: string,
    draft: EmailDraft,
    agentSource: 'sales' | 'marketing' | 'system',
    emailType: string
) {
    await db.collection('inbox').add({
        type: 'email_draft',
        agentSource,
        emailType,
        clientId,
        clientName,
        clientEmail,
        status: 'pending_review',
        emailDraft: draft,
        scheduledFor: null,
        createdAt: FieldValue.serverTimestamp(),
    });
}

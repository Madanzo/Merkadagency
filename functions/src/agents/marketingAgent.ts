import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { getAnthropicClient, getSystemPrompt, CLAUDE_MODEL, safeParseJSON } from './anthropicClient';

const db = getFirestore();

// ============ TYPES ============

interface SequenceEmail {
    subject: string;
    body: string;
}

interface ReEngagementSequence {
    email1: SequenceEmail;
    email2: SequenceEmail;
    email3: SequenceEmail;
}

// ============ AGENT 2: MARKETING AGENT ============

/**
 * Generate a 3-email re-engagement sequence for a cold lead.
 */
export const generateReEngagementSequence = onCall({ maxInstances: 5 }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be authenticated');

    const { leadName, leadBusiness, leadEmail, serviceInterest, daysSinceContact, leadId } = request.data;

    logger.info(`Marketing Agent: Generating re-engagement sequence for ${leadName}`);

    try {
        const systemPrompt = await getSystemPrompt();
        const anthropic = getAnthropicClient();

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: `Create a 3-email re-engagement sequence for a cold lead.

Lead: ${leadName} from ${leadBusiness || 'their business'}
Original interest: ${serviceInterest || 'Marketing services'}
Days since last contact: ${daysSinceContact || 7}

Email 1 (Day 0): Soft check-in — casual, friendly, no pressure
Email 2 (Day 3): Value-add — share a relevant insight or tip
Email 3 (Day 7): Final follow-up with soft deadline or special offer

Each email should be under 100 words. Use MerkadAgency's brand voice.

Return as JSON only:
{
  "email1": { "subject": "...", "body": "..." },
  "email2": { "subject": "...", "body": "..." },
  "email3": { "subject": "...", "body": "..." }
}`
            }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const sequence = safeParseJSON<ReEngagementSequence>(text);

        if (!sequence) {
            throw new HttpsError('internal', 'Failed to parse AI sequence response');
        }

        // Save sequence to Firestore
        const now = new Date();
        const sequenceRef = await db.collection('sequences').add({
            leadId,
            leadName,
            leadEmail,
            createdBy: 'ai',
            status: 'pending_review',
            emails: [
                { ...sequence.email1, sendAt: now.toISOString(), status: 'pending', day: 0 },
                { ...sequence.email2, sendAt: new Date(now.getTime() + 3 * 86400000).toISOString(), status: 'pending', day: 3 },
                { ...sequence.email3, sendAt: new Date(now.getTime() + 7 * 86400000).toISOString(), status: 'pending', day: 7 },
            ],
            createdAt: FieldValue.serverTimestamp(),
        });

        // Add to inbox for review
        await db.collection('inbox').add({
            type: 'email_draft',
            agentSource: 'marketing',
            emailType: 're_engagement_sequence',
            clientId: leadId,
            clientName: leadName,
            clientEmail: leadEmail,
            status: 'pending_review',
            emailDraft: {
                subject: `3-Email Re-engagement Sequence for ${leadName}`,
                body: `Email 1: "${sequence.email1.subject}"\nEmail 2: "${sequence.email2.subject}"\nEmail 3: "${sequence.email3.subject}"`,
            },
            sequenceId: sequenceRef.id,
            scheduledFor: null,
            createdAt: FieldValue.serverTimestamp(),
        });

        return { sequenceId: sequenceRef.id, sequence };
    } catch (error) {
        logger.error('Marketing Agent error:', error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Failed to generate re-engagement sequence');
    }
});

/**
 * Generate a campaign email draft from a brief.
 */
export const generateCampaignDraft = onCall({ maxInstances: 5 }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be authenticated');

    const { brief, targetAudience, campaignGoal } = request.data;

    logger.info('Marketing Agent: Generating campaign draft');

    try {
        const systemPrompt = await getSystemPrompt();
        const anthropic = getAnthropicClient();

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: `Draft a marketing email campaign based on this brief:

Brief: ${brief || 'General marketing email'}
Target audience: ${targetAudience || 'Small business owners'}
Campaign goal: ${campaignGoal || 'Generate leads'}

Create a compelling email with:
- Attention-grabbing subject line
- Professional body copy (under 200 words)
- Clear call to action
- MerkadAgency brand voice

Return as JSON only: { "subject": "...", "body": "..." }`
            }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const draft = safeParseJSON<{ subject: string; body: string }>(text) || { subject: 'New Campaign', body: text };

        return draft;
    } catch (error) {
        logger.error('Marketing Agent error:', error);
        throw new HttpsError('internal', 'Failed to generate campaign draft');
    }
});

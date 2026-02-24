import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { getAnthropicClient, getSystemPrompt, CLAUDE_MODEL, safeParseJSON } from './anthropicClient';

// ============ TYPES ============

interface ClientSummary {
    summary: string;
    urgency: 'low' | 'medium' | 'high';
    nextAction: string;
    nextActionType: 'call' | 'email' | 'follow_up' | 'close' | 'onboard';
}

interface LeadScore {
    score: number;
    reasoning: string;
    recommendedService: string;
}

// ============ AI SUMMARY (Profile Card) ============

/**
 * Generate an AI-powered summary for a client profile.
 * Replaces the rule-based summary from Phase 1.
 */
export const generateClientSummary = onCall({ maxInstances: 10 }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be authenticated');

    const { personName, personType, personStatus, timeline, quotes, contracts, daysSinceActivity } = request.data;

    logger.info(`AI Summary: Generating for ${personName}`);

    try {
        const systemPrompt = await getSystemPrompt();
        const anthropic = getAnthropicClient();

        // Trim data to avoid token overflow
        const timelineSlice = Array.isArray(timeline) ? timeline.slice(0, 10) : [];
        const quotesSlice = Array.isArray(quotes) ? quotes.slice(0, 5) : [];
        const contractsSlice = Array.isArray(contracts) ? contracts.slice(0, 5) : [];

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 300,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: `Analyze this client and give a 2-3 sentence summary and one suggested next action.

Person: ${personName}
Type: ${personType} (lead/client/converted)
Status: ${personStatus}
Days since last activity: ${daysSinceActivity || 0}

Recent timeline events: ${JSON.stringify(timelineSlice)}
Active quotes: ${JSON.stringify(quotesSlice.map((q: any) => ({
                    number: q.quoteNumber,
                    status: q.status,
                    total: q.quote?.finalOneTimeTotal || 0,
                })))}
Contracts: ${JSON.stringify(contractsSlice.map((c: any) => ({
                    number: c.contractNumber,
                    status: c.status,
                    total: c.finalOneTimeTotal || 0,
                })))}

Return as JSON only:
{
  "summary": "2-3 sentence insight about this person",
  "urgency": "low | medium | high",
  "nextAction": "specific action to take",
  "nextActionType": "call | email | follow_up | close | onboard"
}`
            }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const summary = safeParseJSON<ClientSummary>(text);

        if (!summary) {
            return {
                summary: text.substring(0, 200),
                urgency: 'medium',
                nextAction: 'Review profile manually',
                nextActionType: 'follow_up',
            };
        }

        return summary;
    } catch (error) {
        logger.error('AI Summary error:', error);
        throw new HttpsError('internal', 'Failed to generate AI summary');
    }
});

// ============ LEAD SCORING ============

/**
 * Score a lead from 1-10 based on fit for MerkadAgency services.
 */
export const scoreLead = onCall({ maxInstances: 10 }, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Must be authenticated');

    const { leadName, leadEmail, leadPhone, leadSource, leadService, leadCity, leadNotes } = request.data;

    logger.info(`Lead Scoring: Scoring ${leadName}`);

    try {
        const systemPrompt = await getSystemPrompt();
        const anthropic = getAnthropicClient();

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 200,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: `Score this lead from 1-10 based on fit for MerkadAgency services.

Lead data:
- Name: ${leadName || 'Unknown'}
- Email: ${leadEmail || 'Not provided'}
- Phone: ${leadPhone || 'Not provided'}
- Source: ${leadSource || 'Unknown'}
- Interested in: ${leadService || 'General inquiry'}
- City: ${leadCity || 'Unknown'}
- Notes: ${leadNotes || 'None'}

Consider: business type, budget signals, service interest match, urgency indicators, completeness of information.

Return JSON only:
{
  "score": number_1_to_10,
  "reasoning": "one sentence explaining the score",
  "recommendedService": "best matching service from our catalog"
}`
            }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        const score = safeParseJSON<LeadScore>(text);

        if (!score) {
            return { score: 5, reasoning: 'Unable to score — review manually', recommendedService: 'General consultation' };
        }

        return score;
    } catch (error) {
        logger.error('Lead scoring error:', error);
        throw new HttpsError('internal', 'Failed to score lead');
    }
});

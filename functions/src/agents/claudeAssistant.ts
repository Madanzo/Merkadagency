/**
 * Claude Assistant Cloud Function
 * Proxies chat messages to the Anthropic API with CRM context.
 * Called from the admin dashboard chat panel.
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAnthropicClient, CLAUDE_MODEL } from './anthropicClient';
import * as logger from 'firebase-functions/logger';

export const claudeAssistantChat = onCall(
    { maxInstances: 10, timeoutSeconds: 60 },
    async (request) => {
        // Only authenticated admin users can use this
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'Must be logged in');
        }

        const { message, crmContext, conversationHistory } = request.data;

        if (!message) {
            throw new HttpsError('invalid-argument', 'Message is required');
        }

        const systemPrompt = `You are Claude, the AI assistant built into MerkadAgency CRM dashboard.
You have direct access to live CRM data provided below.
You help Camilo manage his digital marketing agency.

CURRENT CRM DATA:
${JSON.stringify(crmContext || {}, null, 2)}

RULES:
- Answer using ONLY the real data provided above
- Be concise and direct — this is a dashboard assistant, not a chatbot
- Format numbers as currency when relevant ($1,234)
- For lists use simple bullet points with key details
- If an action was taken, confirm it clearly with ✅
- Suggest the next logical action when relevant
- Never make up data not in the context
- If you don't have enough context, say what additional data you'd need
- Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

TONE: Professional, direct, helpful. Like a smart operations manager giving a briefing.
Keep responses under 300 words unless the user asks for detail.`;

        try {
            const anthropic = getAnthropicClient();

            // Build message history (keep last 10 messages for context)
            const messages = (conversationHistory || [])
                .slice(-10)
                .map((m: { role: string; content: string }) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                }));

            // Add current message
            messages.push({ role: 'user' as const, content: message });

            const response = await anthropic.messages.create({
                model: CLAUDE_MODEL,
                max_tokens: 1024,
                system: systemPrompt,
                messages,
            });

            const reply = response.content?.[0]?.type === 'text'
                ? response.content[0].text
                : 'Sorry, I had trouble processing that.';

            return { reply };
        } catch (error: any) {
            logger.error('Claude Assistant error:', error);
            throw new HttpsError('internal', 'Failed to get AI response');
        }
    }
);

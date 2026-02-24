import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { SUPPORT_AGENT_PROMPT, SALES_AGENT_PROMPT } from './agentConfig';
import * as logger from "firebase-functions/logger";

let openai: OpenAI | null = null;
let pinecone: Pinecone | null = null;

function getOpenAI() {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
    }
    return openai;
}

function getPinecone() {
    if (!pinecone) {
        pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
    }
    return pinecone;
}
const INDEX_NAME = 'master-contractor-kb';

interface GenerateResponseParams {
    conversationId: string;
    incomingMessage: string;
    agentType: 'support' | 'sales';
    channel: 'email' | 'sms';
    leadData: any;
    history: any[]; // Array of message objects
}

export interface AIResponse {
    response: string;
    language: string;
    docsUsed: string[];
    confidence: number;
    shouldEscalate: boolean;
    reasoning: string;
}

export async function generateAIResponse(params: GenerateResponseParams): Promise<AIResponse> {
    const { incomingMessage, agentType, channel, history } = params;

    logger.info(`Generating AI response for conversation ${params.conversationId} (${agentType})`);

    try {
        // 1. Detect language (Simple heuristic or fast LLM call)
        const language = await detectLanguage(incomingMessage);

        // 2. Search knowledge base
        const contextDocs = await searchKnowledgeBase(incomingMessage, agentType, language);

        // 3. Prepare Prompt
        const systemPromptTemplate = agentType === 'support' ? SUPPORT_AGENT_PROMPT : SALES_AGENT_PROMPT;

        // Format context and history
        const contextString = contextDocs.length > 0
            ? contextDocs.map(d => `[${d.title}]: ${d.text}`).join('\n\n')
            : "No specific knowledge base results found.";

        const historyString = history.map(m => `${m.sender}: ${m.content}`).join('\n');

        const filledPrompt = systemPromptTemplate
            .replace('{context}', contextString)
            .replace('{history}', historyString)
            .replace('{message}', incomingMessage);

        // Explicitly instruct language based on detection to avoid ambiguity
        const languageInstruction = language === 'es'
            ? "\n\nIMPORTANT: The user is speaking Spanish. Respond in Spanish."
            : "\n\nIMPORTANT: The user is speaking English. Respond in English.";

        const finalSystemPrompt = filledPrompt + languageInstruction;

        // 4. Call OpenAI
        const completion = await getOpenAI().chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: finalSystemPrompt },
                { role: 'user', content: incomingMessage }
            ],
            temperature: 0.7,
            max_tokens: channel === 'sms' ? 200 : 500, // Shorter for SMS
        });

        let response = completion.choices[0].message.content || "";

        // 5. Post-processing
        // TODO: Implement SMS shortener if needed specifically, though max_tokens helps.

        // 6. Check escalation
        const shouldEscalate = await checkEscalation(incomingMessage, response);

        return {
            response,
            language,
            docsUsed: contextDocs.map(d => d.docId),
            confidence: contextDocs.length > 0 ? 0.9 : 0.5, // Simple confidence proxy
            shouldEscalate,
            reasoning: `Used ${contextDocs.length} knowledge docs. Language: ${language}`,
        };

    } catch (error) {
        logger.error("Error generating AI response:", error);
        throw error;
    }
}

async function detectLanguage(text: string): Promise<string> {
    // Quick check for simple Spanish words if we want to save an API call, 
    // but for accuracy with mixed text, a small model is best.
    // Using gpt-4o-mini for cost efficiency.
    try {
        const completion = await getOpenAI().chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a language detector. Reply with only detection code: "en" for English, "es" for Spanish.' },
                { role: 'user', content: text }
            ],
            max_tokens: 5,
            temperature: 0,
        });
        const lang = completion.choices[0].message.content?.trim().toLowerCase();
        return lang === 'es' ? 'es' : 'en'; // Default to en
    } catch (e) {
        logger.warn("Language detection failed, defaulting to English", e);
        return 'en';
    }
}

interface KnowledgeMetadata {
    docId: string;
    text: string;
    title: string;
    [key: string]: any;
}

async function searchKnowledgeBase(query: string, agentType: string, language: string): Promise<KnowledgeMetadata[]> {
    try {
        const queryEmbedding = await getOpenAI().embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
        });

        const index = getPinecone().index(INDEX_NAME);
        const results = await index.query({
            vector: queryEmbedding.data[0].embedding,
            topK: 5,
            filter: {
                // Filter by agent type and language
                $and: [
                    {
                        agentType: { $in: [agentType, 'both'] }
                    },
                    {
                        language: { $in: [language, 'both'] }
                    }
                ]
            },
            includeMetadata: true,
        });

        return results.matches.map(match => match.metadata as KnowledgeMetadata);

    } catch (error) {
        logger.error("Pinecone search failed:", error);
        return [];
    }
}

async function checkEscalation(userMessage: string, aiResponse: string): Promise<boolean> {
    // Simple keywords for now, could use LLM classifier
    const escalationKeywords = ['lawyer', 'sue', 'manager', 'supervisor', 'human', 'person', 'complain'];
    const lowerMsg = userMessage.toLowerCase();

    if (escalationKeywords.some(k => lowerMsg.includes(k))) {
        return true;
    }

    // Check if AI gave up (heuristic based on prompt instructions)
    if (aiResponse.toLowerCase().includes("let me check with our team")) {
        // This might be a standard wait message, not necessarily escalation, but often requires human follow up.
        // Let's rely on explicit "escalate" flag if we ask LLM to output it using function calling, 
        // but that adds complexity. For now, simple keyword match.
    }

    return false;
}

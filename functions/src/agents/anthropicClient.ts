import Anthropic from '@anthropic-ai/sdk';
import { getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';

// ============ ANTHROPIC CLIENT ============

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
    if (!anthropicClient) {
        const apiKey = process.env.ANTHROPIC_API_KEY || '';
        if (!apiKey) {
            logger.warn('ANTHROPIC_API_KEY not set — AI agent calls will fail');
        }
        anthropicClient = new Anthropic({ apiKey });
    }
    return anthropicClient;
}

// ============ MODEL CONFIG ============

export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

// ============ KNOWLEDGE BASE CONTEXT BUILDER ============

/**
 * Fetches all active Knowledge Base documents from Firestore
 * and concatenates their content into a single context string.
 */
export async function buildKnowledgeContext(): Promise<string> {
    const db = getFirestore();
    const snapshot = await db
        .collection('knowledgeBase')
        .where('status', '==', 'active')
        .get();

    if (snapshot.empty) {
        return 'No knowledge base documents available.';
    }

    const sections = snapshot.docs.map((doc) => {
        const data = doc.data();
        const name = data.name || 'Untitled';
        const content = data.content || '';
        return `--- ${name} ---\n${content}`;
    });

    return sections.join('\n\n');
}

// ============ SYSTEM PROMPT ============

/**
 * Builds the full system prompt for any AI agent,
 * grounding all responses in the Knowledge Base.
 */
export async function getSystemPrompt(): Promise<string> {
    const knowledgeBase = await buildKnowledgeContext();

    return `You are an AI assistant for MerkadAgency, a digital marketing agency specializing in AI-powered automation, lead generation, SEO, social media management, and web development.

CRITICAL RULES:
- You ONLY discuss services, pricing, and information found in the knowledge base below
- You NEVER make up services, pricing, or promises not found in the knowledge base
- You ALWAYS maintain MerkadAgency's brand voice: professional, confident, results-focused
- You NEVER mention competitors by name
- You NEVER discuss topics outside of marketing and MerkadAgency's services
- If asked something outside your knowledge base, say: "Let me connect you with our team for that"
- All emails should be warm but professional, concise, and action-oriented

KNOWLEDGE BASE:
${knowledgeBase}

Today's date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
}

// ============ HELPER: SAFE JSON PARSE ============

/**
 * Attempts to parse JSON from Claude's response, handling markdown code blocks.
 */
export function safeParseJSON<T>(text: string): T | null {
    try {
        // Strip markdown code blocks if present
        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        return JSON.parse(cleaned) as T;
    } catch {
        logger.warn('Failed to parse JSON from AI response:', text.substring(0, 200));
        return null;
    }
}

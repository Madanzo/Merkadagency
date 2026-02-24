import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Lazy initialization to prevent deployment crashes if env vars are missing during build/trigger analysis
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

interface KnowledgeDoc {
    id: string; // Document ID from Firestore
    agentType: 'support' | 'sales' | 'both';
    title: string;
    content: string;
    category: string;
    language: 'en' | 'es' | 'both';
    isActive: boolean;
}

export const processDocumentOnCreate = onDocumentCreated("knowledge_docs/{docId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        return;
    }
    const doc = snapshot.data() as KnowledgeDoc;
    doc.id = event.params.docId; // Ensure ID is present

    await processAndEmbedDocument(doc);
});

export const processDocumentOnUpdate = onDocumentUpdated("knowledge_docs/{docId}", async (event) => {
    const snapshot = event.data?.after;
    if (!snapshot) {
        return;
    }
    const doc = snapshot.data() as KnowledgeDoc;
    doc.id = event.params.docId;

    await processAndEmbedDocument(doc);
});

export async function processAndEmbedDocument(doc: KnowledgeDoc) {
    if (!doc.isActive) {
        // If inactive, we might want to delete from Pinecone, but for simplicity we'll just skip for now
        // or implement delete logic later.
        logger.info(`Document ${doc.id} is inactive, skipping embedding.`);
        return;
    }

    logger.info(`Processing document ${doc.id}: ${doc.title}`);

    try {
        // 1. Split content into chunks
        const chunks = splitIntoChunks(doc.content, 500); // ~500 tokens

        // 2. Create embeddings
        const embeddings = await Promise.all(
            chunks.map(async (chunk, index) => {
                const response = await getOpenAI().embeddings.create({
                    model: 'text-embedding-3-small',
                    input: chunk,
                });

                return {
                    id: `${doc.id}_chunk_${index}`,
                    values: response.data[0].embedding,
                    metadata: {
                        docId: doc.id,
                        agentType: doc.agentType,
                        category: doc.category,
                        language: doc.language,
                        title: doc.title,
                        text: chunk, // Store text in metadata for retrieval context
                    },
                };
            })
        );

        // 3. Upsert to Pinecone
        const index = getPinecone().index(INDEX_NAME);
        // Upsert in batches if necessary, but for now direct upsert
        await index.upsert(embeddings);

        logger.info(`Successfully embedded ${embeddings.length} chunks for document ${doc.id}`);

    } catch (error) {
        logger.error(`Error processing document ${doc.id}:`, error);
        throw error; // Retry on failure
    }
}

function splitIntoChunks(text: string, maxTokens: number): string[] {
    // Simple paragraph-based splitting
    const paragraphs = text.split('\n\n');
    const chunks: string[] = [];
    let currentChunk = '';

    // Rough estimate: 4 chars ~ 1 token
    const maxChars = maxTokens * 4;

    for (const para of paragraphs) {
        if ((currentChunk + para).length > maxChars) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = para;
        } else {
            currentChunk += (currentChunk ? '\n\n' : '') + para;
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    return chunks;
}

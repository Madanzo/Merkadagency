import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    Timestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { QuoteSummary, ProjectInfo } from "./pricing/calculator.types";

// ============ QUOTE TYPES ============

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface SavedQuote {
    id: string;
    clientId: string;
    quoteNumber: string;
    quote: QuoteSummary;
    projectInfo: ProjectInfo;
    status: QuoteStatus;
    sentAt?: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreateQuoteData = Omit<SavedQuote, "id" | "createdAt" | "updatedAt">;

// ============ HELPERS ============

/**
 * Generate a unique quote number: MKD-YYYYMMDD-XXX
 */
export function generateQuoteNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MKD-${year}${month}${day}-${random}`;
}

// ============ CRUD ============

/**
 * Save a quote under a client's subcollection
 */
export async function saveQuote(
    clientId: string,
    quote: QuoteSummary,
    projectInfo: ProjectInfo,
    status: QuoteStatus = 'draft'
): Promise<string> {
    const ref = collection(db, `clients/${clientId}/quotes`);
    const now = Timestamp.now();

    const docRef = await addDoc(ref, {
        clientId,
        quoteNumber: generateQuoteNumber(),
        quote,
        projectInfo,
        status,
        createdAt: now,
        updatedAt: now,
    });

    return docRef.id;
}

/**
 * Get all quotes for a client
 */
export async function getClientQuotes(clientId: string): Promise<SavedQuote[]> {
    const ref = collection(db, `clients/${clientId}/quotes`);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    })) as SavedQuote[];
}

/**
 * Get a single quote
 */
export async function getQuote(clientId: string, quoteId: string): Promise<SavedQuote | null> {
    const docRef = doc(db, `clients/${clientId}/quotes`, quoteId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...snapshot.data() } as SavedQuote;
}

/**
 * Update quote status
 */
export async function updateQuoteStatus(
    clientId: string,
    quoteId: string,
    status: QuoteStatus
): Promise<void> {
    const docRef = doc(db, `clients/${clientId}/quotes`, quoteId);
    const updates: Record<string, unknown> = {
        status,
        updatedAt: Timestamp.now(),
    };

    if (status === 'sent') {
        updates.sentAt = Timestamp.now();
    }

    await updateDoc(docRef, updates);
}

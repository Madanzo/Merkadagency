import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// Lead type definition
export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    source: "cal" | "form" | "manual";
    status: "new" | "contacted" | "qualified" | "closed-won" | "closed-lost";
    notes?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Type for creating a new lead (without id and timestamps)
export type CreateLeadData = Omit<Lead, "id" | "createdAt" | "updatedAt">;

// Type for updating a lead (partial, without id and createdAt)
export type UpdateLeadData = Partial<Omit<Lead, "id" | "createdAt">>;

const LEADS_COLLECTION = "leads";

/**
 * Fetch all leads from Firestore, ordered by creation date (newest first)
 */
export async function getLeads(): Promise<Lead[]> {
    const leadsRef = collection(db, LEADS_COLLECTION);
    const q = query(leadsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Lead[];
}

/**
 * Fetch a single lead by ID
 */
export async function getLead(id: string): Promise<Lead | null> {
    const docRef = doc(db, LEADS_COLLECTION, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    } as Lead;
}

/**
 * Create a new lead
 */
export async function createLead(data: CreateLeadData): Promise<string> {
    const leadsRef = collection(db, LEADS_COLLECTION);
    const now = Timestamp.now();

    const docRef = await addDoc(leadsRef, {
        ...data,
        createdAt: now,
        updatedAt: now,
    });

    return docRef.id;
}

/**
 * Update an existing lead
 */
export async function updateLead(id: string, data: UpdateLeadData): Promise<void> {
    const docRef = doc(db, LEADS_COLLECTION, id);

    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string): Promise<void> {
    const docRef = doc(db, LEADS_COLLECTION, id);
    await deleteDoc(docRef);
}

/**
 * Get leads by status
 */
export async function getLeadsByStatus(status: Lead["status"]): Promise<Lead[]> {
    const leads = await getLeads();
    return leads.filter((lead) => lead.status === status);
}

/**
 * Get lead counts by status (for dashboard stats)
 */
export async function getLeadStats(): Promise<Record<Lead["status"], number>> {
    const leads = await getLeads();

    return {
        new: leads.filter((l) => l.status === "new").length,
        contacted: leads.filter((l) => l.status === "contacted").length,
        qualified: leads.filter((l) => l.status === "qualified").length,
        "closed-won": leads.filter((l) => l.status === "closed-won").length,
        "closed-lost": leads.filter((l) => l.status === "closed-lost").length,
    };
}

// ============ KNOWLEDGE BASE HELPERS ============

export interface KnowledgeDoc {
    id: string;
    agentType: 'support' | 'sales' | 'both';
    title: string;
    content: string;
    category: string;
    language: 'en' | 'es' | 'both';
    isActive: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreateKnowledgeDocData = Omit<KnowledgeDoc, "id" | "createdAt" | "updatedAt">;
export type UpdateKnowledgeDocData = Partial<Omit<KnowledgeDoc, "id" | "createdAt">>;

const KNOWLEDGE_COLLECTION = "knowledge_docs";

export async function getKnowledgeDocs(): Promise<KnowledgeDoc[]> {
    const ref = collection(db, KNOWLEDGE_COLLECTION);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as KnowledgeDoc[];
}

export async function createKnowledgeDoc(data: CreateKnowledgeDocData): Promise<string> {
    const ref = collection(db, KNOWLEDGE_COLLECTION);
    const now = Timestamp.now();
    const docRef = await addDoc(ref, {
        ...data,
        createdAt: now,
        updatedAt: now,
    });
    return docRef.id;
}

export async function updateKnowledgeDoc(id: string, data: UpdateKnowledgeDocData): Promise<void> {
    const docRef = doc(db, KNOWLEDGE_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteKnowledgeDoc(id: string): Promise<void> {
    const docRef = doc(db, KNOWLEDGE_COLLECTION, id);
    await deleteDoc(docRef);
}

// ============ CONVERSATION HELPERS ============

export interface Conversation {
    id: string;
    leadId: string;
    agentType: 'support' | 'sales';
    channel: 'email' | 'sms';
    status: 'active' | 'resolved' | 'escalated' | 'converted';
    language: 'en' | 'es';
    metadata: {
        firstContactAt: Timestamp;
        lastMessageAt: Timestamp;
        messageCount: number;
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export const CONVERSATIONS_COLLECTION = "conversations";

export async function getConversations(): Promise<Conversation[]> {
    const ref = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(ref, orderBy("metadata.lastMessageAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Conversation[];
}

export async function getConversationMessages(conversationId: string): Promise<any[]> {
    // Note: This returns generic objects for messages as we didn't define Message interface deeply in frontend yet
    const ref = collection(db, `${CONVERSATIONS_COLLECTION}/${conversationId}/messages`);
    const q = query(ref, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============ AI AGENT CONFIG HELPERS ============

export interface AIAgent {
    id: 'support' | 'sales';
    name: string;
    isActive: boolean;
    personality: string;
    goals: string[];
    responseSettings: {
        autoSend: boolean;
        maxResponseTime: number;
        typingDelay: boolean;
    };
}

const AGENTS_COLLECTION = "ai_agents";

export async function getAgentConfigs(): Promise<AIAgent[]> {
    const ref = collection(db, AGENTS_COLLECTION);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AIAgent[];
}

export async function updateAgentConfig(id: string, data: Partial<AIAgent>): Promise<void> {
    const docRef = doc(db, AGENTS_COLLECTION, id);
    // Use set with merge to create if not exists or update
    const { setDoc } = await import("firebase/firestore");
    await setDoc(docRef, { ...data, updatedAt: Timestamp.now() }, { merge: true });
}

// ============ APPROVAL QUEUE HELPERS ============

export interface ApprovalItem {
    id: string;
    conversationId: string;
    agentType: 'support' | 'sales';
    channel: 'email' | 'sms';
    originalMessage: string;
    proposedResponse: string;
    aiReasoning: string;
    status: 'pending' | 'approved' | 'rejected';
    leadEmail?: string;
    leadPhone?: string;
    createdAt: Timestamp;
}

const APPROVAL_COLLECTION = "approval_queue";

export async function getApprovalQueue(): Promise<ApprovalItem[]> {
    const ref = collection(db, APPROVAL_COLLECTION);
    // Pending items first
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => item.status === 'pending') as ApprovalItem[];
}

export async function approveResponse(id: string, response: string): Promise<void> {
    const docRef = doc(db, APPROVAL_COLLECTION, id);
    // We would trigger a cloud function on update or manually send here.
    // Ideally we update status to 'approved' and let cloud function handle sending.
    // For now simple status update.
    await updateDoc(docRef, {
        status: 'approved',
        proposedResponse: response, // Allow editing
        updatedAt: Timestamp.now()
    });
}

export async function rejectResponse(id: string): Promise<void> {
    const docRef = doc(db, APPROVAL_COLLECTION, id);
    await updateDoc(docRef, { status: 'rejected', updatedAt: Timestamp.now() });
}

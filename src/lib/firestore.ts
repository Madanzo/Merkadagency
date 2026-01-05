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

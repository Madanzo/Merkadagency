import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    orderBy,
    Timestamp,
    arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export type LeadStatus = "new" | "contacted" | "booked" | "closed" | "lost";

export interface LeadNote {
    text: string;
    createdAt: Timestamp;
}

export interface Lead {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    source: string;
    status: LeadStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    notes: LeadNote[];
}

const LEADS_COLLECTION = "leads";

function getDb() {
    if (!db) throw new Error("Firestore not initialized");
    return db;
}

/**
 * Create a new lead in Firestore
 */
export async function createLead(
    data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes"> & { notes?: LeadNote[] }
): Promise<string> {
    const now = Timestamp.now();
    const leadData: Omit<Lead, "id"> = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        source: data.source,
        status: data.status,
        createdAt: now,
        updatedAt: now,
        notes: data.notes || [],
    };

    const docRef = await addDoc(collection(getDb(), LEADS_COLLECTION), leadData);
    return docRef.id;
}

/**
 * Update a lead's status or other fields
 */
export async function updateLead(
    leadId: string,
    updates: Partial<Pick<Lead, "name" | "email" | "phone" | "source" | "status">>
): Promise<void> {
    const leadRef = doc(getDb(), LEADS_COLLECTION, leadId);
    await updateDoc(leadRef, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Get all leads ordered by creation date (newest first)
 */
export async function getLeads(): Promise<Lead[]> {
    const q = query(collection(getDb(), LEADS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Lead[];
}

/**
 * Add a note to a lead
 */
export async function addNote(leadId: string, text: string): Promise<void> {
    const leadRef = doc(getDb(), LEADS_COLLECTION, leadId);
    const note: LeadNote = {
        text,
        createdAt: Timestamp.now(),
    };

    await updateDoc(leadRef, {
        notes: arrayUnion(note),
        updatedAt: Timestamp.now(),
    });
}

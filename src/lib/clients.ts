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
    where,
} from "firebase/firestore";
import { db } from "./firebase";

// ============ CLIENT PROFILE TYPES ============

export interface ClientProfile {
    id: string;
    name: string;
    business: string;
    email: string;
    phone: string;
    industry: string;
    website: string;
    notes: string;
    leadId?: string; // Optional link to existing lead
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type CreateClientData = Omit<ClientProfile, "id" | "createdAt" | "updatedAt">;
export type UpdateClientData = Partial<Omit<ClientProfile, "id" | "createdAt">>;

const CLIENTS_COLLECTION = "clients";

// ============ CRUD OPERATIONS ============

/**
 * Create a new client profile
 */
export async function createClient(data: CreateClientData): Promise<string> {
    const ref = collection(db, CLIENTS_COLLECTION);
    const now = Timestamp.now();

    const docRef = await addDoc(ref, {
        ...data,
        createdAt: now,
        updatedAt: now,
    });

    return docRef.id;
}

/**
 * Get all clients, ordered by creation date (newest first)
 */
export async function getClients(): Promise<ClientProfile[]> {
    const ref = collection(db, CLIENTS_COLLECTION);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    })) as ClientProfile[];
}

/**
 * Get a single client by ID
 */
export async function getClient(id: string): Promise<ClientProfile | null> {
    const docRef = doc(db, CLIENTS_COLLECTION, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...snapshot.data() } as ClientProfile;
}

/**
 * Update a client profile
 */
export async function updateClient(id: string, data: UpdateClientData): Promise<void> {
    const docRef = doc(db, CLIENTS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Delete a client profile
 */
export async function deleteClient(id: string): Promise<void> {
    const docRef = doc(db, CLIENTS_COLLECTION, id);
    await deleteDoc(docRef);
}

/**
 * Search clients by name or business
 */
export async function searchClients(searchTerm: string): Promise<ClientProfile[]> {
    const clients = await getClients();
    const term = searchTerm.toLowerCase();
    return clients.filter(
        (c) =>
            c.name.toLowerCase().includes(term) ||
            c.business.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term)
    );
}

/**
 * Get client by linked lead ID
 */
export async function getClientByLeadId(leadId: string): Promise<ClientProfile | null> {
    const ref = collection(db, CLIENTS_COLLECTION);
    const q = query(ref, where("leadId", "==", leadId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as ClientProfile;
}

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    setDoc,
    Timestamp,
    query,
    orderBy,
    runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import { updateLead } from "./firestore";
import type { QuoteSummary, ProjectInfo } from "./pricing/calculator.types";

// ============ CONTRACT TYPES ============

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'declined' | 'cancelled';

export interface SignatureData {
    clientSignature: string; // base64 PNG
    ipAddress: string;
    userAgent: string;
    signedAt: string; // ISO string
}

export interface Contract {
    id: string;
    clientId: string;
    quoteId: string;
    leadId?: string;
    contractNumber: string;
    services: Array<{ label: string; price: number; description?: string }>;
    monthlyServices: Array<{ label: string; price: number; description?: string }>;
    oneTimeTotal: number;
    monthlyTotal: number;
    finalOneTimeTotal: number;
    finalMonthlyTotal: number;
    paymentTerms: string;
    projectInfo: ProjectInfo;
    status: ContractStatus;
    sentAt?: Timestamp;
    signedAt?: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    // Phase 3 — Signing
    signatureData?: SignatureData;
    publicToken?: string;
    publicUrl?: string;
    tokenExpiry?: Timestamp;
    pdfUrl?: string;
}

export type CreateContractData = Omit<Contract, "id" | "createdAt" | "updatedAt">;

// ============ SEQUENTIAL CONTRACT NUMBERING ============

const COUNTER_DOC = "counters/contracts";

/**
 * Generate sequential contract number: MRK-YYYY-XXXX
 * Uses Firestore transaction for atomic increment
 */
export async function generateContractNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const counterRef = doc(db, COUNTER_DOC);

    try {
        const result = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);

            let nextNumber = 1;
            if (counterDoc.exists()) {
                const data = counterDoc.data();
                // Reset counter if year changed
                if (data.year === year) {
                    nextNumber = (data.lastNumber || 0) + 1;
                }
            }

            transaction.set(counterRef, { year, lastNumber: nextNumber });
            return nextNumber;
        });

        return `MRK-${year}-${String(result).padStart(4, '0')}`;
    } catch {
        // Fallback if transaction fails (e.g., permissions)
        const random = Math.floor(Math.random() * 9000 + 1000);
        return `MRK-${year}-${random}`;
    }
}

// ============ CRUD ============

/**
 * Create a contract from a saved quote
 */
export async function createContract(
    clientId: string,
    quoteId: string,
    quote: QuoteSummary,
    projectInfo: ProjectInfo,
    leadId?: string
): Promise<string> {
    const ref = collection(db, `clients/${clientId}/contracts`);
    const now = Timestamp.now();
    const contractNumber = await generateContractNumber();

    // Map quote data into contract format
    const services = [
        { label: quote.basePackage.label, price: quote.basePackage.price, description: quote.basePackage.description || '' },
        ...quote.addons.map((a) => ({ label: a.label, price: a.price, description: a.description || '' })),
    ];

    const monthlyServices = quote.monthly.map((m) => ({
        label: m.label,
        price: m.price,
        description: m.description || '',
    }));

    // Payment terms label
    let paymentTerms = '50% deposit, 50% upon completion';
    switch (projectInfo.paymentTerms) {
        case '50-50': paymentTerms = '50% deposit to commence work, 50% upon completion'; break;
        case '100-upfront': paymentTerms = '100% payment upfront before work commences'; break;
        case '30-60-10': paymentTerms = '30% deposit, 60% at midpoint delivery, 10% upon final completion'; break;
        case 'net-30': paymentTerms = 'Net 30 — full payment due within 30 days of invoice'; break;
        case 'custom': paymentTerms = 'Custom payment terms as agreed upon'; break;
    }

    const contractData: Omit<Contract, 'id'> = {
        clientId,
        quoteId,
        contractNumber,
        services,
        monthlyServices,
        oneTimeTotal: quote.oneTimeTotal,
        monthlyTotal: quote.monthlyTotal,
        finalOneTimeTotal: quote.finalOneTimeTotal,
        finalMonthlyTotal: quote.finalMonthlyTotal,
        paymentTerms,
        projectInfo,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
    };

    if (leadId) {
        contractData.leadId = leadId;
    }

    const docRef = await addDoc(ref, contractData);
    return docRef.id;
}

/**
 * Get all contracts for a client
 */
export async function getClientContracts(clientId: string): Promise<Contract[]> {
    const ref = collection(db, `clients/${clientId}/contracts`);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    })) as Contract[];
}

/**
 * Get a single contract
 */
export async function getContract(clientId: string, contractId: string): Promise<Contract | null> {
    const docRef = doc(db, `clients/${clientId}/contracts`, contractId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...snapshot.data() } as Contract;
}

/**
 * Update contract status with automatic lead sync
 */
export async function updateContractStatus(
    clientId: string,
    contractId: string,
    status: ContractStatus
): Promise<void> {
    const docRef = doc(db, `clients/${clientId}/contracts`, contractId);

    // Get the contract to check for leadId
    const contractSnap = await getDoc(docRef);
    const contractData = contractSnap.exists() ? contractSnap.data() : null;

    const updates: Record<string, unknown> = {
        status,
        updatedAt: Timestamp.now(),
    };

    if (status === 'sent') {
        updates.sentAt = Timestamp.now();
    }
    if (status === 'signed') {
        updates.signedAt = Timestamp.now();
    }

    await updateDoc(docRef, updates);

    // ===== STATUS SYNC: Contract → Lead =====
    if (contractData?.leadId) {
        try {
            if (status === 'signed') {
                await updateLead(contractData.leadId, { status: 'closed-won' });
            } else if (status === 'declined') {
                await updateLead(contractData.leadId, { status: 'closed-lost' });
            }
        } catch (err) {
            console.warn('Failed to sync lead status:', err);
        }
    }
}

/**
 * Duplicate a contract as a new draft
 */
export async function duplicateContract(
    clientId: string,
    contractId: string
): Promise<string> {
    const original = await getContract(clientId, contractId);
    if (!original) throw new Error('Contract not found');

    const ref = collection(db, `clients/${clientId}/contracts`);
    const now = Timestamp.now();
    const contractNumber = await generateContractNumber();

    const { id, createdAt, updatedAt, sentAt, signedAt, ...rest } = original;

    const docRef = await addDoc(ref, {
        ...rest,
        contractNumber,
        status: 'draft' as ContractStatus,
        createdAt: now,
        updatedAt: now,
    });

    return docRef.id;
}

// ============ EXTENSIONS ============

/**
 * Update the pricing scope and project details of a draft contract.
 */
export async function updateContractScope(
    clientId: string,
    contractId: string,
    quote: QuoteSummary,
    projectInfo: ProjectInfo
): Promise<void> {
    const docRef = doc(db, `clients/${clientId}/contracts`, contractId);

    // Map quote data into contract format
    const services = [
        { label: quote.basePackage.label, price: quote.basePackage.price, description: quote.basePackage.description || '' },
        ...quote.addons.map((a) => ({ label: a.label, price: a.price, description: a.description || '' })),
    ];

    const monthlyServices = quote.monthly.map((m) => ({
        label: m.label,
        price: m.price,
        description: m.description || '',
    }));

    // Payment terms label
    let paymentTerms = '50% deposit, 50% upon completion';
    switch (projectInfo.paymentTerms) {
        case '50-50': paymentTerms = '50% deposit to commence work, 50% upon completion'; break;
        case '100-upfront': paymentTerms = '100% payment upfront before work commences'; break;
        case '30-60-10': paymentTerms = '30% deposit, 60% at midpoint delivery, 10% upon final completion'; break;
        case 'net-30': paymentTerms = 'Net 30 — full payment due within 30 days of invoice'; break;
        case 'custom': paymentTerms = 'Custom payment terms as agreed upon'; break;
    }

    await updateDoc(docRef, {
        services,
        monthlyServices,
        oneTimeTotal: quote.oneTimeTotal,
        monthlyTotal: quote.monthlyTotal,
        finalOneTimeTotal: quote.finalOneTimeTotal,
        finalMonthlyTotal: quote.finalMonthlyTotal,
        paymentTerms,
        projectInfo,
        updatedAt: Timestamp.now(),
    });
}

// ============ PHASE 3: PUBLIC SIGNING ============

/**
 * Generate a public signing token + URL for a contract.
 * Expires in 30 days.
 */
export async function generatePublicToken(
    clientId: string,
    contractId: string,
    appUrl: string = 'https://merkadagency-dd2aa.web.app'
): Promise<{ token: string; publicUrl: string }> {
    const token = btoa(`${contractId}:${clientId}:${Date.now()}`);
    const publicUrl = `${appUrl}/sign/${contractId}?token=${token}`;
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30);

    const docRef = doc(db, `clients/${clientId}/contracts`, contractId);
    await updateDoc(docRef, {
        publicToken: token,
        publicUrl,
        tokenExpiry: Timestamp.fromDate(tokenExpiry),
        updatedAt: Timestamp.now(),
    });

    return { token, publicUrl };
}

/**
 * Mark a contract as "sent" and generate a public signing link.
 */
export async function sendContract(
    clientId: string,
    contractId: string
): Promise<string> {
    const { publicUrl } = await generatePublicToken(clientId, contractId);
    await updateContractStatus(clientId, contractId, 'sent');
    return publicUrl;
}

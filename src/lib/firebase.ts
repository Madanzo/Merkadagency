import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    // Check for service account credentials
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccount) {
        console.warn('⚠️ Firebase: No service account key found. Using default credentials.');
        return initializeApp();
    }

    try {
        const credentials = JSON.parse(serviceAccount);
        return initializeApp({
            credential: cert(credentials),
        });
    } catch (error) {
        console.error('Failed to parse Firebase credentials:', error);
        return initializeApp();
    }
}

// Initialize app
const app = initFirebaseAdmin();

// Export Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection names
export const COLLECTIONS = {
    LEADS: 'leads',
    NOTES: 'notes',
    USERS: 'users',
} as const;

// Lead status enum
export const LeadStatus = {
    NEW: 'NEW',
    CONTACTED: 'CONTACTED',
    QUALIFIED: 'QUALIFIED',
    PROPOSAL: 'PROPOSAL',
    WON: 'WON',
    LOST: 'LOST',
} as const;

// Form type enum
export const FormType = {
    CONTACT: 'CONTACT',
    NEWSLETTER: 'NEWSLETTER',
    BOOKING: 'BOOKING',
    AUDIT: 'AUDIT',
} as const;

// TypeScript types
export type LeadStatusType = typeof LeadStatus[keyof typeof LeadStatus];
export type FormTypeType = typeof FormType[keyof typeof FormType];

export interface Lead {
    id?: string;
    email: string;
    name?: string;
    phone?: string;
    company?: string;
    website?: string;
    formType: FormTypeType;
    service?: string;
    budget?: string;
    message?: string;
    goals?: string;
    status: LeadStatusType;
    score: number;
    tags: string[];
    source?: string;
    medium?: string;
    campaign?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Note {
    id?: string;
    leadId: string;
    content: string;
    authorId?: string;
    authorName?: string;
    authorEmail?: string;
    createdAt: Date;
}

export interface User {
    id?: string;
    email: string;
    name?: string;
    password?: string; // Hashed
    role: string;
    createdAt: Date;
}

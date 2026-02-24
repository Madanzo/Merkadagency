import {
    collection,
    getDocs,
    updateDoc,
    doc,
    query,
    orderBy,
    where,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ============ TYPES ============

export type InboxStatus = 'pending_review' | 'scheduled' | 'sent' | 'dismissed';
export type AgentSource = 'sales' | 'marketing' | 'system';

export interface InboxItem {
    id: string;
    type: 'email_draft' | 'notification' | 'alert';
    agentSource: AgentSource;
    emailType: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    status: InboxStatus;
    emailDraft: { subject: string; body: string };
    sequenceId?: string;
    scheduledFor: Timestamp | null;
    createdAt: Timestamp;
}

// ============ CRUD ============

export async function getInboxItems(statusFilter?: InboxStatus): Promise<InboxItem[]> {
    const ref = collection(db, 'inbox');
    let q;
    if (statusFilter) {
        q = query(ref, where('status', '==', statusFilter), orderBy('createdAt', 'desc'));
    } else {
        q = query(ref, orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
        const data = d.data() as Omit<InboxItem, 'id'>;
        return { id: d.id, ...data };
    });
}

import { getFunctions, httpsCallable } from 'firebase/functions';

export async function approveAndSend(item: InboxItem): Promise<void> {
    if (!item.clientEmail || !item.emailDraft) {
        throw new Error('Missing client email or draft content');
    }

    // Call real backend delivery function
    const functions = getFunctions();
    const sendDeliveryEmail = httpsCallable(functions, 'sendDeliveryEmail');

    await sendDeliveryEmail({
        to: item.clientEmail,
        subject: item.emailDraft.subject,
        html: item.emailDraft.body,
        clientId: item.clientId,
        inboxItemId: item.id
    });

    // Note: The cloud function updates the status to 'sent' after success,
    // so we don't need to do it here manually anymore.
}

export async function dismissItem(itemId: string): Promise<void> {
    await updateDoc(doc(db, 'inbox', itemId), {
        status: 'dismissed',
    });
}

export async function scheduleItem(itemId: string, scheduledFor: Date): Promise<void> {
    await updateDoc(doc(db, 'inbox', itemId), {
        status: 'scheduled',
        scheduledFor: Timestamp.fromDate(scheduledFor),
    });
}

export async function updateDraft(itemId: string, draft: { subject: string; body: string }): Promise<void> {
    await updateDoc(doc(db, 'inbox', itemId), {
        emailDraft: draft,
    });
}

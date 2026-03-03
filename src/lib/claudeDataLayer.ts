/**
 * Claude Data Layer — Firestore read/write functions for the Claude Assistant
 * All queries run client-side with the logged-in admin's auth context.
 */

import { db } from './firebase';
import {
    collection, getDocs, getDoc, doc,
    query, where, orderBy, limit as fbLimit,
    addDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';

// ── HELPERS ────────────────────────────────────

function serializeTimestamp(val: any): string | null {
    if (!val) return null;
    if (val.toDate) return val.toDate().toISOString();
    if (val instanceof Date) return val.toISOString();
    return val;
}

function serializeDoc(d: any) {
    const data = d.data();
    const result: Record<string, any> = { id: d.id };
    for (const [key, val] of Object.entries(data)) {
        if ((val as any)?.toDate) result[key] = serializeTimestamp(val);
        else result[key] = val;
    }
    return result;
}

// ── READ FUNCTIONS ─────────────────────────────

export async function getLeads(opts: { status?: string; days?: number } = {}) {
    const snapshot = await getDocs(
        query(collection(db, 'leads'), orderBy('createdAt', 'desc'), fbLimit(50))
    );
    const now = Date.now();

    return snapshot.docs.map(d => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const daysAgo = Math.floor((now - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return { id: d.id, ...data, daysAgo, createdAt: createdAt.toISOString() };
    }).filter((lead: any) => {
        if (opts.status && lead.status !== opts.status) return false;
        if (opts.days && lead.daysAgo > opts.days) return false;
        return true;
    });
}

export async function getClients() {
    const snapshot = await getDocs(
        query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
    );
    return snapshot.docs.map(serializeDoc);
}

export async function getClientProfile(clientId: string) {
    const clientRef = doc(db, 'clients', clientId);
    const [client, quotes, contracts, timeline, notes] = await Promise.all([
        getDoc(clientRef),
        getDocs(query(collection(db, 'clients', clientId, 'quotes'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'clients', clientId, 'contracts'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'clients', clientId, 'timeline'), orderBy('date', 'desc'), fbLimit(20))),
        getDocs(query(collection(db, 'clients', clientId, 'notes'), orderBy('createdAt', 'desc'), fbLimit(10))),
    ]);

    return {
        profile: client.exists() ? { id: clientId, ...serializeDoc(client) } : null,
        quotes: quotes.docs.map(serializeDoc),
        contracts: contracts.docs.map(serializeDoc),
        timeline: timeline.docs.map(serializeDoc),
        notes: notes.docs.map(serializeDoc),
    };
}

export async function getRevenueData() {
    const clients = await getDocs(collection(db, 'clients'));
    let totalRevenue = 0;
    let signedContracts = 0;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    let monthRevenue = 0;

    for (const client of clients.docs) {
        const contracts = await getDocs(query(
            collection(db, 'clients', client.id, 'contracts'),
            where('status', '==', 'signed')
        ));
        contracts.docs.forEach(c => {
            const data = c.data();
            const amount = data.finalOneTimeTotal || data.totalAmount || 0;
            totalRevenue += amount;
            signedContracts++;
            const signedAt = data.signedAt?.toDate?.();
            if (signedAt && signedAt >= thisMonth) {
                monthRevenue += amount;
            }
        });
    }

    return {
        totalRevenue,
        monthRevenue,
        signedContracts,
        averageContractValue: signedContracts > 0 ? Math.round(totalRevenue / signedContracts) : 0,
    };
}

export async function getPipelineValue() {
    const clients = await getDocs(collection(db, 'clients'));
    let openQuoteValue = 0;
    let pendingContractValue = 0;

    for (const client of clients.docs) {
        const [quotes, contracts] = await Promise.all([
            getDocs(collection(db, 'clients', client.id, 'quotes')),
            getDocs(query(collection(db, 'clients', client.id, 'contracts'), where('status', '==', 'sent'))),
        ]);
        quotes.docs.forEach(q => {
            const data = q.data();
            openQuoteValue += data.quote?.finalOneTimeTotal || 0;
        });
        contracts.docs.forEach(c => {
            const data = c.data();
            pendingContractValue += data.finalOneTimeTotal || 0;
        });
    }

    return { openQuoteValue, pendingContractValue, total: openQuoteValue + pendingContractValue };
}

export async function searchPeople(searchQuery: string) {
    const q = searchQuery.toLowerCase();
    const results: any[] = [];

    const [leads, clients] = await Promise.all([
        getDocs(collection(db, 'leads')),
        getDocs(collection(db, 'clients')),
    ]);

    leads.docs.forEach(d => {
        const data = d.data();
        if (
            data.name?.toLowerCase().includes(q) ||
            data.email?.toLowerCase().includes(q) ||
            data.business?.toLowerCase().includes(q)
        ) {
            results.push({ id: d.id, type: 'lead', ...serializeDoc(d) });
        }
    });

    clients.docs.forEach(d => {
        const data = d.data();
        if (
            data.name?.toLowerCase().includes(q) ||
            data.email?.toLowerCase().includes(q) ||
            data.business?.toLowerCase().includes(q)
        ) {
            results.push({ id: d.id, type: 'client', ...serializeDoc(d) });
        }
    });

    return results;
}

export async function getApprovalQueue() {
    try {
        const snapshot = await getDocs(query(
            collection(db, 'approvalQueue'),
            where('status', '==', 'pending_review'),
            orderBy('createdAt', 'desc')
        ));
        return snapshot.docs.map(serializeDoc);
    } catch {
        return [];
    }
}

// ── WRITE FUNCTIONS ────────────────────────────

export async function addNoteToClient(clientId: string, note: string) {
    await Promise.all([
        addDoc(collection(db, 'clients', clientId, 'notes'), {
            text: note,
            createdAt: serverTimestamp(),
        }),
        addDoc(collection(db, 'clients', clientId, 'timeline'), {
            type: 'note_added',
            note,
            date: serverTimestamp(),
        }),
    ]);
    return { success: true };
}

export async function updateLeadStatus(leadId: string, status: string) {
    await updateDoc(doc(db, 'leads', leadId), {
        status,
        lastUpdated: serverTimestamp(),
    });
    return { success: true, message: `Lead status updated to ${status}` };
}

export async function convertLeadToClient(leadId: string) {
    const leadSnap = await getDoc(doc(db, 'leads', leadId));
    if (!leadSnap.exists()) return { error: 'Lead not found' };

    const leadData = leadSnap.data();

    if (leadData.status === 'converted') {
        return { error: `Already converted to client ${leadData.convertedToClientId}` };
    }

    const clientRef = await addDoc(collection(db, 'clients'), {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || '',
        business: leadData.business || '',
        sourceLeadId: leadId,
        status: 'active',
        convertedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'leads', leadId), {
        status: 'converted',
        convertedToClientId: clientRef.id,
        convertedAt: serverTimestamp(),
    });

    await addDoc(collection(db, 'clients', clientRef.id, 'timeline'), {
        type: 'converted_from_lead',
        leadId,
        date: serverTimestamp(),
        note: 'Converted from lead via Claude assistant',
    });

    return {
        success: true,
        clientId: clientRef.id,
        message: `${leadData.name} converted to client`,
    };
}

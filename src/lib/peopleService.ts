import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    Timestamp,
    query,
    orderBy,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { getLeads, Lead, updateLead } from "./firestore";
import { getClients, getClient, createClient, type ClientProfile, type CreateClientData } from "./clients";
import { getClientQuotes, type SavedQuote } from "./quotes";
import { getClientContracts, type Contract } from "./contracts";

// ============ TYPES ============

export type PersonType = 'lead' | 'client' | 'converted';

export type PersonStatus =
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'client'
    | 'converted'
    | 'closed-won'
    | 'closed-lost';

export interface Person {
    id: string;
    type: PersonType;
    name: string;
    business: string;
    email: string;
    phone: string;
    status: PersonStatus;
    source: string;
    industry: string;
    website: string;
    notes: string;
    leadId?: string;
    clientId?: string;
    lastActivity: Timestamp;
    createdAt: Timestamp;
}

export type TimelineEventType =
    | 'form_submitted'
    | 'quote_created'
    | 'quote_sent'
    | 'quote_accepted'
    | 'quote_rejected'
    | 'contract_generated'
    | 'contract_sent'
    | 'contract_signed'
    | 'contract_declined'
    | 'note_added'
    | 'status_changed'
    | 'converted_from_lead'
    | 'email_sent';

export interface TimelineEvent {
    id: string;
    type: TimelineEventType;
    description: string;
    metadata?: Record<string, unknown>;
    createdAt: Timestamp;
}

export interface PersonNote {
    id: string;
    content: string;
    createdAt: Timestamp;
}

// ============ STATUS CONFIG ============

export const STATUS_CONFIG: Record<PersonStatus, { label: string; color: string; dot: string }> = {
    new: { label: 'New Lead', color: 'bg-blue-500/20 text-blue-400', dot: '🔵' },
    contacted: { label: 'Contacted', color: 'bg-yellow-500/20 text-yellow-400', dot: '🟡' },
    qualified: { label: 'Qualified', color: 'bg-purple-500/20 text-purple-400', dot: '🟢' },
    client: { label: 'Client', color: 'bg-violet-500/20 text-violet-400', dot: '🟣' },
    converted: { label: 'Converted', color: 'bg-gray-500/20 text-gray-400', dot: '⚫' },
    'closed-won': { label: 'Won', color: 'bg-green-500/20 text-green-400', dot: '🟢' },
    'closed-lost': { label: 'Lost', color: 'bg-red-500/20 text-red-400', dot: '🔴' },
};

// ============ MERGE LEADS + CLIENTS ============

/**
 * Get all people: merges leads and clients into a unified array
 */
export async function getAllPeople(): Promise<Person[]> {
    const [leads, clients] = await Promise.all([getLeads(), getClients()]);

    const people: Person[] = [];

    // Build a map of leadId → clientId for cross-referencing
    const leadToClient = new Map<string, ClientProfile>();
    for (const c of clients) {
        if (c.leadId) leadToClient.set(c.leadId, c);
    }

    // Process leads
    for (const lead of leads) {
        const linkedClient = leadToClient.get(lead.id);

        people.push({
            id: linkedClient ? linkedClient.id : lead.id,
            type: linkedClient ? 'converted' : 'lead',
            name: lead.name || '',
            business: linkedClient?.business || '',
            email: lead.email || '',
            phone: lead.phone || '',
            status: linkedClient ? 'converted' : (lead.status as PersonStatus),
            source: lead.source || 'form',
            industry: linkedClient?.industry || '',
            website: linkedClient?.website || '',
            notes: lead.notes || '',
            leadId: lead.id,
            clientId: linkedClient?.id,
            lastActivity: lead.updatedAt || lead.createdAt,
            createdAt: lead.createdAt,
        });
    }

    // Process clients that DON'T have a linked lead (manually created)
    const linkedLeadIds = new Set(clients.filter(c => c.leadId).map(c => c.leadId));
    for (const client of clients) {
        if (!client.leadId) {
            people.push({
                id: client.id,
                type: 'client',
                name: client.name || '',
                business: client.business || '',
                email: client.email || '',
                phone: client.phone || '',
                status: 'client',
                source: 'manual',
                industry: client.industry || '',
                website: client.website || '',
                notes: client.notes || '',
                clientId: client.id,
                lastActivity: client.updatedAt || client.createdAt,
                createdAt: client.createdAt,
            });
        }
    }

    // Sort by last activity (newest first)
    people.sort((a, b) => {
        const aTime = a.lastActivity?.seconds || 0;
        const bTime = b.lastActivity?.seconds || 0;
        return bTime - aTime;
    });

    return people;
}

// ============ LEAD → CLIENT CONVERSION ============

/**
 * Convert a lead to a client, log timeline event, update lead status
 */
export async function convertLeadToClient(
    lead: Lead
): Promise<string> {
    // Create client
    const clientId = await createClient({
        name: lead.name || '',
        business: '',
        email: lead.email || '',
        phone: lead.phone || '',
        industry: '',
        website: '',
        notes: lead.notes || '',
        leadId: lead.id,
    });

    // Update lead status
    try {
        await updateLead(lead.id, { status: 'closed-won' });
    } catch { /* non-critical */ }

    // Log timeline event
    await addTimelineEvent(clientId, {
        type: 'converted_from_lead',
        description: `Converted from lead "${lead.name}"`,
        metadata: { leadId: lead.id, source: lead.source },
    });

    return clientId;
}

// ============ TIMELINE ============

/**
 * Add a timeline event for a client
 */
export async function addTimelineEvent(
    clientId: string,
    event: {
        type: TimelineEventType;
        description: string;
        metadata?: Record<string, unknown>;
    }
): Promise<string> {
    const ref = collection(db, `clients/${clientId}/timeline`);
    const docRef = await addDoc(ref, {
        ...event,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

/**
 * Get all timeline events for a client (newest first)
 */
export async function getTimeline(clientId: string): Promise<TimelineEvent[]> {
    const ref = collection(db, `clients/${clientId}/timeline`);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    })) as TimelineEvent[];
}

// ============ NOTES ============

/**
 * Add a note
 */
export async function addNote(
    clientId: string,
    content: string
): Promise<string> {
    const ref = collection(db, `clients/${clientId}/notes`);
    const docRef = await addDoc(ref, {
        content,
        createdAt: Timestamp.now(),
    });

    // Also log to timeline
    await addTimelineEvent(clientId, {
        type: 'note_added',
        description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    });

    return docRef.id;
}

/**
 * Get all notes for a client (newest first)
 */
export async function getNotes(clientId: string): Promise<PersonNote[]> {
    const ref = collection(db, `clients/${clientId}/notes`);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    })) as PersonNote[];
}

// ============ AI SUMMARY (rule-based for Phase 1) ============

export interface AISummary {
    insight: string;
    suggestedAction: string;
    urgency: 'low' | 'medium' | 'high';
}

/**
 * Generate rule-based AI summary for a person
 */
export function generateAISummary(
    person: Person,
    quotes: SavedQuote[],
    contracts: Contract[],
    timeline: TimelineEvent[]
): AISummary {
    const now = Date.now();
    const lastActivityMs = person.lastActivity?.seconds ? person.lastActivity.seconds * 1000 : now;
    const daysSinceActivity = Math.floor((now - lastActivityMs) / (1000 * 60 * 60 * 24));

    // Contract signed → active client
    const signedContract = contracts.find(c => c.status === 'signed');
    if (signedContract) {
        return {
            insight: 'Active client with signed contract.',
            suggestedAction: 'Schedule kickoff meeting',
            urgency: 'medium',
        };
    }

    // Contract sent but not signed
    const sentContract = contracts.find(c => c.status === 'sent');
    if (sentContract) {
        return {
            insight: 'Contract sent but not yet signed.',
            suggestedAction: 'Follow up on contract',
            urgency: daysSinceActivity > 3 ? 'high' : 'medium',
        };
    }

    // Quote sent but no response > 3 days
    const sentQuote = quotes.find(q => q.status === 'sent');
    if (sentQuote && daysSinceActivity > 3) {
        return {
            insight: `Quote sent ${daysSinceActivity} days ago with no response.`,
            suggestedAction: 'Follow up on quote',
            urgency: 'high',
        };
    }

    // Quote accepted but no contract yet
    const acceptedQuote = quotes.find(q => q.status === 'accepted');
    if (acceptedQuote && contracts.length === 0) {
        return {
            insight: 'Quote accepted — ready for contract.',
            suggestedAction: 'Generate contract',
            urgency: 'high',
        };
    }

    // No contact > 7 days
    if (daysSinceActivity > 7) {
        return {
            insight: `No activity in ${daysSinceActivity} days.`,
            suggestedAction: 'Re-engage this contact',
            urgency: daysSinceActivity > 14 ? 'high' : 'medium',
        };
    }

    // New lead
    if (person.type === 'lead' && person.status === 'new') {
        return {
            insight: 'New lead — first contact not yet made.',
            suggestedAction: 'Reach out within 24 hours',
            urgency: 'high',
        };
    }

    // Default
    return {
        insight: 'Contact is active and up to date.',
        suggestedAction: 'No immediate action needed',
        urgency: 'low',
    };
}

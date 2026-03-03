#!/usr/bin/env node

/**
 * MerkadAgency CRM MCP Server
 *
 * Provides 7 tools for client and lead management:
 *   1. search_people           — Search leads + clients by name/email/phone/business
 *   2. get_client_full_profile — Complete profile with quotes, contracts, timeline, notes
 *   3. get_pipeline            — Leads grouped by status with days in stage
 *   4. convert_lead_to_client  — Convert lead → client in one operation
 *   5. add_note                — Add note to client + log to timeline
 *   6. update_lead_status      — Update lead pipeline status
 *   7. get_recent_activity     — Recent activity across all collections
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ============ FIREBASE INIT ============

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyPath = resolve(__dirname, 'serviceAccountKey.json');

if (!existsSync(keyPath)) {
    console.error(`❌ Missing serviceAccountKey.json at ${keyPath}`);
    process.exit(1);
}

// Only initialize if not already initialized (shared key with contracts server)
if (getApps().length === 0) {
    const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));
    initializeApp({
        credential: cert(serviceAccount),
        projectId: 'merkadagency-dd2aa',
    });
}

const db = getFirestore();

// ============ MCP SERVER ============

const server = new McpServer({
    name: 'merkadagency-crm',
    version: '1.0.0',
});

// ============ TOOL 1: search_people ============

server.tool(
    'search_people',
    'Search across both leads and clients by name, email, business, or phone in one call.',
    {
        query: z.string().describe('Search term — name, email, phone, or business'),
        type: z.enum(['all', 'leads', 'clients']).default('all').describe('Filter by record type'),
        limit: z.number().default(10).describe('Max results to return'),
    },
    async ({ query, type, limit }) => {
        const results = [];
        const q = query.toLowerCase();

        if (type === 'all' || type === 'leads') {
            const leads = await db.collection('leads').get();
            leads.docs
                .filter(d => {
                    const data = d.data();
                    return (
                        data.name?.toLowerCase().includes(q) ||
                        data.email?.toLowerCase().includes(q) ||
                        data.phone?.includes(q) ||
                        data.business?.toLowerCase().includes(q)
                    );
                })
                .slice(0, limit)
                .forEach(d => {
                    const data = d.data();
                    results.push({
                        id: d.id,
                        type: 'lead',
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        business: data.business,
                        status: data.status || 'new',
                        source: data.source,
                        serviceInterest: data.serviceInterest,
                        city: data.city,
                        createdAt: data.createdAt?.toDate?.()?.toISOString(),
                    });
                });
        }

        if (type === 'all' || type === 'clients') {
            const clients = await db.collection('clients').get();
            clients.docs
                .filter(d => {
                    const data = d.data();
                    return (
                        data.name?.toLowerCase().includes(q) ||
                        data.email?.toLowerCase().includes(q) ||
                        data.business?.toLowerCase().includes(q) ||
                        data.phone?.includes(q)
                    );
                })
                .slice(0, limit)
                .forEach(d => {
                    const data = d.data();
                    results.push({
                        id: d.id,
                        type: 'client',
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        business: data.business,
                        status: data.status,
                        country: data.country,
                        city: data.city,
                        createdAt: data.createdAt?.toDate?.()?.toISOString(),
                    });
                });
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({ count: results.length, results }, null, 2),
            }],
        };
    }
);

// ============ TOOL 2: get_client_full_profile ============

server.tool(
    'get_client_full_profile',
    'Get complete client profile including quotes, contracts, timeline, and notes in one call.',
    {
        clientId: z.string().describe('Firestore client document ID'),
    },
    async ({ clientId }) => {
        const clientRef = db.collection('clients').doc(clientId);
        const clientSnap = await clientRef.get();

        if (!clientSnap.exists) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ error: 'Client not found' }) }],
            };
        }

        const [quotes, contracts, timeline, notes] = await Promise.all([
            clientRef.collection('quotes').orderBy('createdAt', 'desc').get(),
            clientRef.collection('contracts').orderBy('createdAt', 'desc').get(),
            clientRef.collection('timeline').orderBy('date', 'desc').limit(20).get(),
            clientRef.collection('notes').orderBy('createdAt', 'desc').limit(10).get(),
        ]);

        // Serialize timestamps for clean JSON
        const serializeDoc = (d) => {
            const data = d.data();
            const serialized = { id: d.id };
            for (const [key, val] of Object.entries(data)) {
                if (val?.toDate) serialized[key] = val.toDate().toISOString();
                else serialized[key] = val;
            }
            return serialized;
        };

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    profile: serializeDoc(clientSnap),
                    quotes: quotes.docs.map(serializeDoc),
                    contracts: contracts.docs.map(serializeDoc),
                    timeline: timeline.docs.map(serializeDoc),
                    notes: notes.docs.map(serializeDoc),
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 3: get_pipeline ============

server.tool(
    'get_pipeline',
    'Get all leads grouped by pipeline status with days in current stage. Optionally filter by status or stale days.',
    {
        status: z.enum(['all', 'new', 'contacted', 'qualified', 'converted', 'lost']).default('all').describe('Filter by lead status'),
        stale_days: z.number().optional().describe('Only show leads older than this many days'),
    },
    async ({ status, stale_days }) => {
        const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
        const now = Date.now();

        let leads = snapshot.docs.map(d => {
            const data = d.data();
            const createdAt = data.createdAt?.toDate?.() || new Date();
            const daysInPipeline = Math.floor((now - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            return {
                id: d.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                status: data.status || 'new',
                source: data.source,
                serviceInterest: data.serviceInterest,
                city: data.city,
                score: data.score,
                daysInPipeline,
                createdAt: createdAt.toISOString(),
            };
        });

        if (status !== 'all') {
            leads = leads.filter(l => l.status === status);
        }

        if (stale_days) {
            leads = leads.filter(l => l.daysInPipeline >= stale_days);
        }

        // Group by status
        const grouped = {};
        for (const lead of leads) {
            const s = lead.status || 'new';
            if (!grouped[s]) grouped[s] = [];
            grouped[s].push(lead);
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    total: leads.length,
                    grouped,
                    staleLeads: leads.filter(l => l.daysInPipeline > 7),
                    summary: Object.entries(grouped).map(([status, items]) =>
                        `${status}: ${items.length}`
                    ).join(', '),
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 4: convert_lead_to_client ============

server.tool(
    'convert_lead_to_client',
    'Convert a lead to a client. Creates client record, marks lead as converted, logs timeline event.',
    {
        leadId: z.string().describe('Firestore lead document ID'),
        additionalInfo: z.object({
            fullLegalName: z.string().optional(),
            business: z.string().optional(),
            address: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            country: z.string().optional(),
        }).optional().describe('Additional client details to set during conversion'),
    },
    async ({ leadId, additionalInfo }) => {
        const leadSnap = await db.collection('leads').doc(leadId).get();
        if (!leadSnap.exists) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: 'Lead not found' }) }],
            };
        }

        const leadData = leadSnap.data();

        // Check if already converted
        if (leadData.status === 'converted') {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: `Lead already converted to client ${leadData.convertedToClientId}`,
                    }),
                }],
            };
        }

        const clientRef = db.collection('clients').doc();

        // Create client from lead data
        const clientData = {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone || '',
            business: leadData.business || '',
            sourceLeadId: leadId,
            status: 'active',
            convertedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
        };

        // Merge additional info if provided
        if (additionalInfo) {
            Object.entries(additionalInfo).forEach(([key, val]) => {
                if (val) clientData[key] = val;
            });
        }

        await clientRef.set(clientData);

        // Lock lead as converted
        await db.collection('leads').doc(leadId).update({
            status: 'converted',
            convertedToClientId: clientRef.id,
            convertedAt: FieldValue.serverTimestamp(),
        });

        // Log timeline event
        await clientRef.collection('timeline').add({
            type: 'converted_from_lead',
            leadId,
            date: FieldValue.serverTimestamp(),
            note: `Converted from lead (${leadData.source || 'direct'})`,
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    clientId: clientRef.id,
                    message: `✅ ${leadData.name} converted to client successfully`,
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 5: add_note ============

server.tool(
    'add_note',
    'Add a note to a client profile and log it to their timeline.',
    {
        clientId: z.string().describe('Firestore client document ID'),
        note: z.string().describe('The note text to add'),
        type: z.enum(['note', 'call', 'meeting', 'email']).default('note').describe('Type of note'),
    },
    async ({ clientId, note, type }) => {
        // Verify client exists
        const clientSnap = await db.collection('clients').doc(clientId).get();
        if (!clientSnap.exists) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: 'Client not found' }) }],
            };
        }

        const batch = db.batch();

        const noteRef = db.collection('clients').doc(clientId).collection('notes').doc();
        batch.set(noteRef, {
            text: note,
            type,
            createdAt: FieldValue.serverTimestamp(),
        });

        const timelineRef = db.collection('clients').doc(clientId).collection('timeline').doc();
        batch.set(timelineRef, {
            type: `${type}_logged`,
            note,
            date: FieldValue.serverTimestamp(),
        });

        await batch.commit();

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    noteId: noteRef.id,
                    message: `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} note added to ${clientSnap.data().name}`,
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 6: update_lead_status ============

server.tool(
    'update_lead_status',
    'Update a lead\'s pipeline status and optionally log a note.',
    {
        leadId: z.string().describe('Firestore lead document ID'),
        status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).describe('New pipeline status'),
        note: z.string().optional().describe('Optional note explaining the status change'),
    },
    async ({ leadId, status, note }) => {
        const leadSnap = await db.collection('leads').doc(leadId).get();
        if (!leadSnap.exists) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: 'Lead not found' }) }],
            };
        }

        const previousStatus = leadSnap.data().status || 'new';

        await db.collection('leads').doc(leadId).update({
            status,
            lastUpdated: FieldValue.serverTimestamp(),
        });

        if (note) {
            await db.collection('leads').doc(leadId)
                .collection('timeline').add({
                    type: 'status_changed',
                    from: previousStatus,
                    to: status,
                    note,
                    date: FieldValue.serverTimestamp(),
                });
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    leadName: leadSnap.data().name,
                    previousStatus,
                    newStatus: status,
                    message: `✅ ${leadSnap.data().name}: ${previousStatus} → ${status}`,
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 7: get_recent_activity ============

server.tool(
    'get_recent_activity',
    'Get recent activity across all clients and leads — new leads, contracts, conversions.',
    {
        days: z.number().default(7).describe('Number of days to look back'),
        type: z.enum(['all', 'leads', 'contracts', 'notes', 'conversions']).default('all').describe('Filter by activity type'),
    },
    async ({ days, type }) => {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const activity = [];

        // Recent leads
        if (type === 'all' || type === 'leads') {
            try {
                const leads = await db.collection('leads')
                    .where('createdAt', '>=', since)
                    .orderBy('createdAt', 'desc')
                    .get();
                leads.docs.forEach(d => {
                    const data = d.data();
                    activity.push({
                        activityType: 'new_lead',
                        id: d.id,
                        name: data.name,
                        email: data.email,
                        source: data.source,
                        serviceInterest: data.serviceInterest,
                        date: data.createdAt?.toDate?.()?.toISOString(),
                    });
                });
            } catch { /* index might not exist */ }
        }

        // Recent contracts across all clients
        if (type === 'all' || type === 'contracts') {
            try {
                const clients = await db.collection('clients').get();
                for (const client of clients.docs) {
                    const contracts = await client.ref
                        .collection('contracts')
                        .where('createdAt', '>=', since)
                        .orderBy('createdAt', 'desc')
                        .get();
                    contracts.docs.forEach(d => {
                        const data = d.data();
                        activity.push({
                            activityType: `contract_${data.status || 'created'}`,
                            id: d.id,
                            clientName: client.data().name,
                            clientId: client.id,
                            contractNumber: data.contractNumber,
                            status: data.status,
                            totalAmount: data.finalOneTimeTotal,
                            date: data.createdAt?.toDate?.()?.toISOString(),
                        });
                    });
                }
            } catch { /* non-critical */ }
        }

        // Recent conversions
        if (type === 'all' || type === 'conversions') {
            try {
                const converted = await db.collection('leads')
                    .where('status', '==', 'converted')
                    .get();
                converted.docs.forEach(d => {
                    const data = d.data();
                    const convertedDate = data.convertedAt?.toDate?.();
                    if (convertedDate && convertedDate >= since) {
                        activity.push({
                            activityType: 'lead_converted',
                            id: d.id,
                            name: data.name,
                            email: data.email,
                            convertedToClientId: data.convertedToClientId,
                            date: convertedDate.toISOString(),
                        });
                    }
                });
            } catch { /* non-critical */ }
        }

        // Sort by date descending
        activity.sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    period: `Last ${days} days`,
                    total: activity.length,
                    activity,
                }, null, 2),
            }],
        };
    }
);

// ============ START SERVER ============

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🟢 MerkadAgency CRM MCP Server running');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});

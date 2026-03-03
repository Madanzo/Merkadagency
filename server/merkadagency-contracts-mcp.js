#!/usr/bin/env node

/**
 * MerkadAgency Contracts MCP Server
 *
 * Provides 5 tools for intelligent contract clause selection and assembly:
 *   1. seed_knowledge_base  — Seeds Firestore with 12 legal documents
 *   2. analyze_quote        — Risk analysis and clause recommendations
 *   3. get_clauses_for_quote — Returns adapted legal clauses for a quote
 *   4. validate_contract    — Pre-generation validation (errors + warnings)
 *   5. save_contract        — Saves assembled contract to Firestore
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ============ FIREBASE INIT ============

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyPath = resolve(__dirname, 'serviceAccountKey.json');

if (!existsSync(keyPath)) {
    console.error(`
  ❌ Missing serviceAccountKey.json
  
  To set up the MCP server:
  1. Go to: https://console.firebase.google.com/project/merkadagency-dd2aa/settings/serviceaccounts/adminsdk
  2. Click "Generate new private key"
  3. Save the file as: ${keyPath}
  `);
    process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));

initializeApp({
    credential: cert(serviceAccount),
    projectId: 'merkadagency-dd2aa',
});

const db = getFirestore();

// ============ MCP SERVER ============

const server = new McpServer({
    name: 'merkadagency-contracts',
    version: '1.0.0',
});

// ============ TOOL 1: seed_knowledge_base ============

server.tool(
    'seed_knowledge_base',
    'Seeds Firestore knowledgeBase collection with all 12 MerkadAgency legal documents. Idempotent — checks before inserting.',
    {},
    async () => {
        const existing = await db.collection('knowledgeBase').get();
        if (existing.size > 0) {
            return {
                content: [{
                    type: 'text',
                    text: `Knowledge Base already has ${existing.size} documents — skipping seed`,
                }],
            };
        }

        const documents = [
            {
                name: 'Master Contract Template',
                status: 'active',
                type: 'template',
                content: `This Digital Marketing Services Agreement is entered into by MerkadAgency LLC (Agency) and the Client identified in this contract. This Agreement governs all digital marketing services provided by Agency to Client as outlined herein.`,
            },
            {
                name: 'Service Clause Library',
                status: 'active',
                type: 'clauses',
                services: {
                    'Social Media Management': `Agency manages Client social media presence including content creation, scheduling, and community management. NOT INCLUDED: Paid advertising spend, influencer partnerships, or crisis management. Client must provide brand assets and platform access within 3 business days of signing.`,
                    'Paid Ads (Meta/Google)': `Agency manages paid advertising campaigns on agreed platforms. Ad spend is paid DIRECTLY by Client to the platform and is NOT included in Agency fees. Agency cannot guarantee specific ROAS, CPL, or conversion rates. Platform policy changes and algorithm updates are outside Agency control.`,
                    'SEO': `Agency provides search engine optimization services. SEO results typically require 3-6 months. Agency cannot guarantee specific rankings, traffic, or revenue. Algorithm updates are outside Agency control. Client must provide website access and approve changes within 5 business days.`,
                    'Web Design': `Agency designs and develops Client website as scoped. Includes 2 revision rounds. Post-launch maintenance NOT included unless separately contracted. Client is responsible for hosting, domain, and plugin fees. Client must provide all content unless separately contracted.`,
                    'Email Marketing': `Agency manages email marketing including campaign creation, list management, and reporting. Email platform fees paid directly by Client. Agency cannot guarantee open rates, click rates, or revenue from campaigns.`,
                    'Content Creation': `Agency creates content as specified in the quote. Content remains Agency property until full payment received. Upon full payment Client receives full ownership. 2 revision rounds included per deliverable.`,
                    'AI Automation': `Agency builds and implements AI automation solutions as scoped. AI systems depend on third-party platforms whose APIs and pricing may change without notice. Agency bears no liability for third-party outages or policy changes. Client must provide all API access within 3 business days of signing.`,
                    'Full Service Retainer': `Client retains Agency on ongoing monthly basis. Monthly fee due on the 1st of each month. Unused services do NOT roll over. Agency may adjust pricing with 30 days written notice at each 6-month renewal.`,
                },
            },
            {
                name: 'Payment Terms & Late Fee Policy',
                status: 'active',
                type: 'legal',
                content: `Payment Terms: Work begins ONLY after receipt of initial payment. Retainer services due on the 1st of each month. Projects require 50% deposit before work begins, remaining 50% due upon completion. Late fee of 1.5% per month (18% annually) applies after 5 business days. Services suspended if payment is more than 7 days overdue. Collections and attorney fees charged to Client if unpaid after 30 days.`,
            },
            {
                name: 'No Refund Policy',
                status: 'active',
                type: 'legal',
                content: `ALL FEES ARE NON-REFUNDABLE. Due to the custom nature of digital marketing services, Agency does not offer refunds on any fees paid. Client remains responsible for all fees for work performed up to termination date. Disputes must be submitted in writing to camilo.reyna@merkadagency.com with 10 business days allowed for resolution. Chargebacks on services rendered will be disputed with full documentation.`,
            },
            {
                name: 'Intellectual Property & Ownership',
                status: 'active',
                type: 'legal',
                content: `Upon full payment, Agency assigns Client all rights to deliverables created under this Agreement. All work remains Agency property until full payment received. Agency retains rights to all proprietary tools, processes, and internal systems. Client responsible for maintaining third-party licenses post-delivery. Agency may display work in portfolio unless Client objects in writing within 30 days.`,
            },
            {
                name: 'NDA & Confidentiality',
                status: 'active',
                type: 'legal',
                content: `Both Parties keep confidential all non-public information including business strategies, financial data, customer lists, proprietary processes, and pricing. No disclosure to third parties without written consent. Confidentiality survives termination for 2 years. Exceptions apply to publicly available information or legally required disclosures.`,
            },
            {
                name: 'Results Disclaimer',
                status: 'active',
                type: 'legal',
                content: `Agency makes NO guarantee of specific results including revenue increases, ROAS, search rankings, follower growth, lead volume, or website traffic. Results depend on market conditions, competition, platform algorithms, budget, and economic factors outside Agency control. Past case study results do not guarantee future performance. Client cooperation and timely approvals directly impact results — Agency not responsible for poor results caused by Client delays.`,
            },
            {
                name: 'Termination Policy',
                status: 'active',
                type: 'legal',
                content: `Either Party may terminate with 30 days written notice to camilo.reyna@merkadagency.com. Client owes all fees during notice period. Agency may terminate immediately for non-payment beyond 15 days, illegal behavior, or material breach. Upon termination all outstanding invoices due immediately. Agency transfers access credentials within 5 business days. No refunds on termination.`,
            },
            {
                name: 'Revision & Scope Policy',
                status: 'active',
                type: 'legal',
                content: `Each deliverable includes 2 revision rounds. A revision is minor changes to existing work — NOT new concepts, direction changes, or out-of-scope additions. Additional revisions billed at Agency hourly rate. Revision requests must be submitted within 5 business days of delivery — after which deliverable is considered approved. Out-of-scope work requires written Change Order and additional fees. Client delays beyond 5 business days allow Agency to adjust timeline without penalty.`,
            },
            {
                name: 'US Governing Law',
                status: 'active',
                type: 'legal',
                content: `This Agreement is governed by the laws of the State of Texas. Disputes resolved first through good faith negotiation (30 days), then non-binding mediation, before litigation. Legal proceedings in courts of Houston, Texas. Prevailing Party recovers attorney fees and court costs.`,
            },
            {
                name: 'Mexico Governing Law',
                status: 'active',
                type: 'legal',
                content: `Este Acuerdo se rige por las leyes de los Estados Unidos Mexicanos incluyendo el Código Civil Federal y la Ley Federal de Protección al Consumidor (LFPC). Disputas resueltas primero mediante negociación de buena fe (30 días), luego mediación ante PROFECO, antes de litigación. La Parte prevaleciente recupera honorarios y costas judiciales. This Agreement is governed by Mexican federal law including the Federal Civil Code and Federal Consumer Protection Law.`,
            },
            {
                name: 'High Value Contract Addendum',
                status: 'active',
                type: 'legal',
                content: `For contracts exceeding $5,000: A 50% deposit is required before work begins. A detailed project milestone schedule will be provided within 5 business days of signing. Monthly progress reports are included. A dedicated point of contact at Agency is assigned to this account. Quarterly performance reviews included at no additional cost.`,
            },
        ];

        for (const doc of documents) {
            await db.collection('knowledgeBase').add({
                ...doc,
                createdAt: FieldValue.serverTimestamp(),
            });
        }

        return {
            content: [{
                type: 'text',
                text: `✅ Knowledge Base seeded successfully — ${documents.length} documents saved`,
            }],
        };
    }
);

// ============ TOOL 2: analyze_quote ============

server.tool(
    'analyze_quote',
    'Reads a quote and returns a risk profile with clause recommendations before contract generation.',
    {
        clientId: z.string().describe('Firestore client document ID'),
        quoteId: z.string().describe('Firestore quote document ID (under clients/{clientId}/quotes/)'),
    },
    async ({ clientId, quoteId }) => {
        const quoteSnap = await db
            .collection('clients').doc(clientId)
            .collection('quotes').doc(quoteId)
            .get();

        const clientSnap = await db
            .collection('clients').doc(clientId)
            .get();

        if (!quoteSnap.exists || !clientSnap.exists) {
            return {
                content: [{ type: 'text', text: 'Quote or client not found' }],
            };
        }

        const q = quoteSnap.data();
        const c = clientSnap.data();

        // Flatten services from the quote structure
        const allServices = [];
        if (q.quote?.basePackage?.label) allServices.push(q.quote.basePackage.label);
        if (q.quote?.addons) allServices.push(...q.quote.addons.map(a => a.label));
        if (q.quote?.monthly) allServices.push(...q.quote.monthly.map(m => m.label));

        const totalAmount = (q.quote?.finalOneTimeTotal || 0) + (q.quote?.finalMonthlyTotal || 0);

        // Build risk profile
        const riskFlags = [];
        const clauseRecommendations = [];

        if (totalAmount > 5000) {
            riskFlags.push('HIGH_VALUE — contract over $5,000');
            clauseRecommendations.push('High Value Contract Addendum');
            clauseRecommendations.push('50% deposit required before work begins');
        }

        const serviceLabels = allServices.join(' ').toLowerCase();

        if (serviceLabels.includes('ads') || serviceLabels.includes('paid')) {
            riskFlags.push('PAID_ADS — ad spend liability must be clearly separated');
            clauseRecommendations.push('Strong results disclaimer for paid ads');
            clauseRecommendations.push('Explicit ad spend separation clause');
        }

        if (serviceLabels.includes('seo')) {
            riskFlags.push('SEO — results timeline expectations must be set');
            clauseRecommendations.push('3-6 month results timeline disclosure');
            clauseRecommendations.push('Algorithm update liability waiver');
        }

        if (serviceLabels.includes('ai') || serviceLabels.includes('automation')) {
            riskFlags.push('AI_AUTOMATION — third party API dependency');
            clauseRecommendations.push('Third party platform liability clause');
            clauseRecommendations.push('API access requirements from client');
        }

        if (serviceLabels.includes('web') || serviceLabels.includes('design') || serviceLabels.includes('website')) {
            riskFlags.push('WEB_DESIGN — scope creep and revision risk');
            clauseRecommendations.push('Strict revision limit enforcement');
            clauseRecommendations.push('Change Order requirement for scope additions');
        }

        if (allServices.length > 3) {
            riskFlags.push('MULTI_SERVICE — complex engagement needs clear scope boundaries');
            clauseRecommendations.push('Clear service boundary definitions');
            clauseRecommendations.push('Individual deliverable timelines per service');
        }

        if (c.country === 'MX' || c.country === 'mexico') {
            riskFlags.push('MEXICO_JURISDICTION — LFPC consumer protections apply');
            clauseRecommendations.push('Bilingual governing law clause required');
            clauseRecommendations.push('PROFECO mediation clause required');
        }

        if (totalAmount > 2000 && q.projectInfo?.paymentTerms !== '100-upfront') {
            riskFlags.push('DEPOSIT_RECOMMENDED — recommend 50% deposit on contracts over $2,000');
            clauseRecommendations.push('Add deposit requirement before sending');
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    clientName: c.name,
                    businessName: c.business,
                    totalOneTime: q.quote?.finalOneTimeTotal || 0,
                    totalMonthly: q.quote?.finalMonthlyTotal || 0,
                    totalAmount,
                    services: allServices,
                    jurisdiction: (c.country === 'MX' || c.country === 'mexico') ? 'mexico' : 'usa',
                    riskLevel: riskFlags.length > 3 ? 'HIGH' : riskFlags.length > 1 ? 'MEDIUM' : 'LOW',
                    riskFlags,
                    clauseRecommendations,
                    requiresAttorneyReview: totalAmount > 5000,
                    quoteData: {
                        basePackage: q.quote?.basePackage,
                        addons: q.quote?.addons,
                        monthly: q.quote?.monthly,
                        discount: q.quote?.discount,
                        monthlyDiscount: q.quote?.monthlyDiscount,
                        paymentTerms: q.projectInfo?.paymentTerms,
                    },
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 3: get_clauses_for_quote ============

server.tool(
    'get_clauses_for_quote',
    'Returns the exact legal clauses to use for a specific quote — selected and adapted based on services, value, and jurisdiction.',
    {
        clientId: z.string().describe('Firestore client document ID'),
        quoteId: z.string().describe('Firestore quote document ID'),
    },
    async ({ clientId, quoteId }) => {
        const quoteSnap = await db
            .collection('clients').doc(clientId)
            .collection('quotes').doc(quoteId)
            .get();

        const clientSnap = await db
            .collection('clients').doc(clientId)
            .get();

        if (!quoteSnap.exists || !clientSnap.exists) {
            return {
                content: [{ type: 'text', text: 'Quote or client not found' }],
            };
        }

        const q = quoteSnap.data();
        const c = clientSnap.data();
        const jurisdiction = (c.country === 'MX' || c.country === 'mexico') ? 'mexico' : 'usa';

        // Flatten service names
        const serviceNames = [];
        if (q.quote?.basePackage?.label) serviceNames.push(q.quote.basePackage.label);
        if (q.quote?.addons) serviceNames.push(...q.quote.addons.map(a => a.label));
        if (q.quote?.monthly) serviceNames.push(...q.quote.monthly.map(m => m.label));

        const totalAmount = (q.quote?.finalOneTimeTotal || 0) + (q.quote?.finalMonthlyTotal || 0);

        // Always required documents
        const alwaysRequired = [
            'Payment Terms & Late Fee Policy',
            'No Refund Policy',
            'Intellectual Property & Ownership',
            'NDA & Confidentiality',
            'Results Disclaimer',
            'Termination Policy',
            'Revision & Scope Policy',
            jurisdiction === 'mexico' ? 'Mexico Governing Law' : 'US Governing Law',
        ];

        if (totalAmount > 5000) {
            alwaysRequired.push('High Value Contract Addendum');
        }

        // Fetch all required documents
        const clauses = {};
        for (const docName of alwaysRequired) {
            const snapshot = await db.collection('knowledgeBase')
                .where('name', '==', docName)
                .where('status', '==', 'active')
                .get();

            if (!snapshot.empty) {
                clauses[docName] = snapshot.docs[0].data().content;
            }
        }

        // Fetch service-specific clauses
        const serviceLibSnapshot = await db.collection('knowledgeBase')
            .where('name', '==', 'Service Clause Library')
            .where('status', '==', 'active')
            .get();

        const serviceLibrary = serviceLibSnapshot.docs[0]?.data()?.services || {};
        const matchedServiceClauses = [];
        const missingClauses = [];

        for (const name of serviceNames) {
            // Try exact match
            if (serviceLibrary[name]) {
                matchedServiceClauses.push({ service: name, clause: serviceLibrary[name] });
                continue;
            }
            // Try partial match
            let found = false;
            for (const [key, clause] of Object.entries(serviceLibrary)) {
                if (name.toLowerCase().includes(key.toLowerCase()) ||
                    key.toLowerCase().includes(name.toLowerCase())) {
                    matchedServiceClauses.push({ service: name, clause });
                    found = true;
                    break;
                }
            }
            if (!found) missingClauses.push(name);
        }

        clauses.serviceClauses = matchedServiceClauses;
        if (missingClauses.length > 0) clauses.missingClauses = missingClauses;

        // Adaptation instructions for Claude
        const adaptationRules = [];
        if (totalAmount > 5000) {
            adaptationRules.push('HIGH VALUE CONTRACT: Use stronger payment protection language. Emphasize deposit requirement. Add milestone schedule mention.');
        }
        if (serviceNames.some(s => s.toLowerCase().includes('ads') || s.toLowerCase().includes('paid'))) {
            adaptationRules.push('PAID ADS: Make ad spend separation VERY explicit. Bold or highlight that ad spend is separate from management fees.');
        }
        if (serviceNames.some(s => s.toLowerCase().includes('seo'))) {
            adaptationRules.push('SEO: Clearly state 3-6 month timeline. Be explicit that rankings are not guaranteed.');
        }
        if (serviceNames.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('automation'))) {
            adaptationRules.push('AI AUTOMATION: Emphasize third-party dependency. List required API access clearly.');
        }
        if (serviceNames.length > 3) {
            adaptationRules.push('MULTI-SERVICE: Add a clear service boundary section. Define what is included per service explicitly.');
        }
        if (jurisdiction === 'mexico') {
            adaptationRules.push('MEXICO: Include Spanish language version of governing law. Reference LFPC and PROFECO.');
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    jurisdiction,
                    totalOneTime: q.quote?.finalOneTimeTotal || 0,
                    totalMonthly: q.quote?.finalMonthlyTotal || 0,
                    totalAmount,
                    servicesInQuote: serviceNames,
                    clientInfo: {
                        name: c.name,
                        business: c.business,
                        email: c.email,
                        phone: c.phone,
                        address: c.address,
                        country: c.country,
                    },
                    projectInfo: q.projectInfo,
                    clauses,
                    adaptationRules,
                    adaptationInstructions: `
You are assembling a contract for ${c.name} at ${c.business || 'their business'}.

ADAPTATION RULES:
${adaptationRules.map(r => `- ${r}`).join('\n')}

TONE: Professional, clear, protective of MerkadAgency without being aggressive.
LENGTH: Comprehensive but readable. No unnecessary legal jargon.
FORMAT: Return complete HTML ready to inject into contract template. Maintain existing dark theme CSS (#0F1220 background, #5A27FF accent).
Make ⚠️ sections (Refund Policy, Results Disclaimer) visually prominent with red-tinted backgrounds.
          `.trim(),
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 4: validate_contract ============

server.tool(
    'validate_contract',
    'Validates all required fields before contract generation. Returns blocking errors and advisory warnings.',
    {
        clientId: z.string().describe('Firestore client document ID'),
        quoteId: z.string().describe('Firestore quote document ID'),
    },
    async ({ clientId, quoteId }) => {
        const errors = [];
        const warnings = [];

        const clientSnap = await db.collection('clients').doc(clientId).get();
        const quoteSnap = await db
            .collection('clients').doc(clientId)
            .collection('quotes').doc(quoteId)
            .get();

        if (!clientSnap.exists) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ valid: false, errors: ['Client not found'], warnings: [] }) }],
            };
        }

        if (!quoteSnap.exists) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ valid: false, errors: ['Quote not found'], warnings: [] }) }],
            };
        }

        const client = clientSnap.data();
        const quote = quoteSnap.data();

        // Blocking errors
        if (!client.name) errors.push('Client name is required');
        if (!client.email) errors.push('Client email is required');
        if (!quote.quote?.basePackage) errors.push('Quote must have a base package');
        if (!quote.quote?.finalOneTimeTotal && quote.quote?.finalOneTimeTotal !== 0) {
            errors.push('Quote must have a calculated total');
        }

        // Warnings
        if (!client.address) warnings.push('No client address — recommended for enforceable contract');
        if (!client.phone) warnings.push('No phone number — Twilio SMS will not send');
        if (!client.country) warnings.push('No country set — defaulting to USA jurisdiction');

        const totalAmount = (quote.quote?.finalOneTimeTotal || 0) + (quote.quote?.finalMonthlyTotal || 0);

        if (totalAmount > 2000 && quote.projectInfo?.paymentTerms !== '100-upfront') {
            warnings.push('Contract over $2,000 — strongly recommend adding 50% deposit requirement');
        }
        if (totalAmount > 5000) {
            warnings.push('Contract over $5,000 — recommend attorney review before sending');
        }
        if (!client.business) {
            warnings.push('No business name — using individual name for contract');
        }

        // Check if KB is seeded
        const kbCount = await db.collection('knowledgeBase').count().get();
        if (kbCount.data().count === 0) {
            warnings.push('Knowledge Base is empty — run seed_knowledge_base first for full legal clauses');
        }

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    valid: errors.length === 0,
                    readyToGenerate: errors.length === 0,
                    errors,
                    warnings,
                    clientSummary: {
                        name: client.name,
                        business: client.business,
                        email: client.email,
                        country: client.country || 'Not set',
                    },
                    quoteSummary: {
                        oneTimeTotal: quote.quote?.finalOneTimeTotal,
                        monthlyTotal: quote.quote?.finalMonthlyTotal,
                        serviceCount: (quote.quote?.addons?.length || 0) + 1 + (quote.quote?.monthly?.length || 0),
                    },
                    summary: errors.length === 0
                        ? `✅ Contract ready to generate for ${client.name}`
                        : `❌ ${errors.length} issue(s) must be resolved before generating`,
                }, null, 2),
            }],
        };
    }
);

// ============ TOOL 5: save_contract ============

server.tool(
    'save_contract',
    'Saves a fully assembled contract to Firestore under clients/{clientId}/contracts/. Generates contract number and signing URL.',
    {
        clientId: z.string().describe('Firestore client document ID'),
        quoteId: z.string().describe('Firestore quote document ID this contract is based on'),
        contractHTML: z.string().describe('Complete HTML of the assembled contract'),
        jurisdiction: z.enum(['usa', 'mexico']).describe('Governing law jurisdiction'),
        services: z.array(z.object({
            label: z.string(),
            price: z.number(),
            description: z.string().optional(),
        })).describe('One-time services list'),
        monthlyServices: z.array(z.object({
            label: z.string(),
            price: z.number(),
            description: z.string().optional(),
        })).optional().describe('Monthly services list'),
        oneTimeTotal: z.number().describe('Final one-time total after discounts'),
        monthlyTotal: z.number().optional().describe('Final monthly total after discounts'),
        paymentTerms: z.string().describe('Payment terms label'),
        riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Risk level from analyze_quote'),
        legalClauses: z.record(z.string()).optional().describe('Legal clauses map stored with the contract'),
    },
    async ({ clientId, quoteId, contractHTML, jurisdiction, services, monthlyServices, oneTimeTotal, monthlyTotal, paymentTerms, riskLevel, legalClauses }) => {
        try {
            // Auto-increment contract number
            const year = new Date().getFullYear();
            let contractNumber;

            try {
                const result = await db.runTransaction(async (t) => {
                    const counterRef = db.collection('counters').doc('contracts');
                    const counterDoc = await t.get(counterRef);
                    let nextNumber = 1;
                    if (counterDoc.exists) {
                        const data = counterDoc.data();
                        if (data.year === year) {
                            nextNumber = (data.lastNumber || 0) + 1;
                        }
                    }
                    t.set(counterRef, { year, lastNumber: nextNumber });
                    return nextNumber;
                });
                contractNumber = `MRK-${year}-${String(result).padStart(4, '0')}`;
            } catch {
                const random = Math.floor(Math.random() * 9000 + 1000);
                contractNumber = `MRK-${year}-${random}`;
            }

            const contractRef = db
                .collection('clients').doc(clientId)
                .collection('contracts')
                .doc();

            // Generate public signing token
            const tokenData = `${contractRef.id}:${clientId}:${Date.now()}`;
            const publicToken = Buffer.from(tokenData).toString('base64');
            const tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            const contractData = {
                contractNumber,
                clientId,
                quoteId,
                services,
                monthlyServices: monthlyServices || [],
                oneTimeTotal,
                monthlyTotal: monthlyTotal || 0,
                finalOneTimeTotal: oneTimeTotal,
                finalMonthlyTotal: monthlyTotal || 0,
                paymentTerms,
                jurisdiction,
                riskLevel,
                legalClauses: legalClauses || {},
                status: 'draft',
                publicToken,
                publicUrl: `https://merkadagency-dd2aa.web.app/sign/${contractRef.id}?token=${publicToken}`,
                tokenExpiry,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                signedAt: null,
                pdfUrl: null,
            };

            await contractRef.set(contractData);

            // Log to timeline
            try {
                await db
                    .collection('clients').doc(clientId)
                    .collection('timeline')
                    .add({
                        type: 'contract_generated',
                        contractId: contractRef.id,
                        contractNumber,
                        totalAmount: oneTimeTotal + (monthlyTotal || 0),
                        riskLevel,
                        jurisdiction,
                        date: FieldValue.serverTimestamp(),
                    });
            } catch {
                // timeline is non-critical
            }

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: true,
                        contractId: contractRef.id,
                        contractNumber,
                        status: 'draft',
                        riskLevel,
                        publicUrl: contractData.publicUrl,
                        message: `✅ Contract ${contractNumber} saved as draft — ready to review and send`,
                    }, null, 2),
                }],
            };
        } catch (err) {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: err.message,
                        message: `❌ Failed to save contract: ${err.message}`,
                    }, null, 2),
                }],
            };
        }
    }
);

// ============ START SERVER ============

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🟢 MerkadAgency Contracts MCP Server running');
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});

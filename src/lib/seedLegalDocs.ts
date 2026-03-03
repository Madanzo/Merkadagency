import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

const LEGAL_COLLECTION = 'legal_docs';

export interface LegalDoc {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    type: 'template' | 'clauses' | 'legal';
    content: string;
    /** Only present on the Service Clause Library doc */
    services?: Record<string, string>;
    createdAt: Timestamp;
}

// ============ DOCUMENT DEFINITIONS ============

const masterContractTemplate = {
    name: 'Master Contract Template',
    status: 'active',
    type: 'template',
    content: `This Digital Marketing Services Agreement ("Agreement") is entered into as of [DATE] by and between:

AGENCY: MerkadAgency LLC
Email: camilo.reyna@merkadagency.com

CLIENT: [CLIENT_FULL_LEGAL_NAME]
Business: [CLIENT_BUSINESS_NAME]
Email: [CLIENT_EMAIL]
Phone: [CLIENT_PHONE]
Address: [CLIENT_ADDRESS]

Collectively referred to as the "Parties."
This Agreement governs all digital marketing services provided by Agency to Client as outlined below.`,
};

const serviceClauseLibrary = {
    name: 'Service Clause Library',
    status: 'active',
    type: 'clauses',
    content: 'Service-specific legal clauses — see services field.',
    services: {
        'Social Media Management': `Agency agrees to manage Client's social media presence including content creation, scheduling, and community management.
NOT INCLUDED: Paid advertising spend, influencer partnerships, or crisis management outside normal community interactions.
Client must provide brand assets, approvals within 48 hours, and platform access within 3 business days of contract signing.`,

        'Paid Ads (Meta/Google)': `Agency agrees to manage paid advertising campaigns on agreed platforms.
IMPORTANT: Ad spend is paid DIRECTLY by Client to the platform and is NOT included in Agency management fees.
Agency cannot guarantee specific ROAS, CPL, or conversion rates.
Platform policy changes, account restrictions, or algorithm updates are outside Agency control and Agency bears no liability for platform-side changes affecting campaign performance.`,

        'SEO': `Agency agrees to provide search engine optimization services.
IMPORTANT: SEO results typically require 3-6 months to materialize.
Agency cannot guarantee specific search rankings, traffic volume, or revenue from organic search.
Google and other search engine algorithm updates may affect rankings without notice — Agency bears no liability for ranking changes caused by algorithm updates outside Agency's control.
Client must provide timely website access and approve changes within 5 business days.`,

        'Web Design': `Agency agrees to design and develop Client's website as scoped.
Includes 2 rounds of revisions. Additional revisions billed separately.
Post-launch maintenance is NOT included unless separately contracted.
Client is responsible for all hosting, domain, and third-party plugin subscription fees.
Client must provide all content, images, and copy unless content creation is separately contracted.`,

        'Email Marketing': `Agency agrees to manage Client's email marketing including campaign creation, list management, and performance reporting.
Email platform subscription fees are paid directly by Client.
Agency cannot guarantee open rates, click rates, or revenue generated from email campaigns.`,

        'Content Creation': `Agency agrees to create content as specified in the quote.
All content remains Agency property until full payment is received.
Upon full payment, Client receives full ownership of all content created under this Agreement.
2 rounds of revisions included per deliverable.
Additional revisions billed at Agency's standard hourly rate.`,

        'AI Automation': `Agency agrees to build and implement AI automation solutions as scoped.
AI systems depend on third-party platforms whose APIs, pricing, and availability may change without notice.
Agency bears no liability for third-party platform outages, pricing changes, or policy updates affecting automation performance.
Client must provide all required API access and credentials within 3 business days of contract signing.`,

        'Full Service Retainer': `Client retains Agency on an ongoing monthly basis for comprehensive digital marketing services as outlined in this Agreement.
Monthly retainer fee is due on the 1st of each month.
Unused hours or services do NOT roll over to the following month.
Agency may adjust retainer pricing with 30 days written notice at each 6-month renewal period.`,
    },
};

const paymentTermsPolicy = {
    name: 'Payment Terms & Late Fee Policy',
    status: 'active',
    type: 'legal',
    content: `PAYMENT TERMS

3.1 Fees
Client agrees to pay all fees as outlined in this Agreement. Work begins ONLY after receipt of initial payment. Agency is not obligated to begin services until payment clears.

3.2 Payment Schedule
Retainer services: Due on the 1st of each month.
Project-based services: 50% deposit due before work begins. Remaining 50% due upon project completion before final delivery.
One-time services: Payment due in full before work begins.

3.3 Late Payment
Invoices unpaid after 5 business days will incur a late fee of 1.5% per month (18% annually) on the outstanding balance, or the maximum rate permitted by applicable law.

3.4 Service Suspension
Agency reserves the right to pause or suspend all services if payment is more than 7 days overdue, without liability to Client for any resulting delays or business losses.

3.5 Reactivation
A reactivation fee will be charged before suspended services resume following a late payment.

3.6 Collections
If Client fails to pay within 30 days of due date, Agency may refer the account to collections or pursue legal action. Client agrees to pay all collection costs, attorney fees, and court costs incurred by Agency in recovering payment.`,
};

const noRefundPolicy = {
    name: 'No Refund Policy',
    status: 'active',
    type: 'legal',
    content: `REFUND POLICY

ALL FEES ARE NON-REFUNDABLE.

4.1 No Refunds
Due to the time-intensive and custom nature of digital marketing services, Agency does not offer refunds on any fees paid including setup fees, monthly retainer fees, ad management fees, content creation fees, and web design deposits.

4.2 Work Already Performed
If Client terminates this Agreement for any reason, Client remains responsible for all fees for work performed up to the termination date, including partially completed work.

4.3 Dispute Process
If Client is dissatisfied with services, Client must submit a written complaint to camilo.reyna@merkadagency.com and allow 10 business days for Agency to resolve the issue before pursuing any other remedy.

4.4 Chargebacks
Client agrees not to initiate chargebacks or payment disputes for services rendered. Any chargeback filed after services have been delivered will be disputed by Agency with full documentation of services provided.`,
};

const ipOwnershipDoc = {
    name: 'Intellectual Property & Ownership',
    status: 'active',
    type: 'legal',
    content: `INTELLECTUAL PROPERTY & OWNERSHIP

5.1 Client Ownership Upon Full Payment
Upon receipt of full payment for all services rendered, Agency assigns to Client all rights, title, and interest in deliverables specifically created for Client under this Agreement.

5.2 Agency Ownership Until Payment
All work product remains the sole property of Agency until full payment is received. Client may not use, publish, or distribute any deliverable until full payment is made.

5.3 Agency Tools & Processes
Agency retains all rights to its proprietary tools, processes, methodologies, templates, AI systems, and internal systems. This Agreement does not transfer any rights to Agency's internal tools or processes.

5.4 Third-Party Assets
Agency may use licensed stock photos, fonts, plugins, or software in deliverables. Client is responsible for maintaining required licenses for continued use after project completion.

5.5 Portfolio Rights
Agency reserves the right to display work created for Client in Agency's portfolio, case studies, and marketing materials unless Client provides written objection within 30 days of project completion.`,
};

const ndaDoc = {
    name: 'NDA & Confidentiality',
    status: 'active',
    type: 'legal',
    content: `CONFIDENTIALITY & NON-DISCLOSURE

6.1 Mutual Confidentiality
Both Parties agree to keep confidential all non-public information disclosed during this Agreement including business strategies, financial information, customer data and lists, proprietary processes, pricing, and contract terms.

6.2 Non-Disclosure
Neither Party shall disclose Confidential Information to any third party without prior written consent, except as required by law.

6.3 Duration
Confidentiality obligations survive termination of this Agreement for 2 years.

6.4 Exceptions
Obligations do not apply to information that becomes publicly available through no fault of the receiving Party, was already known to the receiving Party, or is required to be disclosed by law or court order.`,
};

const resultsDisclaimerDoc = {
    name: 'Results Disclaimer',
    status: 'active',
    type: 'legal',
    content: `RESULTS DISCLAIMER — READ CAREFULLY

7.1 No Guarantee of Results
Agency makes no guarantee of specific results including revenue or sales increases, return on ad spend (ROAS), search engine rankings, follower or engagement growth, lead volume or quality, or website traffic.

7.2 External Factors
Digital marketing results depend on factors outside Agency's control including market conditions, competition, platform algorithm changes, client industry, budget size, and general economic conditions.

7.3 Past Results
Client acknowledges that case studies and past results presented by Agency do not guarantee future performance. Digital marketing is an investment with inherent risk.

7.4 Client Cooperation
Results are dependent on Client's timely cooperation, feedback, approvals, and provision of required materials. Agency is not responsible for poor results caused by Client's failure to cooperate or provide materials on time.`,
};

const terminationPolicyDoc = {
    name: 'Termination Policy',
    status: 'active',
    type: 'legal',
    content: `TERMINATION

8.1 Termination by Client
Client may terminate with 30 days written notice to camilo.reyna@merkadagency.com. Client remains responsible for all fees during the 30-day notice period.

8.2 Termination by Agency
Agency may terminate with 30 days written notice, or immediately if Client fails to pay within 15 days of due date, engages in illegal or abusive behavior, or materially breaches this Agreement.

8.3 Effect of Termination
All outstanding invoices become immediately due. Agency will deliver all completed paid work and transfer access credentials within 5 business days.

8.4 No Refund on Termination
Termination does not entitle Client to any refund of fees already paid per the Refund Policy above.`,
};

const usGoverningLaw = {
    name: 'US Governing Law',
    status: 'active',
    type: 'legal',
    content: `GOVERNING LAW — UNITED STATES

This Agreement shall be governed by the laws of the State of Texas, without regard to conflict of law principles.

Both Parties agree to first attempt resolution through good faith negotiation within 30 days of written notice of any dispute, followed by non-binding mediation before pursuing litigation.

Any legal proceedings shall be brought exclusively in the courts of Houston, Texas.

The prevailing Party in any dispute shall be entitled to recover reasonable attorney fees and court costs from the non-prevailing Party.`,
};

const mexicoGoverningLaw = {
    name: 'Mexico Governing Law',
    status: 'active',
    type: 'legal',
    content: `GOVERNING LAW — MEXICO

Este Acuerdo se regirá por las leyes de los Estados Unidos Mexicanos, incluyendo el Código Civil Federal y la Ley Federal de Protección al Consumidor (LFPC).

Ambas Partes acuerdan intentar resolver cualquier disputa mediante negociación de buena fe dentro de 30 días de notificación escrita, seguido de mediación ante PROFECO antes de iniciar procedimientos legales.

Cualquier procedimiento legal se llevará a cabo exclusivamente en los tribunales de la Ciudad de México, México.

La Parte prevaleciente en cualquier disputa tendrá derecho a recuperar honorarios de abogados razonables y costas judiciales de la Parte no prevaleciente.

This Agreement — Mexico Governing Law:
This Agreement is governed by the laws of Mexico including the Federal Civil Code and the Federal Consumer Protection Law (LFPC).`,
};

const revisionScopePolicy = {
    name: 'Revision & Scope Policy',
    status: 'active',
    type: 'legal',
    content: `REVISION & SCOPE OF WORK POLICY

11.1 Included Revisions
Each deliverable includes 2 rounds of revisions.

11.2 Definition of a Revision
A revision is minor changes to existing work such as copy edits, color adjustments, or layout tweaks. A revision is NOT a new concept, direction change, or addition of features not in the original scope.

11.3 Additional Revisions
Revisions beyond 2 rounds are billed at Agency's standard hourly rate, invoiced separately.

11.4 Revision Window
Client must submit revision requests within 5 business days of receiving a deliverable. After this window, the deliverable is considered approved and accepted.

11.5 Scope Creep
Any requests outside the original Scope of Work require a written Change Order and additional fees. Agency will provide a Change Order for Client approval before proceeding with out-of-scope work.

11.6 Client Delays
If Client delays approvals or feedback beyond 5 business days, Agency reserves the right to adjust the project timeline accordingly without penalty to Agency.`,
};

// ============ SEEDER FUNCTION ============

const ALL_LEGAL_DOCS = [
    masterContractTemplate,
    serviceClauseLibrary,
    paymentTermsPolicy,
    noRefundPolicy,
    ipOwnershipDoc,
    ndaDoc,
    resultsDisclaimerDoc,
    terminationPolicyDoc,
    usGoverningLaw,
    mexicoGoverningLaw,
    revisionScopePolicy,
];

/**
 * Seed all 11 legal documents into the `legal_docs` Firestore collection.
 * Idempotent — checks if docs already exist before inserting.
 */
export async function seedLegalDocs(): Promise<void> {
    const ref = collection(db, LEGAL_COLLECTION);
    const existing = await getDocs(ref);

    if (existing.size > 0) {
        console.log(`✅ Legal docs already seeded (${existing.size} docs) — skipping`);
        return;
    }

    console.log('🔧 Seeding legal documents...');
    const now = Timestamp.now();

    for (const doc of ALL_LEGAL_DOCS) {
        await addDoc(ref, {
            ...doc,
            createdAt: now,
        });
        console.log(`  ✅ Saved: ${doc.name}`);
    }

    console.log('✅ Knowledge Base seeded successfully — 11 legal documents ready');
}

/**
 * Fetch all active legal docs from `legal_docs` collection.
 */
export async function getLegalDocs(): Promise<LegalDoc[]> {
    const ref = collection(db, LEGAL_COLLECTION);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
    })) as LegalDoc[];
}

/**
 * Build legal clauses for a contract based on service labels and jurisdiction.
 * Falls back to a placeholder if the Knowledge Base hasn't been seeded yet.
 */
export async function buildLegalClauses(
    serviceLabels: string[],
    jurisdiction: 'usa' | 'mexico' = 'usa'
): Promise<Record<string, string>> {
    const docs = await getLegalDocs();

    if (docs.length === 0) {
        return {
            _fallback: '[Legal clauses pending — contact camilo.reyna@merkadagency.com]',
        };
    }

    const clauses: Record<string, string> = {};

    // Map docs by name for easy lookup
    const byName = new Map<string, LegalDoc>();
    for (const d of docs) {
        if (d.status === 'active') byName.set(d.name, d);
    }

    // Always-included docs
    const alwaysInclude = [
        'Payment Terms & Late Fee Policy',
        'No Refund Policy',
        'Intellectual Property & Ownership',
        'NDA & Confidentiality',
        'Results Disclaimer',
        'Termination Policy',
        'Revision & Scope Policy',
    ];

    for (const name of alwaysInclude) {
        const doc = byName.get(name);
        if (doc) clauses[name] = doc.content;
    }

    // Jurisdiction-specific
    const lawDoc = jurisdiction === 'mexico'
        ? byName.get('Mexico Governing Law')
        : byName.get('US Governing Law');
    if (lawDoc) clauses['Governing Law'] = lawDoc.content;

    // Service-specific clauses
    const serviceLib = byName.get('Service Clause Library');
    if (serviceLib?.services) {
        const matchedClauses: string[] = [];
        for (const label of serviceLabels) {
            // Try exact match first, then partial match
            const exactMatch = serviceLib.services[label];
            if (exactMatch) {
                matchedClauses.push(`**${label}**\n${exactMatch}`);
                continue;
            }
            // Partial match — check if service label contains a key
            for (const [key, clause] of Object.entries(serviceLib.services)) {
                if (label.toLowerCase().includes(key.toLowerCase()) ||
                    key.toLowerCase().includes(label.toLowerCase())) {
                    matchedClauses.push(`**${label}**\n${clause}`);
                    break;
                }
            }
        }
        if (matchedClauses.length > 0) {
            clauses['Service-Specific Terms'] = matchedClauses.join('\n\n');
        }
    }

    return clauses;
}

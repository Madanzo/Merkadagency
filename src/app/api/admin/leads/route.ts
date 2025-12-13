import { NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/leads - List leads with filters
export async function GET(request: Request) {
    try {
        await requireAuth();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '25');
        const status = searchParams.get('status');
        const formType = searchParams.get('formType');
        const search = searchParams.get('search')?.toLowerCase();

        let query = db.collection(COLLECTIONS.LEADS).orderBy('createdAt', 'desc');

        // Apply filters
        if (status) {
            query = query.where('status', '==', status);
        }
        if (formType) {
            query = query.where('formType', '==', formType);
        }

        // Get all docs for filtering and pagination
        const snapshot = await query.get();

        interface LeadDoc {
            id: string;
            email?: string;
            name?: string;
            company?: string;
            phone?: string;
            formType?: string;
            status?: string;
            score?: number;
            createdAt: string;
            updatedAt: string;
            [key: string]: unknown;
        }

        let leads: LeadDoc[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            } as LeadDoc;
        });

        // Apply search filter (client-side since Firestore doesn't support full-text search)
        if (search) {
            leads = leads.filter(lead =>
                lead.email?.toLowerCase().includes(search) ||
                lead.name?.toLowerCase().includes(search) ||
                lead.company?.toLowerCase().includes(search)
            );
        }

        const total = leads.length;

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginatedLeads = leads.slice(startIndex, startIndex + limit);

        // Get note counts for each lead
        const leadsWithCounts = await Promise.all(
            paginatedLeads.map(async (lead) => {
                const notesSnapshot = await db.collection(COLLECTIONS.NOTES)
                    .where('leadId', '==', lead.id)
                    .count()
                    .get();
                return {
                    ...lead,
                    _count: {
                        notes: notesSnapshot.data().count,
                    },
                };
            })
        );

        return NextResponse.json({
            leads: leadsWithCounts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

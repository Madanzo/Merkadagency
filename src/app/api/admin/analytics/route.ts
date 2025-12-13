import { NextResponse } from 'next/server';
import { db, COLLECTIONS, LeadStatus } from '@/lib/firebase';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/analytics - Dashboard statistics
export async function GET() {
    try {
        await requireAuth();

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Get all leads
        const leadsSnapshot = await db.collection(COLLECTIONS.LEADS).get();

        interface LeadData {
            status?: string;
            formType?: string;
            createdAt: Date;
        }

        const leads: LeadData[] = leadsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                status: data.status,
                formType: data.formType,
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            };
        });

        // Calculate stats
        const totalLeads = leads.length;
        const newThisWeek = leads.filter(l => l.createdAt >= sevenDaysAgo).length;
        const newThisMonth = leads.filter(l => l.createdAt >= thirtyDaysAgo).length;

        // Status distribution
        const statusDistribution: Record<string, number> = {};
        leads.forEach(lead => {
            const status = lead.status || LeadStatus.NEW;
            statusDistribution[status] = (statusDistribution[status] || 0) + 1;
        });

        // Form type distribution
        const formTypeDistribution: Record<string, number> = {};
        leads.forEach(lead => {
            const formType = lead.formType || 'CONTACT';
            formTypeDistribution[formType] = (formTypeDistribution[formType] || 0) + 1;
        });

        // Conversion rate
        const wonCount = statusDistribution[LeadStatus.WON] || 0;
        const lostCount = statusDistribution[LeadStatus.LOST] || 0;
        const conversionRate = wonCount + lostCount > 0
            ? Math.round((wonCount / (wonCount + lostCount)) * 100)
            : 0;

        // Recent leads by day (last 7 days)
        const recentLeads: { date: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = leads.filter(l => {
                const leadDate = l.createdAt.toISOString().split('T')[0];
                return leadDate === dateStr;
            }).length;
            recentLeads.push({ date: dateStr, count });
        }

        return NextResponse.json({
            overview: {
                totalLeads,
                newThisWeek,
                newThisMonth,
                conversionRate,
            },
            statusDistribution,
            formTypeDistribution,
            recentLeads,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}

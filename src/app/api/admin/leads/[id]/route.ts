import { NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/leads/[id] - Get single lead with notes
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;

        // Get lead
        const leadDoc = await db.collection(COLLECTIONS.LEADS).doc(id).get();

        if (!leadDoc.exists) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Get notes for this lead
        const notesSnapshot = await db.collection(COLLECTIONS.NOTES)
            .where('leadId', '==', id)
            .orderBy('createdAt', 'desc')
            .get();

        const notes = notesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
            author: doc.data().authorName ? {
                name: doc.data().authorName,
                email: doc.data().authorEmail,
            } : null,
        }));

        const leadData = leadDoc.data();
        const lead = {
            id: leadDoc.id,
            ...leadData,
            createdAt: leadData?.createdAt?.toDate?.()?.toISOString() || leadData?.createdAt,
            updatedAt: leadData?.updatedAt?.toDate?.()?.toISOString() || leadData?.updatedAt,
            notes,
        };

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Error fetching lead:', error);
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
    }
}

// PATCH /api/admin/leads/[id] - Update lead
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;
        const data = await request.json();

        // Only allow updating specific fields
        const allowedFields = ['status', 'score', 'tags', 'name', 'phone', 'company', 'website'];
        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        await db.collection(COLLECTIONS.LEADS).doc(id).update(updateData);

        // Get updated lead
        const updatedDoc = await db.collection(COLLECTIONS.LEADS).doc(id).get();
        const updatedData = updatedDoc.data();

        return NextResponse.json({
            id: updatedDoc.id,
            ...updatedData,
            createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
            updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || updatedData?.updatedAt,
        });
    } catch (error) {
        console.error('Error updating lead:', error);
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

// DELETE /api/admin/leads/[id] - Delete lead
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;

        // Delete all notes for this lead first
        const notesSnapshot = await db.collection(COLLECTIONS.NOTES)
            .where('leadId', '==', id)
            .get();

        const batch = db.batch();
        notesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Delete the lead
        batch.delete(db.collection(COLLECTIONS.LEADS).doc(id));

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting lead:', error);
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
    }
}

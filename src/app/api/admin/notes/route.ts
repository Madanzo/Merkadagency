import { NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import { requireAuth, getServerSession } from '@/lib/auth';

// POST /api/admin/notes - Create a note for a lead
export async function POST(request: Request) {
    try {
        const session = await requireAuth();
        const { leadId, content } = await request.json();

        if (!leadId || !content) {
            return NextResponse.json(
                { error: 'Lead ID and content are required' },
                { status: 400 }
            );
        }

        // Get user info from session
        const noteData = {
            leadId,
            content,
            authorId: (session.user as { id?: string })?.id || null,
            authorName: session.user?.name || null,
            authorEmail: session.user?.email || null,
            createdAt: new Date(),
        };

        const docRef = await db.collection(COLLECTIONS.NOTES).add(noteData);

        return NextResponse.json({
            id: docRef.id,
            ...noteData,
            createdAt: noteData.createdAt.toISOString(),
            author: noteData.authorName ? {
                name: noteData.authorName,
                email: noteData.authorEmail,
            } : null,
        });
    } catch (error) {
        console.error('Error creating note:', error);
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
}

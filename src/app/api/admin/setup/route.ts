import { NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import bcrypt from 'bcryptjs';

// POST /api/admin/setup - Create first admin user
// This endpoint only works if no users exist
export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check if any users exist
        const usersSnapshot = await db.collection(COLLECTIONS.USERS).limit(1).get();

        if (!usersSnapshot.empty) {
            return NextResponse.json(
                { error: 'Setup already completed. Admin user exists.' },
                { status: 403 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const userData = {
            email,
            name: name || 'Admin',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
        };

        const docRef = await db.collection(COLLECTIONS.USERS).add(userData);

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            userId: docRef.id,
        });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json(
            { error: 'Failed to create admin user' },
            { status: 500 }
        );
    }
}

// GET /api/admin/setup - Check if setup is needed
export async function GET() {
    try {
        const usersSnapshot = await db.collection(COLLECTIONS.USERS).limit(1).get();

        return NextResponse.json({
            setupRequired: usersSnapshot.empty,
        });
    } catch (error) {
        console.error('Setup check error:', error);
        return NextResponse.json(
            { error: 'Failed to check setup status' },
            { status: 500 }
        );
    }
}

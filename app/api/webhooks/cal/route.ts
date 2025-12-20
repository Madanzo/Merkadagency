import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin for server-side operations
// Note: For production, use service account credentials
const getAdminApp = () => {
    if (getApps().length === 0) {
        // In production, use service account from environment variable
        // For now, using default credentials (works in Firebase-hosted environments)
        // or you can add FIREBASE_SERVICE_ACCOUNT_KEY env variable
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            return initializeApp({
                credential: cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        }
        // Fallback: Initialize without credentials (limited functionality)
        return initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    }
    return getApps()[0];
};

interface CalBookingPayload {
    triggerEvent: string;
    payload: {
        attendees: Array<{
            email: string;
            name: string;
            timeZone: string;
        }>;
        organizer: {
            email: string;
            name: string;
        };
        title: string;
        startTime: string;
        endTime: string;
        metadata?: Record<string, unknown>;
    };
}

export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret (optional but recommended)
        const webhookSecret = process.env.CAL_WEBHOOK_SECRET;
        if (webhookSecret) {
            const authHeader = request.headers.get("authorization");
            if (authHeader !== `Bearer ${webhookSecret}`) {
                console.warn("Cal.com webhook: Invalid authorization");
                // Still process for now, but log warning
            }
        }

        const body: CalBookingPayload = await request.json();

        // Only process booking confirmations
        if (body.triggerEvent !== "BOOKING_CREATED") {
            return NextResponse.json({ received: true, processed: false });
        }

        const attendee = body.payload.attendees?.[0];
        if (!attendee) {
            console.error("Cal.com webhook: No attendee in payload");
            return NextResponse.json({ error: "No attendee" }, { status: 400 });
        }

        // Initialize admin and create lead
        const app = getAdminApp();
        const db = getFirestore(app);

        const now = Timestamp.now();
        const leadData = {
            name: attendee.name || "Unknown",
            email: attendee.email,
            phone: "",
            source: "cal.com",
            status: "booked",
            createdAt: now,
            updatedAt: now,
            notes: [
                {
                    text: `Booking: ${body.payload.title} at ${new Date(body.payload.startTime).toLocaleString()}`,
                    createdAt: now,
                },
            ],
        };

        await db.collection("leads").add(leadData);

        console.log(`Cal.com webhook: Lead created for ${attendee.email}`);
        return NextResponse.json({ received: true, processed: true });
    } catch (error) {
        console.error("Cal.com webhook error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// Handle GET for webhook verification
export async function GET() {
    return NextResponse.json({ status: "Cal.com webhook endpoint active" });
}

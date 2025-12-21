import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Singleton for Firebase Admin
let adminApp: App | null = null;

const getAdminApp = (): App => {
    if (adminApp) {
        return adminApp;
    }

    if (getApps().length > 0) {
        adminApp = getApps()[0];
        return adminApp;
    }

    // Check for service account key
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
        console.log("[Cal Webhook] Initializing with service account credentials");
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            adminApp = initializeApp({
                credential: cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            return adminApp;
        } catch (parseError) {
            console.error("[Cal Webhook] Failed to parse service account key:", parseError);
            throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format");
        }
    }

    // No service account - this won't work for Firestore writes
    console.error("[Cal Webhook] ERROR: FIREBASE_SERVICE_ACCOUNT_KEY not set!");
    console.error("[Cal Webhook] The webhook cannot write to Firestore without service account credentials.");
    throw new Error("Firebase Admin requires FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
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
    console.log("[Cal Webhook] ========== REQUEST RECEIVED ==========");
    console.log("[Cal Webhook] Time:", new Date().toISOString());

    try {
        // Log headers for debugging
        const contentType = request.headers.get("content-type");
        console.log("[Cal Webhook] Content-Type:", contentType);

        // Check webhook secret
        const webhookSecret = process.env.CAL_WEBHOOK_SECRET;
        const authHeader = request.headers.get("authorization");
        console.log("[Cal Webhook] Auth header present:", !!authHeader);
        console.log("[Cal Webhook] Webhook secret configured:", !!webhookSecret);

        // Parse body
        const rawBody = await request.text();
        console.log("[Cal Webhook] Raw body length:", rawBody.length);
        console.log("[Cal Webhook] Raw body preview:", rawBody.substring(0, 500));

        let body: CalBookingPayload;
        try {
            body = JSON.parse(rawBody);
        } catch (parseError) {
            console.error("[Cal Webhook] Failed to parse JSON:", parseError);
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        console.log("[Cal Webhook] Trigger event:", body.triggerEvent);
        console.log("[Cal Webhook] Payload keys:", Object.keys(body.payload || {}));

        // Only process booking confirmations
        if (body.triggerEvent !== "BOOKING_CREATED") {
            console.log("[Cal Webhook] Ignoring event (not BOOKING_CREATED)");
            return NextResponse.json({ received: true, processed: false, reason: "Event type not handled" });
        }

        const attendee = body.payload?.attendees?.[0];
        if (!attendee) {
            console.error("[Cal Webhook] No attendee in payload");
            console.log("[Cal Webhook] Attendees array:", body.payload?.attendees);
            return NextResponse.json({ error: "No attendee in payload" }, { status: 400 });
        }

        console.log("[Cal Webhook] Attendee found:", { name: attendee.name, email: attendee.email });

        // Initialize Firebase Admin
        console.log("[Cal Webhook] Initializing Firebase Admin...");
        const app = getAdminApp();
        console.log("[Cal Webhook] Firebase Admin initialized successfully");

        const db = getFirestore(app);
        console.log("[Cal Webhook] Firestore instance obtained");

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

        console.log("[Cal Webhook] Lead data prepared:", JSON.stringify(leadData, null, 2));
        console.log("[Cal Webhook] Writing to Firestore...");

        const docRef = await db.collection("leads").add(leadData);

        console.log("[Cal Webhook] ✅ SUCCESS! Lead created with ID:", docRef.id);
        console.log("[Cal Webhook] ========== REQUEST COMPLETE ==========");

        return NextResponse.json({
            received: true,
            processed: true,
            leadId: docRef.id,
            email: attendee.email
        });
    } catch (error) {
        console.error("[Cal Webhook] ❌ ERROR:", error);
        console.error("[Cal Webhook] Error type:", typeof error);
        console.error("[Cal Webhook] Error message:", error instanceof Error ? error.message : String(error));
        console.error("[Cal Webhook] Error stack:", error instanceof Error ? error.stack : "No stack");
        console.log("[Cal Webhook] ========== REQUEST FAILED ==========");

        return NextResponse.json({
            error: "Internal error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// Handle GET for webhook verification
export async function GET() {
    console.log("[Cal Webhook] GET request - health check");
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const hasProjectId = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    return NextResponse.json({
        status: "Cal.com webhook endpoint active",
        timestamp: new Date().toISOString(),
        config: {
            serviceAccountConfigured: hasServiceAccount,
            projectIdConfigured: hasProjectId,
        }
    });
}

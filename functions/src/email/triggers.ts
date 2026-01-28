import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendContactThankYou, sendWelcomeEmail, sendBookingConfirmation } from './resend';
import { startSequence } from './sequences';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

/**
 * Trigger: When a new contact form submission is created
 * Sends a thank you email to the user
 */
export const onContactFormSubmit = functions.firestore
    .document('contact_submissions/{docId}')
    .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
        const data = snap.data();
        const { email, name } = data;

        if (!email) {
            console.log('No email provided in contact form');
            return null;
        }

        // Send thank you email
        const result = await sendContactThankYou(email, name || 'there');

        // Log the email send
        await db.collection('email_logs').add({
            to: email,
            type: 'contact_thank_you',
            status: result.success ? 'sent' : 'failed',
            resendId: result.id || null,
            error: result.error || null,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Also add to subscribers if not already there
        const subscriberRef = db.collection('subscribers').doc(email);
        const subscriberDoc = await subscriberRef.get();

        if (!subscriberDoc.exists) {
            await subscriberRef.set({
                email,
                name: name || '',
                source: 'contact_form',
                tags: ['contact'],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                sequences: {},
            });
            // Start welcome drip sequence
            await startSequence(email, 'welcome');
        }

        return result;
    });

/**
 * Trigger: When a new subscriber is added
 * Sends a welcome email
 */
export const onSubscriberCreated = functions.firestore
    .document('subscribers/{docId}')
    .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
        const data = snap.data();
        const { email, name, source } = data;

        if (!email) {
            console.log('No email in subscriber document');
            return null;
        }

        // Only send welcome email for newsletter signups
        if (source !== 'newsletter') {
            console.log('Skipping welcome email for non-newsletter source:', source);
            return null;
        }

        const result = await sendWelcomeEmail(email, name || 'there');

        // Log the email send
        await db.collection('email_logs').add({
            to: email,
            type: 'welcome',
            status: result.success ? 'sent' : 'failed',
            resendId: result.id || null,
            error: result.error || null,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Start welcome drip sequence for newsletter subscribers
        await startSequence(context.params.docId, 'welcome');

        return result;
    });

/**
 * Trigger: When a new lead is created (from booking)
 * Sends a booking confirmation if it's a booking source
 */
export const onLeadCreated = functions.firestore
    .document('leads/{docId}')
    .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
        const data = snap.data();
        const { email, name, source, bookingDate } = data;

        if (!email) {
            console.log('No email in lead document');
            return null;
        }

        // Only send booking confirmation for booking sources
        if (source !== 'booking' || !bookingDate) {
            console.log('Skipping booking confirmation - not a booking or no date');
            return null;
        }

        const result = await sendBookingConfirmation(
            email,
            name || 'there',
            bookingDate
        );

        // Log the email send
        await db.collection('email_logs').add({
            to: email,
            type: 'booking_confirmation',
            status: result.success ? 'sent' : 'failed',
            resendId: result.id || null,
            error: result.error || null,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Ensure lead is in subscribers collection
        const subscriberRef = db.collection('subscribers').doc(email);
        const subscriberDoc = await subscriberRef.get();

        if (!subscriberDoc.exists) {
            await subscriberRef.set({
                email,
                name: name || '',
                source: 'booking',
                tags: ['lead', 'booked'],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                sequences: {},
            });
        }

        // Start Post-Booking Drip Sequence
        await startSequence(email, 'post-booking');

        return result;
    });

/**
 * HTTP Callable: Manually send an email (for admin use)
 */
export const sendManualEmail = functions.https.onCall(async (data: { to: string; subject: string; html: string; templateType?: string }, context: functions.https.CallableContext) => {
    // Verify the caller is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Must be authenticated to send emails'
        );
    }

    const { to, subject, html, templateType } = data;

    if (!to || !subject || !html) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing required fields: to, subject, html'
        );
    }

    const { sendEmail } = await import('./resend');
    const result = await sendEmail({ to, subject, html });

    // Log the email send
    await db.collection('email_logs').add({
        to,
        type: templateType || 'manual',
        status: result.success ? 'sent' : 'failed',
        resendId: result.id || null,
        error: result.error || null,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        sentBy: context.auth.uid,
    });

    return result;
});

/**
 * HTTP Callable: Manually start a drip sequence (for admin use)
 */
export const startSubscriberSequence = functions.https.onCall(async (data: { email: string; sequenceName: string }, context: functions.https.CallableContext) => {
    // Verify the caller is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Must be authenticated to manage sequences'
        );
    }

    const { email, sequenceName } = data;

    if (!email || !sequenceName) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing required fields: email, sequenceName'
        );
    }

    // Ensure subscriber exists
    const subscriberRef = db.collection('subscribers').doc(email);
    const subscriberDoc = await subscriberRef.get();

    if (!subscriberDoc.exists) {
        throw new functions.https.HttpsError(
            'not-found',
            'Subscriber not found. Please add them as a subscriber first.'
        );
    }

    try {
        await startSequence(email, sequenceName);
        return { success: true, message: `Started ${sequenceName} sequence for ${email}` };
    } catch (error: any) {
        console.error('Error starting sequence:', error);
        throw new functions.https.HttpsError(
            'internal',
            error.message || 'Failed to start sequence'
        );
    }
});

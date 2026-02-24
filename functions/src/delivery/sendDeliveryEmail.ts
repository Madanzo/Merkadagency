import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { sendEmail } from '../email/resend';

const db = getFirestore();

export const sendDeliveryEmail = onCall({ maxInstances: 5 }, async (request) => {
    // Admin only
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Must be authenticated to send emails');
    }

    const { to, subject, html, clientId, inboxItemId } = request.data;
    if (!to || !subject || !html || !clientId || !inboxItemId) {
        throw new HttpsError('invalid-argument', 'Missing required fields');
    }

    try {
        // Send email via Resend
        const result = await sendEmail({ to, subject, html });

        if (!result.success) {
            throw new Error(result.error || 'Unknown Resend error');
        }

        // Log to Firestore
        await db.collection('emailLog').add({
            clientId,
            inboxItemId,
            subject,
            to,
            resendId: result.id,
            status: 'sent',
            sentAt: FieldValue.serverTimestamp(),
            sentBy: request.auth.uid
        });

        // Add to client timeline
        await db.collection(`clients/${clientId}/timeline`).add({
            type: 'email_sent',
            description: `Email sent: "${subject}"`,
            createdAt: FieldValue.serverTimestamp()
        });

        // Update Inbox item status
        await db.collection('inbox').doc(inboxItemId).update({
            status: 'sent',
            sentAt: FieldValue.serverTimestamp(),
        });

        return { success: true, id: result.id };
    } catch (error: any) {
        logger.error('Email Delivery error:', error);
        throw new HttpsError('internal', `Failed to send email: ${error.message}`);
    }
});

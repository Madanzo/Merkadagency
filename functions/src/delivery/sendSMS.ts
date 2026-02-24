import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import twilio from 'twilio';

const db = getFirestore();

// Lazy init Twilio client to respect env vars
let twilioClient: twilio.Twilio | null = null;
function getTwilio() {
    if (!twilioClient) {
        const sid = process.env.TWILIO_ACCOUNT_SID || '';
        const token = process.env.TWILIO_AUTH_TOKEN || '';
        if (!sid || !token) {
            logger.warn('Twilio credentials not found. SMS will fail.');
        }
        twilioClient = twilio(sid, token);
    }
    return twilioClient;
}

export const sendSMS = onCall({ maxInstances: 5 }, async (request) => {
    // Admin only
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Must be authenticated');
    }

    const { to, message, clientId } = request.data;
    if (!to || !message || !clientId) {
        throw new HttpsError('invalid-argument', 'Missing to, message, or clientId');
    }

    const from = process.env.TWILIO_PHONE_NUMBER || '';
    if (!from) throw new HttpsError('internal', 'TWILIO_PHONE_NUMBER not set');

    try {
        const client = getTwilio();
        const result = await client.messages.create({
            body: message,
            from,
            to
        });

        // Log SMS to Firestore
        await db.collection('smsLog').add({
            clientId,
            message,
            to,
            twilioSid: result.sid,
            status: result.status,
            sentAt: FieldValue.serverTimestamp(),
            sentBy: request.auth.uid
        });

        // Add to timeline
        await db.collection(`clients/${clientId}/timeline`).add({
            type: 'sms_sent',
            description: `SMS sent: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
            createdAt: FieldValue.serverTimestamp()
        });

        return { success: true, sid: result.sid };
    } catch (error: any) {
        logger.error('Twilio SMS error:', error);
        throw new HttpsError('internal', `Failed to send SMS: ${error.message}`);
    }
});

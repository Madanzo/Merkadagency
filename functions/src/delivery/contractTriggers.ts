import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import * as logger from 'firebase-functions/logger';
import { sendEmail } from '../email/resend';
import { jsPDF } from 'jspdf';
import twilio from 'twilio';

const db = getFirestore();

// Twilio helper
function getTwilio() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) return null;
    return twilio(sid, token);
}

export const onContractUpdated = onDocumentUpdated('clients/{clientId}/contracts/{contractId}', async (event) => {
    const clientId = event.params.clientId;
    const contractId = event.params.contractId;

    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    // Detect status change to SIGNED
    if (before.status !== 'signed' && after.status === 'signed') {
        logger.info(`Contract ${contractId} signed for client ${clientId}`);
        await handleContractSigned(clientId, contractId, after);
    }

    // Detect status change to SENT (public link generated)
    if (before.status !== 'sent' && after.status === 'sent') {
        logger.info(`Contract ${contractId} sent to client ${clientId}`);
        await handleContractSent(clientId, contractId, after);
    }
});

async function handleContractSigned(clientId: string, contractId: string, contract: FirebaseFirestore.DocumentData) {
    // 1. Fetch Client Data
    const clientDoc = await db.collection('clients').doc(clientId).get();
    const client = clientDoc.data();
    if (!client) return;

    // 2. Generate PDF
    const pdfBuffer = await generateContractPDFBuffer(contract, client);

    // 3. Upload PDF to Firebase Storage
    const bucket = getStorage().bucket();
    const fileName = `contracts/${clientId}/${contractId}_signed.pdf`;
    const file = bucket.file(fileName);

    const fileBuffer = Buffer.from(pdfBuffer);

    await file.save(fileBuffer, {
        contentType: 'application/pdf',
        metadata: {
            cacheControl: 'public, max-age=31536000',
        }
    });

    // Make signed URL valid for 10 years
    const [pdfUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2035'
    });

    // Save URL back to contract
    await db.doc(`clients/${clientId}/contracts/${contractId}`).update({
        pdfUrl
    });

    // 4. Send Signed Copy via Email
    const clientName = client.name?.split(' ')[0] || 'there';
    await sendEmail({
        to: client.email,
        subject: `Your Signed Contract — MerkadAgency 🎉`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome aboard, ${clientName}!</h2>
                <p>Thank you for signing your contract. A PDF copy of your finalized agreement is attached to this email.</p>
                <p>We'll be in touch shortly with next steps to kick off your project.</p>
                <p>Best,<br>The MerkadAgency Team</p>
            </div>
        `,
        attachments: [{
            filename: `MerkadAgency-Contract-${contract.contractNumber}.pdf`,
            content: Buffer.from(pdfBuffer)
        }]
    });

    // 5. Internal Notification Email
    await sendEmail({
        to: process.env.ADMIN_EMAIL || 'camilo.reyna@merkadagency.com',
        subject: `✅ NEW CLIENT: ${client.name} signed their contract!`,
        html: `<p>${client.name} just signed contract ${contract.contractNumber} for $${contract.finalOneTimeTotal}.</p>`,
        attachments: [{
            filename: `Signed-${contract.contractNumber}.pdf`,
            content: Buffer.from(pdfBuffer)
        }]
    });

    // 6. Send SMS Confirmation (if phone exists)
    if (client.phone) {
        const clientPhone = client.phone.startsWith('+') ? client.phone : `+1${client.phone.replace(/\\D/g, '')}`;
        const twilioClient = getTwilio();
        if (twilioClient) {
            try {
                await twilioClient.messages.create({
                    body: `✅ Welcome aboard! Your MerkadAgency contract is signed. We've emailed you a PDF copy and will be in touch shortly with next steps.`,
                    from: process.env.TWILIO_PHONE_NUMBER || '',
                    to: clientPhone
                });

                // Log SMS
                await db.collection('smsLog').add({
                    clientId,
                    message: "Contract signed confirmation",
                    to: clientPhone,
                    status: 'sent',
                    sentAt: FieldValue.serverTimestamp(),
                });
            } catch (smsErr) {
                logger.error('Failed to send contract confirmation SMS:', smsErr);
            }
        }
    }

    // 7. Update Timeline
    await db.collection(`clients/${clientId}/timeline`).add({
        type: 'contract_signed',
        description: `Contract ${contract.contractNumber} was signed. PDF generated and emailed.`,
        createdAt: FieldValue.serverTimestamp()
    });
}

async function handleContractSent(clientId: string, contractId: string, contract: FirebaseFirestore.DocumentData) {
    const clientDoc = await db.collection('clients').doc(clientId).get();
    const client = clientDoc.data();
    if (!client || !client.phone || !contract.publicUrl) return;

    // Send SMS with contract link
    const clientPhone = client.phone.startsWith('+') ? client.phone : `+1${client.phone.replace(/\\D/g, '')}`;
    const twilioClient = getTwilio();
    if (twilioClient) {
        try {
            const clientName = client.name?.split(' ')[0] || 'there';
            await twilioClient.messages.create({
                body: `Hi ${clientName}, your MerkadAgency contract is ready to review and sign. Click here to view: ${contract.publicUrl}`,
                from: process.env.TWILIO_PHONE_NUMBER || '',
                to: clientPhone
            });

            await db.collection('smsLog').add({
                clientId,
                message: "Contract link sent via SMS",
                to: clientPhone,
                status: 'sent',
                sentAt: FieldValue.serverTimestamp(),
            });

            await db.collection(`clients/${clientId}/timeline`).add({
                type: 'sms_sent',
                description: `SMS sent: Contract signing link`,
                createdAt: FieldValue.serverTimestamp()
            });
        } catch (smsErr) {
            logger.error('Failed to send contract link SMS:', smsErr);
        }
    }
}

// Minimal server-side PDF generation using jsPDF
async function generateContractPDFBuffer(contract: FirebaseFirestore.DocumentData, client: FirebaseFirestore.DocumentData): Promise<ArrayBuffer> {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Server-side PDF generation logic here
    // In a real app we'd map all fields carefully. For now, we put the basics + signature.
    pdf.setFontSize(22);
    pdf.text('Service Agreement', 20, 30);

    pdf.setFontSize(12);
    pdf.text(`Contract #: ${contract.contractNumber}`, 20, 45);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);

    pdf.setFontSize(14);
    pdf.text('Parties', 20, 70);
    pdf.setFontSize(11);
    pdf.text(`Provider: MerkadAgency LLC`, 20, 80);
    pdf.text(`Client: ${client.name} ${client.business ? `(${client.business})` : ''}`, 20, 87);

    pdf.text(`Total Amount: $${contract.finalOneTimeTotal}`, 20, 110);
    if (contract.finalMonthlyTotal) {
        pdf.text(`Monthly Amount: $${contract.finalMonthlyTotal}/mo`, 20, 117);
    }

    pdf.text(`Payment Terms: ${contract.paymentTerms}`, 20, 130);

    // Add Signature if exists
    if (contract.signatureData && contract.signatureData.clientSignature) {
        pdf.text('Signed:', 20, 160);
        // addImage(imageData, format, x, y, width, height)
        pdf.addImage(contract.signatureData.clientSignature, 'PNG', 20, 165, 80, 40);

        pdf.setFontSize(9);
        pdf.text(`IP: ${contract.signatureData.ipAddress || 'Unknown'}`, 20, 215);
        pdf.text(`Date: ${new Date(contract.signatureData.signedAt).toLocaleString()}`, 20, 220);
    }

    return pdf.output('arraybuffer');
}

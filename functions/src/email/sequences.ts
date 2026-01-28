import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from './resend';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

/**
 * Drip Campaign Sequence Definition
 * Each step has a delay (in days) and email content
 */
interface SequenceStep {
    day: number;
    subject: string;
    getHtml: (name: string) => string;
}

const WELCOME_SEQUENCE: SequenceStep[] = [
    {
        day: 0,
        subject: 'Welcome to MerkadAgency! 🚀',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Welcome, ${name}!</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Thanks for joining MerkadAgency. Over the next few days, I'll share some insights 
                    on how AI-powered automation can transform your business.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    First up: Did you know that businesses using automated lead capture see 
                    <strong>150-200% more conversions</strong> than those relying on manual follow-up?
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    I'll show you exactly how we achieve this in the coming emails.
                </p>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Talk soon,<br>
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 3,
        subject: 'How We Helped Kravings Cannabis 3X Their Bookings 📈',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Real Results, ${name}</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Want to see what's possible with the right automation?
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    <strong>Kravings Cannabis</strong> came to us struggling with lead follow-up. 
                    Their team was overwhelmed, and potential customers were slipping through the cracks.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    After implementing our MerkadFlow System™:
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li>📈 <strong>3x more bookings</strong> in 60 days</li>
                    <li>⏰ <strong>80% faster</strong> lead response time</li>
                    <li>💰 <strong>$47K+ additional revenue</strong> in Q1</li>
                </ul>
                <a href="https://merkadagency.com/case-studies/kravings" 
                   style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; 
                          border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                    Read the Full Case Study
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 7,
        subject: 'Quick Question About Your Business',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Hey ${name},</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    I've been thinking about your business...
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Are you currently dealing with any of these challenges?
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li>Leads going cold before you can follow up</li>
                    <li>Spending too much time on manual outreach</li>
                    <li>No idea which marketing channels actually work</li>
                    <li>Inconsistent revenue month-to-month</li>
                </ul>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    If any of these hit home, I'd love to chat. No pitch, just a quick 15-minute call 
                    to see if we can help.
                </p>
                <a href="https://merkadagency.com/book" 
                   style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; 
                          border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                    Grab a Time That Works
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 14,
        subject: 'Last Chance: Free Strategy Session',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">${name}, One More Thing...</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    This is my last email in this series, but I didn't want to leave 
                    without making sure you knew about our free strategy session.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    In 30 minutes, I'll show you:
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li>✅ Exactly where you're losing leads right now</li>
                    <li>✅ A custom automation roadmap for your business</li>
                    <li>✅ Quick wins you can implement immediately</li>
                </ul>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    <strong>No strings attached.</strong> If we're not a fit, you still walk away 
                    with actionable insights.
                </p>
                <a href="https://merkadagency.com/book" 
                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); 
                          color: white; padding: 16px 32px; border-radius: 8px; 
                          text-decoration: none; font-weight: 600; margin-top: 16px;
                          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
                    Claim Your Free Session →
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Hope to chat soon,<br>
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
];

/**
 * Start a drip sequence for a subscriber
 */
export async function startSequence(
    subscriberId: string,
    sequenceName: string = 'welcome'
): Promise<void> {
    const subscriberRef = db.collection('subscribers').doc(subscriberId);
    const now = admin.firestore.Timestamp.now();

    // Calculate next send time (first email sends immediately, so Day 0)
    const sequence = {
        name: sequenceName,
        currentStep: 0,
        startedAt: now,
        nextSendAt: now, // Send first email immediately
        completed: false,
    };

    await subscriberRef.update({
        [`sequences.${sequenceName}`]: sequence,
    });

    console.log(`Started ${sequenceName} sequence for subscriber ${subscriberId}`);
}

/**
 * Get the next email to send for a subscriber
 */
function getSequenceStep(sequenceName: string, stepIndex: number): SequenceStep | null {
    const sequences: Record<string, SequenceStep[]> = {
        welcome: WELCOME_SEQUENCE,
    };

    const sequence = sequences[sequenceName];
    if (!sequence || stepIndex >= sequence.length) {
        return null;
    }

    return sequence[stepIndex];
}

/**
 * Calculate the next send time based on the step's day delay
 */
function calculateNextSendTime(startedAt: admin.firestore.Timestamp, dayDelay: number): admin.firestore.Timestamp {
    const startDate = startedAt.toDate();
    const nextDate = new Date(startDate.getTime() + dayDelay * 24 * 60 * 60 * 1000);
    return admin.firestore.Timestamp.fromDate(nextDate);
}

/**
 * Scheduled function that runs every hour to process drip sequences
 */
export const processDripSequences = functions.pubsub
    .schedule('every 1 hours')
    .onRun(async (context) => {
        const now = admin.firestore.Timestamp.now();

        console.log('Processing drip sequences...');

        // Find all subscribers with pending sequence emails
        const subscribersSnapshot = await db.collection('subscribers').get();

        let emailsSent = 0;
        let errors = 0;

        for (const doc of subscribersSnapshot.docs) {
            const subscriber = doc.data();
            const sequences = subscriber.sequences || {};

            for (const [sequenceName, sequenceData] of Object.entries(sequences)) {
                const seq = sequenceData as any;

                // Skip completed sequences
                if (seq.completed) continue;

                // Check if it's time to send
                if (seq.nextSendAt && seq.nextSendAt.toMillis() <= now.toMillis()) {
                    const step = getSequenceStep(sequenceName, seq.currentStep);

                    if (!step) {
                        // No more steps, mark as completed
                        await doc.ref.update({
                            [`sequences.${sequenceName}.completed`]: true,
                        });
                        continue;
                    }

                    // Send the email
                    try {
                        const result = await sendEmail({
                            to: subscriber.email,
                            subject: step.subject,
                            html: step.getHtml(subscriber.name || 'there'),
                        });

                        // Log the email
                        await db.collection('email_logs').add({
                            to: subscriber.email,
                            type: `sequence_${sequenceName}_step_${seq.currentStep}`,
                            status: result.success ? 'sent' : 'failed',
                            resendId: result.id || null,
                            error: result.error || null,
                            sentAt: now,
                        });

                        if (result.success) {
                            emailsSent++;

                            // Move to next step
                            const nextStep = getSequenceStep(sequenceName, seq.currentStep + 1);

                            if (nextStep) {
                                const nextSendAt = calculateNextSendTime(seq.startedAt, nextStep.day);
                                await doc.ref.update({
                                    [`sequences.${sequenceName}.currentStep`]: seq.currentStep + 1,
                                    [`sequences.${sequenceName}.nextSendAt`]: nextSendAt,
                                });
                            } else {
                                // Sequence complete
                                await doc.ref.update({
                                    [`sequences.${sequenceName}.completed`]: true,
                                });
                            }
                        } else {
                            errors++;
                        }
                    } catch (err) {
                        console.error(`Error sending sequence email to ${subscriber.email}:`, err);
                        errors++;
                    }
                }
            }
        }

        console.log(`Drip sequence processing complete. Sent: ${emailsSent}, Errors: ${errors}`);
        return null;
    });

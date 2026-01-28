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

// Post-Booking Sequence - for leads who booked a call
const POST_BOOKING_SEQUENCE: SequenceStep[] = [
    {
        day: 0,
        subject: 'Your Strategy Call is Confirmed! 🎉',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">You're All Set, ${name}!</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    I'm excited to connect with you! Your strategy call has been confirmed.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    <strong>What to expect:</strong>
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li>30-minute focused conversation</li>
                    <li>Analysis of your current marketing/automation gaps</li>
                    <li>Custom recommendations for your business</li>
                    <li>No pressure, just value</li>
                </ul>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    You'll receive a calendar invite shortly with the meeting link.
                </p>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    See you soon!<br>
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 1,
        subject: 'Quick Prep for Our Call Tomorrow 📋',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Hey ${name},</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Looking forward to our call! To make the most of our time, here are a few things to think about:
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li>📊 What's your #1 marketing challenge right now?</li>
                    <li>🎯 What would success look like in 90 days?</li>
                    <li>💡 Are there specific automations you've been curious about?</li>
                </ul>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    No need to prepare anything formal - just have these in mind and we'll have a great conversation.
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
        subject: 'Missed Our Call? Let\'s Reschedule 🗓️',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Hey ${name},</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    I noticed we weren't able to connect. No worries - things happen!
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    If you're still interested in exploring how automation can help your business, 
                    I'd love to reschedule.
                </p>
                <a href="https://merkadagency.com/book" 
                   style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; 
                          border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                    Pick a New Time
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
];

// Re-Engagement Sequence - for leads who went cold
const REENGAGEMENT_SEQUENCE: SequenceStep[] = [
    {
        day: 0,
        subject: 'Still Thinking About It? 🤔',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Hey ${name},</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    I noticed you haven't booked a call yet, and I completely understand - 
                    you're probably busy running your business!
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    But I wanted to reach out because the businesses that get the best results 
                    are the ones that take action <em>before</em> they're overwhelmed.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Is there anything specific holding you back? Reply and let me know - 
                    I'm happy to answer any questions.
                </p>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 3,
        subject: 'New Case Study: 47% Revenue Increase 📈',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Fresh Results, ${name}</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    I just published a new case study that I thought you might find interesting.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    <strong>The highlight:</strong> A local service business went from struggling 
                    with follow-ups to seeing a 47% revenue increase in just 90 days.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    The key? Automated lead nurturing that works 24/7, even when they're sleeping.
                </p>
                <a href="https://merkadagency.com/case-studies" 
                   style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; 
                          border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                    Read the Case Study
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 7,
        subject: 'Last Call: Ready When You Are',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">${name}, One Last Thing</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    This will be my last email for now - I don't want to fill up your inbox!
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    But I wanted you to know: whenever you're ready to explore automation 
                    for your business, I'm here.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Just reply to this email or book a call whenever the timing is right:
                </p>
                <a href="https://merkadagency.com/book" 
                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); 
                          color: white; padding: 16px 32px; border-radius: 8px; 
                          text-decoration: none; font-weight: 600; margin-top: 16px;">
                    Book a Strategy Call
                </a>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Wishing you success,<br>
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
];

// New Client Onboarding Sequence
const ONBOARDING_SEQUENCE: SequenceStep[] = [
    {
        day: 0,
        subject: 'Welcome to the MerkadAgency Family! 🎊',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Welcome Aboard, ${name}!</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    I'm thrilled to officially welcome you as a MerkadAgency client! 
                    This is the beginning of an exciting journey.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    <strong>Here's what happens next:</strong>
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li>📅 You'll receive a kickoff meeting invite within 24 hours</li>
                    <li>📋 We'll send over our onboarding questionnaire</li>
                    <li>🔐 You'll get access to our client portal</li>
                </ul>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    If you have any questions in the meantime, just reply to this email.
                </p>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Excited to work together!<br>
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 3,
        subject: 'Setting Expectations for Success 📊',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Hey ${name},</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Now that we've kicked things off, I wanted to share what you can expect 
                    over the coming weeks:
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li><strong>Week 1-2:</strong> Discovery & strategy finalization</li>
                    <li><strong>Week 3-4:</strong> Build & initial implementation</li>
                    <li><strong>Week 5-6:</strong> Testing & optimization</li>
                    <li><strong>Week 7+:</strong> Launch & ongoing optimization</li>
                </ul>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    We'll keep you updated every step of the way. You'll never have to wonder 
                    where things stand.
                </p>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Camilo @ MerkadAgency
                </p>
            </div>
        `,
    },
    {
        day: 7,
        subject: 'Quick Check-In ✅',
        getHtml: (name: string) => `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #7c3aed;">Hey ${name},</h1>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Just wanted to check in after your first week as a client!
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    A few quick questions:
                </p>
                <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                    <li>Are you getting all the communication you need from our team?</li>
                    <li>Is there anything unclear about the process?</li>
                    <li>Any questions or concerns I can address?</li>
                </ul>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Your success is our success, so never hesitate to reach out.
                </p>
                <p style="color: #888; font-size: 14px; margin-top: 32px;">
                    Here for you,<br>
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
        'post-booking': POST_BOOKING_SEQUENCE,
        reengagement: REENGAGEMENT_SEQUENCE,
        onboarding: ONBOARDING_SEQUENCE,
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

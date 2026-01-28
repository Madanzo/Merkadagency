import { Resend } from 'resend';
import * as functions from 'firebase-functions';

// Lazy initialize Resend to avoid module-level build errors
let resendClient: Resend | null = null;

function getResendClient() {
    if (!resendClient) {
        const apiKey = functions.config().resend?.key || process.env.RESEND_API_KEY || 'missing-key';
        resendClient = new Resend(apiKey);
    }
    return resendClient;
}

// Default sender configuration
const DEFAULT_FROM = 'Camilo @ MerkadAgency <camilo.reyna@merkadagency.com>';

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string;
    from?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const resend = getResendClient();
        const { data, error } = await resend.emails.send({
            from: options.from || DEFAULT_FROM,
            to: Array.isArray(options.to) ? options.to : [options.to],
            subject: options.subject,
            html: options.html,
            reply_to: options.replyTo,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('Email sent successfully:', data?.id);
        return { success: true, id: data?.id };
    } catch (err) {
        console.error('Email send error:', err);
        return { success: false, error: String(err) };
    }
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<{ success: boolean; id?: string; error?: string }> {
    const subject = 'Welcome to MerkadAgency! 🚀';
    const html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Welcome, ${name}!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for connecting with MerkadAgency. We're excited to help you grow your business with AI-powered automation.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Here's what you can expect from us:
            </p>
            <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                <li>Insights on how to automate your lead generation</li>
                <li>Tips for increasing conversions with AI</li>
                <li>Exclusive case studies from businesses like yours</li>
            </ul>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Ready to see what we can do for you?
            </p>
            <a href="https://merkadagency.com/book" 
               style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); 
                      color: white; padding: 14px 28px; border-radius: 8px; 
                      text-decoration: none; font-weight: 600; margin-top: 16px;">
                Book a Free Strategy Call
            </a>
            <p style="color: #888; font-size: 14px; margin-top: 32px;">
                Best,<br>
                Camilo @ MerkadAgency
            </p>
        </div>
    `;

    return sendEmail({ to, subject, html });
}

/**
 * Send a booking confirmation email
 */
export async function sendBookingConfirmation(to: string, name: string, date: string): Promise<{ success: boolean; id?: string; error?: string }> {
    const subject = 'Your Call with MerkadAgency is Confirmed! 📅';
    const html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">You're All Set, ${name}!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Your strategy call has been confirmed for:
            </p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #7c3aed; font-size: 20px; font-weight: 600; margin: 0;">
                    ${date}
                </p>
            </div>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Here's how to prepare for our call:
            </p>
            <ol style="color: #333; font-size: 16px; line-height: 1.8;">
                <li>Think about your current lead generation challenges</li>
                <li>Have your website URL ready</li>
                <li>Prepare any questions about automation</li>
            </ol>
            <p style="color: #888; font-size: 14px; margin-top: 32px;">
                See you soon!<br>
                Camilo @ MerkadAgency
            </p>
        </div>
    `;

    return sendEmail({ to, subject, html });
}

/**
 * Send a contact form thank you email
 */
export async function sendContactThankYou(to: string, name: string): Promise<{ success: boolean; id?: string; error?: string }> {
    const subject = 'Thanks for Reaching Out! 👋';
    const html = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Hi ${name}!</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for contacting MerkadAgency. We've received your message and will get back to you within 24 hours.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                In the meantime, here are some resources you might find helpful:
            </p>
            <ul style="color: #333; font-size: 16px; line-height: 1.8;">
                <li><a href="https://merkadagency.com/case-studies" style="color: #7c3aed;">View Our Case Studies</a></li>
                <li><a href="https://merkadagency.com/resources/free-audit" style="color: #7c3aed;">Get a Free Website Audit</a></li>
                <li><a href="https://merkadagency.com/book" style="color: #7c3aed;">Book a Strategy Call</a></li>
            </ul>
            <p style="color: #888; font-size: 14px; margin-top: 32px;">
                Talk soon!<br>
                Camilo @ MerkadAgency
            </p>
        </div>
    `;

    return sendEmail({ to, subject, html });
}

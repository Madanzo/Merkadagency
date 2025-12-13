import { NextResponse } from 'next/server';
import { db, COLLECTIONS, FormType, LeadStatus } from '@/lib/firebase';
import type { FormTypeType } from '@/lib/firebase';

export interface FormSubmission {
    name?: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string;
    service?: string;
    budget?: string;
    message?: string;
    goals?: string;
    formType: string;
    timestamp: string;
    // UTM tracking
    source?: string;
    medium?: string;
    campaign?: string;
}

/**
 * Sends email notification for form submissions
 */
async function sendEmailNotification(submission: FormSubmission): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'info@merkadagency.com';

    // If no API key, log to console (development mode)
    if (!apiKey) {
        console.log('📧 Form Submission (email not configured):', submission);
        return true;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'MerkadAgency Forms <forms@merkadagency.com>',
                to: notificationEmail,
                subject: `New ${submission.formType} submission from ${submission.name || submission.email}`,
                html: generateEmailHTML(submission),
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
}

function generateEmailHTML(submission: FormSubmission): string {
    const fields = Object.entries(submission)
        .filter(([key, value]) => value && key !== 'formType' && key !== 'timestamp')
        .map(([key, value]) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600; color: #5A27FF; text-transform: capitalize;">${key}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">${value}</td>
            </tr>
        `)
        .join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>New Form Submission</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #5A27FF 0%, #8B5CF6 100%); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 24px;">New ${submission.formType.charAt(0).toUpperCase() + submission.formType.slice(1)} Submission</h1>
                </div>
                <div style="padding: 30px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        ${fields}
                    </table>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                        Submitted at: ${submission.timestamp}
                    </div>
                    <div style="margin-top: 16px;">
                        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/leads" style="background: #5A27FF; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                            View in Admin Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

/**
 * Saves lead to Firestore
 */
async function saveLeadToFirestore(submission: FormSubmission) {
    const formTypeMap: Record<string, FormTypeType> = {
        contact: FormType.CONTACT,
        newsletter: FormType.NEWSLETTER,
        booking: FormType.BOOKING,
        audit: FormType.AUDIT,
    };

    const leadData = {
        email: submission.email,
        name: submission.name || null,
        phone: submission.phone || null,
        company: submission.company || null,
        website: submission.website || null,
        formType: formTypeMap[submission.formType] || FormType.CONTACT,
        service: submission.service || null,
        budget: submission.budget || null,
        message: submission.message || null,
        goals: submission.goals || null,
        source: submission.source || null,
        medium: submission.medium || null,
        campaign: submission.campaign || null,
        status: LeadStatus.NEW,
        score: 0,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const docRef = await db.collection(COLLECTIONS.LEADS).add(leadData);
    return { id: docRef.id, ...leadData };
}

export function createFormHandler(formType: string) {
    return async function POST(request: Request) {
        try {
            const data = await request.json();

            // Basic validation
            if (!data.email) {
                return NextResponse.json(
                    { error: 'Email is required' },
                    { status: 400 }
                );
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return NextResponse.json(
                    { error: 'Please enter a valid email address' },
                    { status: 400 }
                );
            }

            const submission: FormSubmission = {
                ...data,
                formType,
                timestamp: new Date().toISOString(),
            };

            // Save to Firestore
            let lead;
            try {
                lead = await saveLeadToFirestore(submission);
                console.log(`✅ Lead saved to Firestore: ${lead.id}`);
            } catch (dbError) {
                console.error('Firestore error:', dbError);
                // Continue to send email even if DB fails
            }

            // Send email notification
            const emailSent = await sendEmailNotification(submission);

            if (!emailSent && process.env.RESEND_API_KEY) {
                console.warn('Email notification failed, but lead was saved');
            }

            return NextResponse.json({
                success: true,
                message: `${formType} form submitted successfully`,
                leadId: lead?.id,
            });
        } catch (error) {
            console.error(`${formType} form error:`, error);
            return NextResponse.json(
                { error: 'An error occurred. Please try again.' },
                { status: 500 }
            );
        }
    };
}

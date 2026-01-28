import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Eye, ChevronDown, ChevronUp, Mail, Clock, Users } from 'lucide-react';

interface SequenceStep {
    day: number;
    subject: string;
    description: string;
    htmlPreview: string;
}

interface Sequence {
    name: string;
    description: string;
    trigger: string;
    steps: SequenceStep[];
}

// This mirrors the sequences defined in functions/src/email/sequences.ts
const SEQUENCES: Sequence[] = [
    {
        name: 'Welcome Sequence',
        description: 'Nurture new subscribers with a 4-email sequence over 14 days',
        trigger: 'Newsletter signup or Contact form submission',
        steps: [
            {
                day: 0,
                subject: 'Welcome to MerkadAgency! 🚀',
                description: 'Welcome email introducing MerkadAgency and hinting at upcoming value',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #7c3aed;">Welcome, {name}!</h1>
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
                description: 'Case study email showing real results',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #7c3aed;">Real Results, {name}</h1>
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
                description: 'Pain point identification with soft CTA to book a call',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #7c3aed;">Hey {name},</h1>
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
                description: 'Final email with strong CTA for strategy session',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #7c3aed;">{name}, One More Thing...</h1>
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
        ],
    },
    {
        name: 'Post-Booking Sequence',
        description: 'Follow up with leads who booked a strategy call',
        trigger: 'Lead books a call via Cal.com',
        steps: [
            {
                day: 0,
                subject: 'Your Strategy Call is Confirmed! 🎉',
                description: 'Confirmation email with what to expect',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">You're All Set, {name}!</h1>
                        <p style="font-size: 16px; line-height: 1.6;">I'm excited to connect with you! Your strategy call has been confirmed.</p>
                        <p style="font-size: 16px; line-height: 1.6;"><strong>What to expect:</strong></p>
                        <ul style="font-size: 16px; line-height: 1.8;">
                            <li>30-minute focused conversation</li>
                            <li>Analysis of your current marketing/automation gaps</li>
                            <li>Custom recommendations for your business</li>
                            <li>No pressure, just value</li>
                        </ul>
                    </div>
                `,
            },
            {
                day: 1,
                subject: 'Quick Prep for Our Call Tomorrow 📋',
                description: 'Prep tips to maximize the call value',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">Hey {name},</h1>
                        <p style="font-size: 16px; line-height: 1.6;">Looking forward to our call! To make the most of our time, here are a few things to think about:</p>
                        <ul style="font-size: 16px; line-height: 1.8;">
                            <li>📊 What's your #1 marketing challenge right now?</li>
                            <li>🎯 What would success look like in 90 days?</li>
                            <li>💡 Are there specific automations you've been curious about?</li>
                        </ul>
                    </div>
                `,
            },
            {
                day: 3,
                subject: "Missed Our Call? Let's Reschedule 🗓️",
                description: 'Reschedule reminder for no-shows',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">Hey {name},</h1>
                        <p style="font-size: 16px; line-height: 1.6;">I noticed we weren't able to connect. No worries - things happen!</p>
                        <p style="font-size: 16px; line-height: 1.6;">If you're still interested in exploring how automation can help your business, I'd love to reschedule.</p>
                        <a href="https://merkadagency.com/book" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Pick a New Time</a>
                    </div>
                `,
            },
        ],
    },
    {
        name: 'Re-Engagement Sequence',
        description: 'Win back cold leads who never booked',
        trigger: 'Manual trigger for leads who went cold',
        steps: [
            {
                day: 0,
                subject: 'Still Thinking About It? 🤔',
                description: 'Check in with cold leads',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">Hey {name},</h1>
                        <p style="font-size: 16px; line-height: 1.6;">I noticed you haven't booked a call yet, and I completely understand - you're probably busy running your business!</p>
                        <p style="font-size: 16px; line-height: 1.6;">But I wanted to reach out because the businesses that get the best results are the ones that take action <em>before</em> they're overwhelmed.</p>
                    </div>
                `,
            },
            {
                day: 3,
                subject: 'New Case Study: 47% Revenue Increase 📈',
                description: 'Share fresh social proof',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">Fresh Results, {name}</h1>
                        <p style="font-size: 16px; line-height: 1.6;">I just published a new case study that I thought you might find interesting.</p>
                        <p style="font-size: 16px; line-height: 1.6;"><strong>The highlight:</strong> A local service business went from struggling with follow-ups to seeing a 47% revenue increase in just 90 days.</p>
                        <a href="https://merkadagency.com/case-studies" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Read the Case Study</a>
                    </div>
                `,
            },
            {
                day: 7,
                subject: 'Last Call: Ready When You Are',
                description: 'Final touch - no pressure',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">{name}, One Last Thing</h1>
                        <p style="font-size: 16px; line-height: 1.6;">This will be my last email for now - I don't want to fill up your inbox!</p>
                        <p style="font-size: 16px; line-height: 1.6;">But I wanted you to know: whenever you're ready to explore automation for your business, I'm here.</p>
                        <a href="https://merkadagency.com/book" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Book a Strategy Call</a>
                    </div>
                `,
            },
        ],
    },
    {
        name: 'Client Onboarding Sequence',
        description: 'Welcome and onboard new paying clients',
        trigger: 'Manual trigger when client signs contract',
        steps: [
            {
                day: 0,
                subject: 'Welcome to the MerkadAgency Family! 🎊',
                description: 'Official welcome and next steps',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">Welcome Aboard, {name}!</h1>
                        <p style="font-size: 16px; line-height: 1.6;">I'm thrilled to officially welcome you as a MerkadAgency client!</p>
                        <p style="font-size: 16px; line-height: 1.6;"><strong>Here's what happens next:</strong></p>
                        <ul style="font-size: 16px; line-height: 1.8;">
                            <li>📅 You'll receive a kickoff meeting invite within 24 hours</li>
                            <li>📋 We'll send over our onboarding questionnaire</li>
                            <li>🔐 You'll get access to our client portal</li>
                        </ul>
                    </div>
                `,
            },
            {
                day: 3,
                subject: 'Setting Expectations for Success 📊',
                description: 'Timeline and process overview',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">Hey {name},</h1>
                        <p style="font-size: 16px; line-height: 1.6;">Now that we've kicked things off, I wanted to share what you can expect over the coming weeks:</p>
                        <ul style="font-size: 16px; line-height: 1.8;">
                            <li><strong>Week 1-2:</strong> Discovery & strategy finalization</li>
                            <li><strong>Week 3-4:</strong> Build & initial implementation</li>
                            <li><strong>Week 5-6:</strong> Testing & optimization</li>
                            <li><strong>Week 7+:</strong> Launch & ongoing optimization</li>
                        </ul>
                    </div>
                `,
            },
            {
                day: 7,
                subject: 'Quick Check-In ✅',
                description: 'First week check-in',
                htmlPreview: `
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #7c3aed;">Hey {name},</h1>
                        <p style="font-size: 16px; line-height: 1.6;">Just wanted to check in after your first week as a client!</p>
                        <p style="font-size: 16px; line-height: 1.6;">A few quick questions:</p>
                        <ul style="font-size: 16px; line-height: 1.8;">
                            <li>Are you getting all the communication you need from our team?</li>
                            <li>Is there anything unclear about the process?</li>
                            <li>Any questions or concerns I can address?</li>
                        </ul>
                        <p style="font-size: 16px; line-height: 1.6; margin-top: 16px;">Your success is our success, so never hesitate to reach out.</p>
                    </div>
                `,
            },
        ],
    },
];

export function EmailSequencesTab() {
    const [expandedSequence, setExpandedSequence] = useState<string | null>('Welcome Sequence');
    const [previewStep, setPreviewStep] = useState<SequenceStep | null>(null);

    return (
        <Card className="bg-merkad-bg-secondary border-merkad-border">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Workflow className="w-5 h-5" />
                    Email Sequences (Drip Campaigns)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-merkad-text-muted text-sm">
                    These are automated email sequences that run when triggered. The emails are sent automatically based on the schedule below.
                </p>

                {SEQUENCES.map((sequence) => (
                    <div key={sequence.name} className="border border-merkad-border rounded-lg overflow-hidden">
                        {/* Sequence Header */}
                        <button
                            className="w-full p-4 bg-merkad-bg-tertiary flex items-center justify-between hover:bg-purple-900/20 transition-colors"
                            onClick={() => setExpandedSequence(
                                expandedSequence === sequence.name ? null : sequence.name
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-white font-medium">{sequence.name}</h3>
                                    <p className="text-sm text-merkad-text-muted">{sequence.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm text-purple-400">{sequence.steps.length} emails</p>
                                    <p className="text-xs text-merkad-text-muted">{sequence.steps[sequence.steps.length - 1].day} days</p>
                                </div>
                                {expandedSequence === sequence.name ? (
                                    <ChevronUp className="w-5 h-5 text-merkad-text-muted" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-merkad-text-muted" />
                                )}
                            </div>
                        </button>

                        {/* Expanded Sequence Steps */}
                        {expandedSequence === sequence.name && (
                            <div className="p-4 space-y-3">
                                {/* Trigger Info */}
                                <div className="flex items-center gap-2 p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                                    <Users className="w-4 h-4 text-green-400" />
                                    <span className="text-sm text-green-400">
                                        <strong>Trigger:</strong> {sequence.trigger}
                                    </span>
                                </div>

                                {/* Steps Timeline */}
                                <div className="relative pl-8 space-y-4 mt-4">
                                    {/* Vertical Line */}
                                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-purple-600/30" />

                                    {sequence.steps.map((step, index) => (
                                        <div key={index} className="relative">
                                            {/* Timeline Dot */}
                                            <div className="absolute -left-5 w-4 h-4 bg-purple-600 rounded-full border-2 border-merkad-bg-secondary" />

                                            {/* Step Card */}
                                            <div className="bg-merkad-bg-primary/50 rounded-lg p-4 border border-merkad-border">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                Day {step.day}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-white font-medium">{step.subject}</h4>
                                                        <p className="text-sm text-merkad-text-muted mt-1">{step.description}</p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setPreviewStep(step)}
                                                        className="shrink-0"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Preview
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Preview Modal */}
                {previewStep && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
                            <div className="p-4 border-b flex items-center justify-between bg-purple-600">
                                <div>
                                    <p className="text-sm text-purple-200">Day {previewStep.day} Email:</p>
                                    <p className="font-medium text-white">{previewStep.subject}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setPreviewStep(null)}
                                    className="bg-white text-purple-600 hover:bg-purple-100 border-white"
                                >
                                    Close
                                </Button>
                            </div>
                            <div
                                className="p-6"
                                dangerouslySetInnerHTML={{ __html: previewStep.htmlPreview }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

import { LeadMagnetTemplate } from '@/components/templates/LeadMagnetTemplate';

export default function MedspaChecklist() {
    return (
        <LeadMagnetTemplate
            industry="MedSpas"
            title="The Ultimate MedSpa Automation Checklist"
            subtitle="Stop losing 20-30% of your leads to missed calls and slow follow-up."
            description="Discover the exact automation stack used by top-performing MedSpas to fill their calendars on autopilot."
            resourceName="MedSpa Automation Checklist"
            image="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60" // Placeholder, user can replace
            seoTitle="Free MedSpa Automation Checklist | MerkadAgency"
            seoDescription="Download the free checklist to automate your MedSpa's patient booking and follow-up. Increase show rates and revenue."
            benefits={[
                "The 3 critical touchpoints you must automate immediately.",
                "How to revive dead leads without hiring more staff.",
                "Script templates for SMS booking confirmations.",
                "Tool recommendations for 2025 (CRM, Booking, AI).",
                "A step-by-step roadmap to your first 50 automated bookings."
            ]}
            downloadUrl="/resources/medspa-automation-checklist.html"
        />
    );
}

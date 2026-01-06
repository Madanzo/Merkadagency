import { LeadMagnetTemplate } from '@/components/templates/LeadMagnetTemplate';

export default function ContractorGuide() {
    return (
        <LeadMagnetTemplate
            industry="Contractors"
            title="Contractor Lead Gen & Qualification Guide"
            subtitle="Stop chasing tire-kickers. Start closing high-value projects."
            description="Learn how to attract better leads and automatically filter out the ones who aren't serious."
            resourceName="Contractor Lead Gen Guide"
            image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=60"
            seoTitle="Contractor Lead Gen Guide | MerkadAgency"
            seoDescription="Download the free guide to generating and qualifying high-value construction leads. Save time on estimates."
            benefits={[
                "The 'Velvet Rope' method for filtering low-budget leads.",
                "How to automate your estimate follow-up process.",
                "Google Local Services Ads: The hidden goldmine.",
                "5 red flags to spot in a prospect before you drive to the site.",
                "Templates for 'price conditioning' emails."
            ]}
            downloadUrl="/resources/contractor-lead-gen-guide.html"
        />
    );
}

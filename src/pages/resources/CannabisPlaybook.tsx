import { LeadMagnetTemplate } from '@/components/templates/LeadMagnetTemplate';

export default function CannabisPlaybook() {
    return (
        <LeadMagnetTemplate
            industry="Cannabis Dispensaries"
            title="The 2026 Cannabis Marketing Playbook"
            subtitle="Grow your dispensary or delivery service without getting banned on social media."
            description="A comprehensive guide to compliant, high-ROI marketing strategies tailored for the cannabis industry."
            resourceName="Cannabis Marketing Playbook"
            image="https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800&auto=format&fit=crop&q=60"
            seoTitle="Free Cannabis Marketing Playbook 2026 | MerkadAgency"
            seoDescription="Download the ultimate guide to compliant cannabis marketing. SMS, SEO, and retention strategies for dispensaries."
            benefits={[
                "Navigating ad restrictions on Meta and Google.",
                "How to build an SMS list that prints money on demand.",
                "SEO strategies to dominate 'dispensary near me' searches.",
                "Loyalty program structures that actually retain customers.",
                "Case study: How one dispensary added $45k/mo in new revenue."
            ]}
            downloadUrl="/resources/cannabis-marketing-playbook.html"
        />
    );
}

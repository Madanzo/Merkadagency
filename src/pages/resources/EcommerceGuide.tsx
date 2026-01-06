import { LeadMagnetTemplate } from '@/components/templates/LeadMagnetTemplate';

export default function EcommerceGuide() {
    return (
        <LeadMagnetTemplate
            industry="E-Commerce"
            title="The E-Commerce Automation Blueprint"
            subtitle="Stop leaving money on the table with abandoned carts and one-time buyers."
            description="The complete playbook for automating your e-commerce store's marketing and turning browsers into loyal customers."
            resourceName="E-Commerce Automation Blueprint"
            image="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Grid%20n%20Guard%2FGridnGuard%20Website.png?alt=media&token=e50c438d-1d9b-4d4e-9c30-afc4e7322f83"
            seoTitle="Free E-Commerce Automation Blueprint | MerkadAgency"
            seoDescription="Download the free guide to automating abandoned cart recovery, post-purchase flows, and retention marketing for your online store."
            benefits={[
                "The abandoned cart sequence that recovers 25%+ of lost sales.",
                "Post-purchase email flows that turn buyers into repeat customers.",
                "How to segment customers for personalized marketing.",
                "ROAS optimization strategies for Meta & Google ads.",
                "VIP program structures that boost LTV by 40%."
            ]}
            downloadUrl="/resources/ecommerce-automation-blueprint.html"
        />
    );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI-Powered Growth Services | MerkadAgency',
    description: 'Explore our comprehensive AI marketing services: Lead Capture, Website Development, CRM Automation, SEO, and Content Systems. Transform your business with intelligent automation.',
    keywords: 'AI marketing services, lead capture, website development, CRM automation, SEO automation, content systems, digital marketing',
    openGraph: {
        title: 'AI-Powered Growth Services | MerkadAgency',
        description: 'Transform your business with intelligent automation. AI Lead Capture, Website Development, CRM Automation, and more.',
        type: 'website',
    },
};

export default function ServiceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Book a Strategy Call | MerkadAgency',
    description: 'Schedule a free strategy call with MerkadAgency. Get a comprehensive audit of your marketing systems and a custom AI automation strategy tailored to your business.',
    keywords: 'strategy call, marketing consultation, AI marketing, business growth, free audit',
    openGraph: {
        title: 'Book Your Free Strategy Call | MerkadAgency',
        description: 'Get a free comprehensive audit and custom AI automation strategy for your business.',
        type: 'website',
    },
};

export default function BookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

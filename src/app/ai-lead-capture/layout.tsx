import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Lead Capture & Qualification | MerkadAgency',
    description: 'Never miss another lead with AI automation. Capture, qualify, and convert leads 24/7 with intelligent automation powered by Make.com, Lindy AI, and Voiceflow.',
    keywords: 'AI lead capture, lead qualification, lead automation, Make.com, Voiceflow, Lindy AI, 24/7 lead response',
    openGraph: {
        title: 'AI Lead Capture & Qualification | MerkadAgency',
        description: 'Capture, qualify, and convert leads 24/7 with intelligent automation. No human intervention needed.',
        type: 'website',
    },
};

export default function AILeadCaptureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

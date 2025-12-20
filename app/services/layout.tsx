import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CRM Automation | MerkadAgency",
    description:
        "Conversion systems that turn traffic into booked conversations. AI automation, follow-up systems, and clean funnels for regulated industries.",
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

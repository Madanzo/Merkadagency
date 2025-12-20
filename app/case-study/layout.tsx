import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Case Study: Cannabis Dispensary | MerkadAgency",
    description: "System log: How we automated lead capture for a multi-location cannabis dispensary.",
};

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

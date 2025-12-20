import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageViewTracker from "@/components/PageViewTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
    title: "MerkadAgency | AI-Powered Marketing for Regulated Industries",
    description:
        "We build lead machines for cannabis, roofing, med spas, and e-commerce brands. AI automation and conversion systems that turn traffic into appointments.",
    keywords: [
        "marketing agency",
        "AI marketing",
        "cannabis marketing",
        "med spa marketing",
        "roofing marketing",
        "e-commerce marketing",
        "lead generation",
    ],
    openGraph: {
        title: "MerkadAgency | AI-Powered Marketing",
        description:
            "AI automation and conversion systems that turn traffic into appointments.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body style={{ paddingTop: "4.5rem" }}>
                <GoogleAnalytics />
                <PageViewTracker />
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}

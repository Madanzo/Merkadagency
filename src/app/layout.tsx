import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI-Powered Growth Systems | MerkadAgency",
  description: "Transform your traffic into booked revenue with intelligent automation. AI Lead Capture, Website Development, CRM Automation, AI SEO, and Content Systems.",
  keywords: "AI marketing, lead capture, website development, CRM automation, SEO automation, digital marketing agency",
  openGraph: {
    title: "MerkadAgency: AI Marketing - Drive Revenue",
    description: "Boost your auto business with AI-driven solutions.",
    type: "website",
    locale: "en_US",
    siteName: "MerkadAgency",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

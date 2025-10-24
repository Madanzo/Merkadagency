import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { FooterMinimal } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MerkadAgency | AI-Powered Video Production & Digital Solutions',
  description: 'Create professional product videos in seconds. AI-powered video production, web development, CRM automation, and content systems that respect your brand.',
  keywords: ['AI video production', 'digital marketing', 'web development', 'CRM automation', 'content systems'],
  authors: [{ name: 'MerkadAgency' }],
  openGraph: {
    title: 'MerkadAgency | AI-Powered Video Production',
    description: 'AI video production that respects your brand',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <FooterMinimal />
        <Toaster />
      </body>
    </html>
  );
}

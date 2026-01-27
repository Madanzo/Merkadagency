import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageBackground } from './PageBackground';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <Header />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
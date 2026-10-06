import { useLocation } from 'react-router-dom';
import { journeyEvent, type JourneySurface } from '@/lib/journeyEvents';
import { ReactNode, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import './public-site.css';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  const { pathname } = useLocation();
  const surface: JourneySurface = pathname === '/' ? 'home' : pathname.startsWith('/services') ? 'offer' : /^\/(case-studies|portfolio|results)(\/|$)/.test(pathname) ? 'proof' : pathname === '/contact' ? 'contact' : pathname === '/resources/free-audit' ? 'audit' : 'other';
  useEffect(() => {
    if (surface === 'offer') journeyEvent('offer_view', surface);
    if (surface === 'proof') journeyEvent('proof_view', surface);
  }, [pathname, surface]);
  return (
    <div onClick={event => { const anchor = (event.target as HTMLElement).closest('a'); if (['/contact', '/book', '/resources/free-audit'].includes(anchor?.getAttribute('href') || '')) journeyEvent('cta_click', surface); }} className={`public-site relative min-h-screen ${className}`}>
      <a className="public-skip" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1} className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
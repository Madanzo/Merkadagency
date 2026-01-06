import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Services',
    href: '/services',
    children: [
      { name: 'AI Lead Capture', href: '/services/ai-lead-capture' },
      { name: 'CRM Automation', href: '/services/crm-automation' },
      { name: 'SEO & Content', href: '/services/seo-content' },
      { name: 'Paid Advertising', href: '/services/paid-advertising' },
    ],
  },
  {
    name: 'Industries',
    href: '/industries',
    children: [
      { name: 'Medical Spas', href: '/industries/medspas' },
      { name: 'Cannabis', href: '/industries/cannabis' },
      { name: 'Construction', href: '/industries/construction' },
    ],
  },
  {
    name: 'Results',
    href: '/results',
    children: [
      { name: 'Portfolio', href: '/results' },
      { name: 'Case Studies', href: '/case-studies' },
    ],
  },
  { name: 'About', href: '/about' },
  { name: 'Our Method', href: '/about/method' },
  { name: 'Blog', href: '/blog' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-merkad-bg-primary/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Elegant_Merkadagency_logo%201.png?alt=media&token=eccf7036-fa7a-4694-a97a-9f81a7fb624e"
              alt="MerkadAgency"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'text-white'
                      : 'text-merkad-text-secondary hover:text-white'
                  )}
                >
                  {item.name}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {item.children && openDropdown === item.name && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-merkad-bg-elevated border border-white/10 rounded-xl shadow-2xl py-2 min-w-[200px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-merkad-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/resources/free-audit"
              className="text-sm font-medium text-merkad-text-secondary hover:text-white transition-colors"
            >
              Free Audit
            </Link>
            <Link
              to="/book"
              className="px-6 py-2.5 bg-gradient-purple text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-merkad-bg-primary/95 backdrop-blur-xl border-b border-white/5">
            <div className="container-custom py-6 space-y-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'block py-2 text-base font-medium transition-colors',
                      location.pathname === item.href
                        ? 'text-white'
                        : 'text-merkad-text-secondary hover:text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block py-1.5 text-sm text-merkad-text-muted hover:text-white transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/resources/free-audit"
                  className="text-center py-3 border border-white/20 rounded-lg text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Free Audit
                </Link>
                <Link
                  to="/book"
                  className="text-center py-3 bg-gradient-purple rounded-lg text-white font-semibold"
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Studio', href: '/studio' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Docs', href: '/docs' },
];

/**
 * Navbar - Sticky navigation bar with blur effect
 * Responsive with mobile menu
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-ink/80 backdrop-blur-md border-b border-violet/20 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-purple-400 shadow-glow">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold text-white">MerkadAgency</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  pathname === item.href
                    ? 'text-white'
                    : 'text-graycool hover:text-white'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-graycool hover:text-white"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-tr from-violet to-purple-400 text-white shadow-glow hover:shadow-glow-soft hover:-translate-y-0.5 transition-all duration-200"
              asChild
            >
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-white hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-violet/20 bg-ink/95 backdrop-blur-md md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-violet/20 text-white'
                      : 'text-graycool hover:bg-white/5 hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full text-graycool hover:text-white"
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  className="w-full bg-gradient-to-tr from-violet to-purple-400 text-white shadow-glow"
                  asChild
                >
                  <Link href="/book">Book a Call</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

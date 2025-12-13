'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="ma-header">
            <div className="ma-header-inner">
                {/* Logo */}
                <Link href="/" className="ma-logo">
                    <Image
                        src="/images/merkadagency-logo.png"
                        alt="MerkadAgency"
                        width={160}
                        height={40}
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="ma-nav-desktop">
                    <Link href="/">Home</Link>

                    <div className="ma-dropdown">
                        <Link href="/service/">Services ▼</Link>
                        <div className="ma-dropdown-menu">
                            <Link href="/service/#ai-lead-capture">AI Lead Capture</Link>
                            <Link href="/service/#website-development">Website Development</Link>
                            <Link href="/service/#crm-automation">CRM Automation</Link>
                            <Link href="/service/#ai-seo">AI SEO</Link>
                            <Link href="/service/#content-systems">Content Systems</Link>
                        </div>
                    </div>

                    <div className="ma-dropdown">
                        <Link href="/portfolio-web/">Portfolio ▼</Link>
                        <div className="ma-dropdown-menu">
                            <Link href="/portfolio-web/">Website Projects</Link>
                            <Link href="/content-social-media/">Video & Content</Link>
                        </div>
                    </div>

                    <Link href="/seo-audit/">Free Audit</Link>
                    <Link href="/innovation-log/">Innovation Log</Link>
                    <Link href="/book/" className="ma-cta">Book a Call</Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="ma-mobile-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Navigation */}
            <nav className={`ma-nav-mobile ${mobileMenuOpen ? 'active' : ''}`}>
                <Link href="/" onClick={closeMobileMenu}>Home</Link>
                <Link href="/service/" onClick={closeMobileMenu}>Services</Link>
                <Link href="/service/#ai-lead-capture" className="ma-dropdown-item" onClick={closeMobileMenu}>AI Lead Capture</Link>
                <Link href="/service/#website-development" className="ma-dropdown-item" onClick={closeMobileMenu}>Website Development</Link>
                <Link href="/service/#crm-automation" className="ma-dropdown-item" onClick={closeMobileMenu}>CRM Automation</Link>
                <Link href="/service/#ai-seo" className="ma-dropdown-item" onClick={closeMobileMenu}>AI SEO</Link>
                <Link href="/service/#content-systems" className="ma-dropdown-item" onClick={closeMobileMenu}>Content Systems</Link>
                <Link href="/portfolio-web/" onClick={closeMobileMenu}>Portfolio</Link>
                <Link href="/portfolio-web/" className="ma-dropdown-item" onClick={closeMobileMenu}>Website Projects</Link>
                <Link href="/content-social-media/" className="ma-dropdown-item" onClick={closeMobileMenu}>Video & Content</Link>
                <Link href="/seo-audit/" onClick={closeMobileMenu}>Free Audit</Link>
                <Link href="/innovation-log/" onClick={closeMobileMenu}>Innovation Log</Link>
                <Link href="/book/" className="ma-cta-mobile" onClick={closeMobileMenu}>Book a Call</Link>
            </nav>
        </header>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from './ContactForm';

// Social Icons
const FacebookIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const TwitterIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
);

// Contact Icons
const EmailIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const LocationIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="ma-footer">
            {/* Background Pattern */}
            <div className="ma-footer-bg"></div>

            {/* Main Footer Content */}
            <div className="ma-footer-main">
                <div className="ma-footer-container">
                    {/* Newsletter Section */}
                    <div className="ma-footer-newsletter">
                        <h3 className="ma-newsletter-title">Stay Ahead with Innovation</h3>
                        <p className="ma-newsletter-text">Get the latest AI marketing insights and growth strategies delivered to your inbox</p>

                        {/* Native Newsletter Form */}
                        <div className="ma-newsletter-form-container">
                            <ContactForm
                                formType="newsletter"
                                compact={true}
                                submitText="Subscribe"
                                successMessage="You're subscribed! Welcome to the innovation community."
                            />
                        </div>
                    </div>

                    {/* Footer Grid */}
                    <div className="ma-footer-grid">
                        {/* Company Info */}
                        <div className="ma-footer-company">
                            <div>
                                <Link href="/" className="ma-footer-logo">
                                    <Image
                                        src="/images/merkadagency-logo.png"
                                        alt="MerkadAgency"
                                        width={180}
                                        height={45}
                                    />
                                </Link>
                                <p className="ma-footer-description">
                                    AI-powered marketing solutions that transform businesses. We combine cutting-edge technology with creative strategy to deliver measurable growth.
                                </p>
                            </div>
                            <div className="ma-footer-social">
                                <a href="https://facebook.com/merkadagency" className="ma-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                    <FacebookIcon />
                                </a>
                                <a href="https://instagram.com/merkadagency" className="ma-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                                    <InstagramIcon />
                                </a>
                                <a href="https://linkedin.com/company/merkadagency" className="ma-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                                    <LinkedInIcon />
                                </a>
                                <a href="https://twitter.com/merkadagency" className="ma-social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                                    <TwitterIcon />
                                </a>
                            </div>
                        </div>

                        {/* Services Column */}
                        <div className="ma-footer-column">
                            <h4>Services</h4>
                            <ul className="ma-footer-links">
                                <li><Link href="/service/#ai-lead-capture">AI Lead Capture</Link></li>
                                <li><Link href="/service/#website-development">Website Development</Link></li>
                                <li><Link href="/service/#crm-automation">CRM Automation</Link></li>
                                <li><Link href="/service/#ai-seo">AI SEO</Link></li>
                                <li><Link href="/service/#content-systems">Content Systems</Link></li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div className="ma-footer-column">
                            <h4>Resources</h4>
                            <ul className="ma-footer-links">
                                <li><Link href="/portfolio-web/">Portfolio</Link></li>
                                <li><Link href="/innovation-log/">Innovation Log</Link></li>
                                <li><Link href="/seo-audit/">Free SEO Audit</Link></li>
                                <li><Link href="/book/">Book a Call</Link></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="ma-footer-column">
                            <h4>Contact</h4>
                            <div className="ma-footer-contact">
                                <div className="ma-contact-item">
                                    <span className="ma-contact-icon"><EmailIcon /></span>
                                    <a href="mailto:info@merkadagency.com">info@merkadagency.com</a>
                                </div>
                                <div className="ma-contact-item">
                                    <span className="ma-contact-icon"><PhoneIcon /></span>
                                    <a href="tel:+15124343793">+1 (512) 434-3793</a>
                                </div>
                                <div className="ma-contact-item">
                                    <span className="ma-contact-icon"><LocationIcon /></span>
                                    <span>Austin, Texas<br />United States</span>
                                </div>
                                <div className="ma-contact-item">
                                    <span className="ma-contact-icon"><ClockIcon /></span>
                                    <span>Mon-Fri: 9AM-6PM CST</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="ma-footer-bottom">
                <div className="ma-footer-container">
                    <div className="ma-footer-bottom-content">
                        <p className="ma-copyright">© 2025 MerkadAgency. All rights reserved.</p>
                        <ul className="ma-footer-legal">
                            <li><Link href="/privacy-policy/">Privacy Policy</Link></li>
                            <li><Link href="/terms-conditions/">Terms & Conditions</Link></li>
                            <li><Link href="/cookies-policy/">Cookies</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

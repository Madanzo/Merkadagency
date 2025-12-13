'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function CRMAutomationPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [animatedElements, setAnimatedElements] = useState<HTMLElement[]>([]);

    const openModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage('');
        document.body.style.overflow = '';
    };

    // Scroll animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.opacity = '1';
                    (entry.target as HTMLElement).style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll<HTMLElement>('.template-card, .sms-card, .workflow-item, .feature-card');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Counter animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const element = entry.target as HTMLElement;
                    const originalText = element.innerText;
                    const target = parseFloat(originalText.replace(/[^0-9.]/g, ''));
                    const isDecimal = originalText.includes('.');
                    const isPercentage = originalText.includes('%');
                    const hasX = originalText.includes('x');

                    if (isNaN(target)) return;

                    let current = 0;
                    const increment = target / 40;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            if (isDecimal || hasX) {
                                element.innerText = current.toFixed(1) + (hasX ? 'x' : '');
                            } else {
                                element.innerText = Math.floor(current) + (isPercentage ? '%' : '');
                            }
                            requestAnimationFrame(updateCounter);
                        } else {
                            element.innerText = originalText;
                        }
                    };
                    updateCounter();
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number, .metric-value').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const templates = [
        {
            type: "Welcome Series",
            title: "Welcome Email Template",
            desc: "High-converting welcome email with 65% open rate and personalized onboarding flow",
            image: "https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a785a548220c6728409cbe.png"
        },
        {
            type: "Promotional",
            title: "Sales Campaign Email",
            desc: "Dynamic promotional template with product showcases and CTR of 8.5%",
            image: "https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a796dd01ecc9e390fbdbaa.png"
        },
        {
            type: "Newsletter",
            title: "Monthly Newsletter",
            desc: "Engaging newsletter template with modular content blocks and 42% engagement rate",
            image: "https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a785a51602c19f212c7c0e.png"
        },
        {
            type: "Re-engagement",
            title: "Win-Back Campaign",
            desc: "Strategic re-engagement template recovering 35% of inactive subscribers",
            image: "https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a796dd5a99c111c5ad4fa4.png"
        }
    ];

    return (
        <>
            <div className="automation-wrapper">
                {/* Background Effects */}
                <div className="tech-grid"></div>
                <div className="floating-shapes">
                    <div className="shape"></div>
                    <div className="shape"></div>
                    <div className="shape"></div>
                </div>

                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <div className="hero-badge">Marketing Automation</div>
                        <h1 className="hero-title">CRM + Email/SMS Automation</h1>
                        <p className="hero-subtitle">
                            Transform your customer engagement with AI-powered automation that delivers the right message
                            at the perfect moment. See real examples of campaigns driving 3x higher conversion rates.
                        </p>

                        <div className="features-grid">
                            {[
                                { title: "Smart Email Campaigns", desc: "Personalized sequences that adapt to customer behavior" },
                                { title: "SMS Automation", desc: "98% open rates with targeted text messaging" },
                                { title: "Workflow Builder", desc: "Visual automation designer for complex journeys" },
                                { title: "Real-Time Analytics", desc: "Track performance and optimize on the fly" }
                            ].map((feature, i) => (
                                <div key={i} className="feature-card">
                                    <div className="feature-icon"></div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-desc">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Email Templates Section */}
                <section className="email-section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-badge">Email Marketing</span>
                            <h2 className="section-title">Professional Email Templates</h2>
                            <p className="section-subtitle">
                                Beautifully designed, mobile-responsive email templates that convert subscribers into customers
                            </p>
                        </div>

                        <div className="templates-grid">
                            {templates.map((template, i) => (
                                <div key={i} className="template-card" onClick={() => openModal(template.image)}>
                                    <div className="template-image">
                                        <img src={template.image} alt={template.title} />
                                        <div className="template-overlay">
                                            <span className="view-label">Click to View Full Size</span>
                                        </div>
                                    </div>
                                    <div className="template-info">
                                        <span className="template-type">{template.type}</span>
                                        <h3 className="template-title">{template.title}</h3>
                                        <p className="template-desc">{template.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SMS Templates Section - Kept consistent */}
                <section className="sms-section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-badge">SMS Marketing</span>
                            <h2 className="section-title">High-Impact SMS Campaigns</h2>
                            <p className="section-subtitle">
                                Instant delivery, 98% open rates, and direct customer engagement through strategic text messaging
                            </p>
                        </div>
                        {/* Static SMS content kept as is for brevity, focusing on React stability */}
                        <div className="sms-grid">
                            <div className="sms-card">
                                <div className="sms-preview">
                                    <img src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d1a5d4fefaa916974b9e94.jpeg" alt="SMS Welcome Campaign" />
                                </div>
                                <span className="sms-label">Welcome SMS</span>
                                <h3 className="sms-title">Instant Welcome Message</h3>
                                <p className="template-desc">Automated welcome SMS sent within 30 seconds of signup with exclusive offer code</p>
                                <div className="sms-metrics">
                                    <div className="metric"><span className="metric-value">98%</span><span className="metric-label">Open Rate</span></div>
                                    <div className="metric"><span className="metric-value">12%</span><span className="metric-label">CTR</span></div>
                                    <div className="metric"><span className="metric-value">3.2x</span><span className="metric-label">ROI</span></div>
                                </div>
                            </div>
                            <div className="sms-card">
                                <div className="sms-preview">
                                    <img src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d1a5d483739ae704791bc8.jpeg" alt="SMS Flash Sale" />
                                </div>
                                <span className="sms-label">Flash Sale</span>
                                <h3 className="sms-title">Limited-Time Offers</h3>
                                <p className="template-desc">Time-sensitive promotions with countdown timers driving immediate action</p>
                                <div className="sms-metrics">
                                    <div className="metric"><span className="metric-value">95%</span><span className="metric-label">Open Rate</span></div>
                                    <div className="metric"><span className="metric-value">18%</span><span className="metric-label">CTR</span></div>
                                    <div className="metric"><span className="metric-value">5.1x</span><span className="metric-label">ROI</span></div>
                                </div>
                            </div>
                            <div className="sms-card">
                                <div className="sms-preview">
                                    <img src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d1a5d4448d7b523aa12180.jpeg" alt="SMS Order Confirmation" />
                                </div>
                                <span className="sms-label">Transactional</span>
                                <h3 className="sms-title">Order Confirmations</h3>
                                <p className="template-desc">Instant order updates and shipping notifications keeping customers informed</p>
                                <div className="sms-metrics">
                                    <div className="metric"><span className="metric-value">99%</span><span className="metric-label">Open Rate</span></div>
                                    <div className="metric"><span className="metric-value">8%</span><span className="metric-label">CTR</span></div>
                                    <div className="metric"><span className="metric-value">4.3</span><span className="metric-label">Rating</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow Section - Kept consistent */}
                <section className="workflow-section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-badge">Automation Workflows</span>
                            <h2 className="section-title">Intelligent Marketing Automation</h2>
                            <p className="section-subtitle">Visual workflow builders that create sophisticated customer journeys without coding</p>
                        </div>
                        <div className="workflow-container">
                            <div className="workflow-item">
                                <div className="workflow-header">
                                    <div className="workflow-info">
                                        <span className="workflow-badge">SMS Automation</span>
                                        <h3 className="workflow-title">Multi-Touch SMS Journey</h3>
                                        <p className="workflow-desc">Automated SMS sequence triggered by customer behavior, delivering personalized messages at optimal times. This workflow includes welcome messages, abandoned cart reminders, and post-purchase follow-ups.</p>
                                    </div>
                                    <div className="workflow-stats">
                                        <div className="workflow-stat"><span className="stat-number">7</span><span className="stat-text">Touch Points</span></div>
                                        <div className="workflow-stat"><span className="stat-number">45%</span><span className="stat-text">Conv. Rate</span></div>
                                        <div className="workflow-stat"><span className="stat-number">2.8x</span><span className="stat-text">Revenue</span></div>
                                    </div>
                                </div>
                                <div className="workflow-image">
                                    <img src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a7996101ecc95274fc5046.png" alt="SMS Workflow Automation" />
                                </div>
                            </div>

                            <div className="workflow-item">
                                <div className="workflow-header">
                                    <div className="workflow-info">
                                        <span className="workflow-badge">Email Automation</span>
                                        <h3 className="workflow-title">Advanced Email Nurture Flow</h3>
                                        <p className="workflow-desc">Sophisticated email automation that segments users based on engagement, interests, and purchase history. Features dynamic content, A/B testing, and intelligent send-time optimization for maximum impact.</p>
                                    </div>
                                    <div className="workflow-stats">
                                        <div className="workflow-stat"><span className="stat-number">12</span><span className="stat-text">Email Steps</span></div>
                                        <div className="workflow-stat"><span className="stat-number">65%</span><span className="stat-text">Open Rate</span></div>
                                        <div className="workflow-stat"><span className="stat-number">3.5x</span><span className="stat-text">CTR Boost</span></div>
                                    </div>
                                </div>
                                <div className="workflow-image">
                                    <img src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a798c55f326cf6c9e791cc.png" alt="Email Workflow Automation" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="container">
                        <div className="cta-box">
                            <div className="cta-content">
                                <h2 className="cta-title">Ready to Automate Your Marketing?</h2>
                                <p className="cta-subtitle">Let&#39;s build intelligent campaigns that work 24/7 to grow your business</p>
                                <a href="/book" className="btn-cta">Start Your Automation Journey <span>→</span></a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* React Modal */}
            {modalOpen && (
                <div className="modal active" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-close" onClick={closeModal}></div>
                        <img className="modal-image" src={selectedImage} alt="Template Preview" />
                    </div>
                    <div className="modal-close-hint">Tap anywhere to close</div>
                </div>
            )}
        </>
    );
}

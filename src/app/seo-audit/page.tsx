'use client';

import { useEffect } from 'react';
import { ContactForm } from '@/components/ContactForm';

export default function SEOAuditPage() {
    useEffect(() => {
        // Lightbox functionality
        const initLightbox = () => {
            const sampleImages = document.querySelectorAll('.sample-image');

            sampleImages.forEach(image => {
                image.addEventListener('click', (e) => {
                    const target = e.currentTarget as HTMLElement;
                    const imageUrl = target.dataset.image;
                    if (imageUrl) {
                        const modal = document.createElement('div');
                        modal.className = 'image-modal';
                        modal.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(15, 18, 32, 0.95);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              cursor: pointer;
              padding: 20px;
            `;

                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.style.cssText = `
              max-width: 90%;
              max-height: 90vh;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            `;

                        modal.appendChild(img);
                        document.body.appendChild(modal);
                        document.body.style.overflow = 'hidden';

                        modal.addEventListener('click', () => {
                            modal.remove();
                            document.body.style.overflow = '';
                        });

                        const handleEsc = (e: KeyboardEvent) => {
                            if (e.key === 'Escape') {
                                modal.remove();
                                document.body.style.overflow = '';
                                document.removeEventListener('keydown', handleEsc);
                            }
                        };
                        document.addEventListener('keydown', handleEsc);
                    }
                });
            });
        };

        // Smooth scroll
        const initSmoothScroll = () => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const anchorEl = e.currentTarget as HTMLAnchorElement;
                    const href = anchorEl.getAttribute('href');
                    const target = href ? document.querySelector(href) : null;
                    if (target) {
                        const offset = 100;
                        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        };

        // Scroll animations
        const initScrollAnimations = () => {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        (entry.target as HTMLElement).style.opacity = '1';
                        (entry.target as HTMLElement).style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            const elementsToAnimate = [
                '.metric-card',
                '.sample-item',
                '.audit-step',
                '.value-prop'
            ];

            elementsToAnimate.forEach(selector => {
                document.querySelectorAll(selector).forEach((el, index) => {
                    const element = el as HTMLElement;
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'all 0.6s ease';
                    element.style.transitionDelay = `${index * 0.1}s`;
                    observer.observe(element);
                });
            });
        };

        initLightbox();
        initSmoothScroll();
        initScrollAnimations();
    }, []);

    return (
        <div className="seo-wrapper">
            {/* Background Effects */}
            <div className="tech-grid"></div>
            <div className="pulse-circles">
                <div className="pulse"></div>
                <div className="pulse"></div>
                <div className="pulse"></div>
            </div>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-badge">Free SEO Audit</div>
                    <h1 className="hero-title">Get Your AI-Powered SEO Audit</h1>
                    <p className="hero-subtitle">
                        Discover exactly what&apos;s holding your website back from ranking #1. Our comprehensive
                        audit analyzes 200+ ranking factors and delivers actionable insights in minutes.
                    </p>

                    <div className="value-props">
                        <div className="value-prop">
                            <div className="prop-icon">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span>200+ Ranking Factors</span>
                        </div>
                        <div className="value-prop">
                            <div className="prop-icon">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span>Competitor Analysis</span>
                        </div>
                        <div className="value-prop">
                            <div className="prop-icon">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span>Technical SEO Check</span>
                        </div>
                        <div className="value-prop">
                            <div className="prop-icon">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span>Content Opportunities</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Audit Form Section */}
            <section className="audit-form-section" id="audit-form-section">
                <div className="container">
                    <div className="form-container">
                        <div className="form-header">
                            <h2 className="form-title">Request Your Free Audit</h2>
                            <p className="form-description">
                                Enter your details below and we&apos;ll analyze your site within 24 hours
                            </p>
                        </div>

                        <div className="audit-form-wrapper">
                            <ContactForm
                                formType="audit"
                                submitText="Get My Free Audit"
                                successMessage="Your audit request has been received! Expect your comprehensive SEO report within 24 hours."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Showcase */}
            <section className="metrics-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">What We Analyze</span>
                        <h2 className="section-title">Comprehensive SEO Analysis</h2>
                        <p className="section-subtitle">
                            Our AI-powered audit examines every aspect of your site&apos;s SEO performance
                        </p>
                    </div>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="metric-value">200+</div>
                            <div className="metric-label">Ranking Factors</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="metric-value">&lt;24h</div>
                            <div className="metric-label">Delivery Time</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 20V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 20V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 20V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="metric-value">15+</div>
                            <div className="metric-label">Report Pages</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="metric-value">100%</div>
                            <div className="metric-label">Actionable</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Audit Samples Section */}
            <section className="samples-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Sample Reports</span>
                        <h2 className="section-title">See What You&apos;ll Receive</h2>
                        <p className="section-subtitle">
                            Detailed insights and actionable recommendations for every aspect of your SEO
                        </p>
                    </div>

                    <div className="samples-grid">

                        {/* Sample 1 */}
                        <div className="sample-item">
                            <div className="sample-image" data-image="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a7945dd9ba6551a894b9cc.png">
                                <div className="image-overlay">
                                    <span style={{ color: '#FBCBD5' }}>Click to enlarge</span>
                                </div>
                                <img
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a7945dd9ba6551a894b9cc.png"
                                    alt="Technical SEO Audit Sample"
                                    loading="lazy"
                                />
                            </div>
                            <div className="sample-content">
                                <span className="sample-tag">Technical Analysis</span>
                                <h3 className="sample-title">Technical SEO Health Check</h3>
                                <p className="sample-description">
                                    Our technical audit identifies critical issues affecting your site&apos;s crawlability,
                                    indexation, and overall search engine visibility. We analyze site speed, mobile
                                    responsiveness, and technical infrastructure.
                                </p>
                                <ul className="sample-features">
                                    <li><span className="feature-check"></span><span>Page speed optimization analysis</span></li>
                                    <li><span className="feature-check"></span><span>Mobile usability assessment</span></li>
                                    <li><span className="feature-check"></span><span>Crawl error identification</span></li>
                                    <li><span className="feature-check"></span><span>XML sitemap validation</span></li>
                                    <li><span className="feature-check"></span><span>Schema markup recommendations</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sample 2 */}
                        <div className="sample-item">
                            <div className="sample-image" data-image="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a7945d1602c111222ff2a4.png">
                                <div className="image-overlay">
                                    <span style={{ color: '#FBCBD5' }}>Click to enlarge</span>
                                </div>
                                <img
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a7945d1602c111222ff2a4.png"
                                    alt="Content Strategy Audit Sample"
                                    loading="lazy"
                                />
                            </div>
                            <div className="sample-content">
                                <span className="sample-tag">Content Analysis</span>
                                <h3 className="sample-title">Content Gap & Opportunity Report</h3>
                                <p className="sample-description">
                                    Discover high-value keywords your competitors rank for but you don&apos;t. Our content
                                    analysis identifies gaps in your content strategy and provides a roadmap for
                                    capturing untapped organic traffic.
                                </p>
                                <ul className="sample-features">
                                    <li><span className="feature-check"></span><span>Keyword gap analysis</span></li>
                                    <li><span className="feature-check"></span><span>Content quality scoring</span></li>
                                    <li><span className="feature-check"></span><span>Topic cluster recommendations</span></li>
                                    <li><span className="feature-check"></span><span>Search intent optimization</span></li>
                                    <li><span className="feature-check"></span><span>Content refresh priorities</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sample 3 */}
                        <div className="sample-item">
                            <div className="sample-image" data-image="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d55e06f2acc72936fc23c0.png">
                                <div className="image-overlay">
                                    <span style={{ color: '#FBCBD5' }}>Click to enlarge</span>
                                </div>
                                <img
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d55e06f2acc72936fc23c0.png"
                                    alt="Competitor Analysis Sample"
                                    loading="lazy"
                                />
                            </div>
                            <div className="sample-content">
                                <span className="sample-tag">Competitive Intelligence</span>
                                <h3 className="sample-title">Competitor Backlink Analysis</h3>
                                <p className="sample-description">
                                    Understand your competitive landscape with our detailed backlink analysis. We identify
                                    link-building opportunities, analyze competitor strategies, and provide actionable
                                    tactics to outrank your competition.
                                </p>
                                <ul className="sample-features">
                                    <li><span className="feature-check"></span><span>Backlink profile comparison</span></li>
                                    <li><span className="feature-check"></span><span>Link quality assessment</span></li>
                                    <li><span className="feature-check"></span><span>Link gap opportunities</span></li>
                                    <li><span className="feature-check"></span><span>Anchor text distribution</span></li>
                                    <li><span className="feature-check"></span><span>Outreach target lists</span></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Our Process</span>
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            From audit request to actionable insights in 4 simple steps
                        </p>
                    </div>

                    <div className="process-timeline">
                        <div className="audit-step">
                            <div className="audit-step-number">1</div>
                            <div className="audit-step-content">
                                <h3 className="audit-step-title">Submit Your Website</h3>
                                <p className="audit-step-description">
                                    Fill out the form with your website URL and contact details
                                </p>
                            </div>
                        </div>

                        <div className="audit-step">
                            <div className="audit-step-number">2</div>
                            <div className="audit-step-content">
                                <h3 className="audit-step-title">AI Analysis Begins</h3>
                                <p className="audit-step-description">
                                    Our AI crawls your site and analyzes 200+ ranking factors
                                </p>
                            </div>
                        </div>

                        <div className="audit-step">
                            <div className="audit-step-number">3</div>
                            <div className="audit-step-content">
                                <h3 className="audit-step-title">Report Generation</h3>
                                <p className="audit-step-description">
                                    Comprehensive audit report created with actionable recommendations
                                </p>
                            </div>
                        </div>

                        <div className="audit-step">
                            <div className="audit-step-number">4</div>
                            <div className="audit-step-content">
                                <h3 className="audit-step-title">Strategy Call</h3>
                                <p className="audit-step-description">
                                    Review findings and discuss implementation strategy with our team
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <div className="cta-content">
                            <h2 className="cta-title">Ready to Dominate Search Results?</h2>
                            <p className="cta-subtitle">
                                Get your free SEO audit and discover how to 3x your organic traffic
                            </p>
                            <div className="cta-buttons">
                                <a href="#audit-form-section" className="btn-cta">
                                    Get Free Audit Now
                                </a>
                                <a href="/book" className="btn-outline-white">
                                    Book Strategy Call
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

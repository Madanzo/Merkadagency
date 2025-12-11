'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function KravingsCaseStudyPage() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Scroll reveal animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observerRef.current?.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <div className="case-study-wrapper">
            {/* Background Effects */}
            <div className="tech-grid"></div>

            {/* Hero Section */}
            <section className="case-hero">
                <div className="container">
                    <div className="case-hero-content">
                        <div className="case-hero-text">
                            <div className="client-badge">
                                <span>🌿</span>
                                <span>Cannabis Delivery Service</span>
                            </div>
                            <h1>How Kravings Achieved 196% Revenue Growth Despite Minimal Marketing Budget</h1>
                            <p className="case-subtitle">
                                From $2,358 to $6,988 monthly revenue with only 5-10% marketing spend through compliant AI automation in the cannabis delivery space.
                            </p>

                            <div className="hero-metrics">
                                <div className="hero-metric">
                                    <div className="hero-metric-value">196%</div>
                                    <div className="hero-metric-label">Revenue Growth</div>
                                </div>
                                <div className="hero-metric">
                                    <div className="hero-metric-value">5-10%</div>
                                    <div className="hero-metric-label">Marketing Spend</div>
                                </div>
                                <div className="hero-metric">
                                    <div className="hero-metric-value">100%</div>
                                    <div className="hero-metric-label">SEO Score</div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-visual">
                            <div className="hero-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a782a11602c113be2c0b34.png"
                                    alt="Kravings Landing Page"
                                    width={600}
                                    height={400}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenge Section */}
            <section className="challenge-section">
                <div className="container">
                    <div className="section-header">
                        <h2>The Challenge</h2>
                        <p>Cannabis marketing restrictions were limiting Kravings&apos; growth potential</p>
                    </div>

                    <div className="challenge-grid">
                        <div className="challenge-card fade-in">
                            <h3 className="challenge-title">Minimal Marketing Budget</h3>
                            <p className="challenge-desc">Limited to only 5-10% of gross margin for marketing spend, requiring maximum ROI from every dollar invested.</p>
                        </div>

                        <div className="challenge-card fade-in">
                            <h3 className="challenge-title">Poor Online Visibility</h3>
                            <p className="challenge-desc">Starting at only $2,358/month revenue with minimal organic traffic and low search rankings.</p>
                        </div>

                        <div className="challenge-card fade-in">
                            <h3 className="challenge-title">Compliance Complexity</h3>
                            <p className="challenge-desc">Navigating strict cannabis marketing regulations while trying to build brand awareness and customer trust.</p>
                        </div>

                        <div className="challenge-card fade-in">
                            <h3 className="challenge-title">Limited Marketing Channels</h3>
                            <p className="challenge-desc">Restricted from traditional advertising platforms, struggling to reach target customers effectively.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="solution-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Solution</h2>
                        <p>AI-powered systems that work 24/7 to drive growth</p>
                    </div>

                    <div className="solution-grid">
                        <div className="solution-card fade-in">
                            <div className="solution-icon">🚀</div>
                            <h3 className="solution-title">Compliant Website & SEO</h3>
                            <p className="solution-desc">Built a conversion-focused, fully compliant website with local SEO optimization achieving position 18.6 rankings.</p>
                            <div className="solution-stat">Top 20 Rankings</div>
                        </div>

                        <div className="solution-card fade-in">
                            <div className="solution-icon">✍️</div>
                            <h3 className="solution-title">Educational Content Engine</h3>
                            <p className="solution-desc">Automated creation of educational blogs, strain guides, and wellness content that builds trust while staying compliant.</p>
                            <div className="solution-stat">71 Blogs Created</div>
                        </div>

                        <div className="solution-card fade-in">
                            <div className="solution-icon">📧</div>
                            <h3 className="solution-title">Customer Retention System</h3>
                            <p className="solution-desc">Smart email & SMS campaigns for order updates, loyalty programs, and personalized product recommendations.</p>
                            <div className="solution-stat">85% Retention Rate</div>
                        </div>

                        <div className="solution-card fade-in">
                            <div className="solution-icon">⭐</div>
                            <h3 className="solution-title">Reputation Management</h3>
                            <p className="solution-desc">Automated review collection and response system, building trust in a heavily regulated industry.</p>
                            <div className="solution-stat">4.9 Star Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="results-section">
                <div className="container">
                    <div className="section-header">
                        <h2>The Results</h2>
                        <p>Measurable impact across every metric that matters</p>
                    </div>

                    <div className="results-grid">
                        <div className="result-block fade-in">
                            <div className="result-header">
                                <h3 className="result-title">SEO Performance</h3>
                                <span className="result-badge">196% Growth on 5-10% Budget</span>
                            </div>

                            <div className="metrics-showcase">
                                <div className="metric-card">
                                    <div className="metric-value">100%</div>
                                    <div className="metric-label">SEO Score</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">71</div>
                                    <div className="metric-label">Blogs Published</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">18.6</div>
                                    <div className="metric-label">Best Ranking Position</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">35.1</div>
                                    <div className="metric-label">Avg Ranking Position</div>
                                </div>
                            </div>

                            <div className="result-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a7945dd9ba6551a894b9cc.png"
                                    alt="SEO Optimization Score"
                                    width={800}
                                    height={400}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </div>

                        <div className="result-block fade-in">
                            <div className="result-header">
                                <h3 className="result-title">Traffic Growth</h3>
                                <span className="result-badge">Exponential Increase</span>
                            </div>

                            <div className="result-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a7945de2fbdd0cfd4fd9a5.png"
                                    alt="Traffic Growth Chart"
                                    width={800}
                                    height={400}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </div>

                        <div className="result-block fade-in">
                            <div className="result-header">
                                <h3 className="result-title">Marketing Automation</h3>
                                <span className="result-badge">24/7 Engagement</span>
                            </div>

                            <div className="metrics-showcase">
                                <div className="metric-card">
                                    <div className="metric-value">85%</div>
                                    <div className="metric-label">Email Open Rate</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">42%</div>
                                    <div className="metric-label">Click Rate</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">24/7</div>
                                    <div className="metric-label">Auto Response</div>
                                </div>
                            </div>

                            <div className="result-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a798c55f326cf6c9e791cc.png"
                                    alt="Email Automation Workflow"
                                    width={800}
                                    height={400}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Revenue Timeline Section */}
            <section className="revenue-timeline">
                <div className="container">
                    <div className="section-header">
                        <h2>Revenue Growth Timeline</h2>
                        <p>From $2,358 to $6,988 with minimal marketing investment</p>
                    </div>

                    <div className="timeline-container">
                        <div className="timeline-line"></div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <div className="timeline-month">Before MerkadAgency</div>
                                <div className="timeline-revenue">$2,358/mo</div>
                                <p className="challenge-desc">Struggling with platform restrictions, minimal budget</p>
                            </div>
                            <div className="timeline-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a795e101ecc96a8cfbc0aa.png"
                                    alt="Revenue Before"
                                    width={400}
                                    height={250}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                            <div className="timeline-dot"></div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <div className="timeline-month">Month 1 - Installation</div>
                                <div className="timeline-revenue">$5,676</div>
                                <span className="timeline-growth">+141% Growth</span>
                                <p className="timeline-note">Immediate impact from SEO optimization</p>
                            </div>
                            <div className="timeline-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a795e1465199008bfe7202.png"
                                    alt="Month 1 Revenue"
                                    width={400}
                                    height={250}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                            <div className="timeline-dot"></div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <div className="timeline-month">Month 2 - Optimization</div>
                                <div className="timeline-revenue">$6,533</div>
                                <span className="timeline-growth">+177% Growth</span>
                                <p className="timeline-note">Content engine & automation kicking in</p>
                            </div>
                            <div className="timeline-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a795e15727bdfdf3a7924c.png"
                                    alt="Month 2 Revenue"
                                    width={400}
                                    height={250}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                            <div className="timeline-dot"></div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-content">
                                <div className="timeline-month">Month 3 - Scale</div>
                                <div className="timeline-revenue">$6,988</div>
                                <span className="timeline-growth">+196% Total Growth</span>
                                <p className="timeline-note">Sustainable growth with only 5-10% marketing spend</p>
                            </div>
                            <div className="timeline-image">
                                <Image
                                    src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a795e14651996749fe7203.png"
                                    alt="Month 3 Revenue"
                                    width={400}
                                    height={250}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                            <div className="timeline-dot"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="testimonial-section">
                <div className="container">
                    <div className="testimonial-box">
                        <div className="quote-icon">&ldquo;</div>
                        <p className="testimonial-text">
                            MerkadAgency understood our budget constraints and still delivered incredible results. With only 5-10% of our gross margin allocated to marketing, they achieved a 196% revenue increase. We went from $2,358/month to nearly $7,000/month in just 90 days. Their AI automation and SEO strategies work perfectly within cannabis regulations while maximizing every dollar spent. The ROI is unmatched.
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">K</div>
                            <div className="author-info">
                                <div className="author-name">Kravings Team</div>
                                <div className="author-title">kravings.club</div>
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
                            <h2 className="cta-title">Ready for 196% Growth on a Minimal Budget?</h2>
                            <p className="cta-subtitle">We&apos;ll maximize your ROI just like we did for Kravings</p>
                            <Link href="/book/" className="btn-white">
                                Book Your Strategy Call
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

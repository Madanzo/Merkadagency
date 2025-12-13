'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Service data
const services = [
    {
        id: 'ai-lead-capture',
        icon: '🤖',
        title: 'AI Lead Capture & Qualification',
        tagline: 'Convert visitors into booked calls 24/7',
        description: 'Deploy intelligent AI agents that engage visitors in real-time, qualify leads through natural conversation, and automatically book appointments with your sales team. Our AI agents learn from every interaction to continuously improve conversion rates.',
        features: [
            '24/7 AI chat agent deployment',
            'Lead qualification workflows',
            'Calendar integration & booking',
            'Multi-language support',
            'CRM synchronization',
            'Analytics & reporting'
        ],
        process: [
            { title: 'Discovery', desc: 'Analyze your sales process' },
            { title: 'Training', desc: 'Custom AI agent setup' },
            { title: 'Integration', desc: 'Connect to your systems' },
            { title: 'Optimization', desc: 'Continuous improvement' }
        ],
        metrics: [
            { value: '+38%', label: 'Avg. Conversion Lift' },
            { value: '2.5x', label: 'More Qualified Leads' },
            { value: '24/7', label: 'Response Time' }
        ],
        caseStudyLink: '/ai-lead-capture'
    },
    {
        id: 'website-development',
        icon: '💻',
        title: 'Website Development + CRM',
        tagline: 'High-converting websites with built-in automation',
        description: 'Professional website creation with integrated CRM functionalities, AI agents, and conversion optimization. We build fast, modern websites that not only look great but actively convert visitors into customers with smart automation.',
        features: [
            'Custom responsive design',
            'CRM integration',
            'AI agent implementation',
            'Payment processing',
            'Calendar booking system',
            'SEO optimization'
        ],
        process: [
            { title: 'Strategy', desc: 'Define goals & structure' },
            { title: 'Design', desc: 'Create visual mockups' },
            { title: 'Development', desc: 'Build & integrate systems' },
            { title: 'Launch', desc: 'Deploy & monitor' }
        ],
        metrics: [
            { value: '2-3', label: 'Week Delivery' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '<2s', label: 'Load Time' }
        ],
        caseStudyLink: '/portfolio-web/'
    },
    {
        id: 'crm-automation',
        icon: '📧',
        title: 'CRM + Email/SMS Automation',
        tagline: 'Nurture leads automatically until they convert',
        description: 'Implement sophisticated automation workflows that nurture leads through personalized email and SMS campaigns. Our systems work 24/7 to move prospects through your sales funnel without manual intervention.',
        features: [
            'Multi-channel campaigns',
            'Behavioral triggers',
            'A/B testing',
            'Lead scoring',
            'Review automation',
            'Pipeline management'
        ],
        process: [
            { title: 'Audit', desc: 'Review current systems' },
            { title: 'Map', desc: 'Design workflows' },
            { title: 'Build', desc: 'Create automations' },
            { title: 'Refine', desc: 'Test & optimize' }
        ],
        metrics: [
            { value: '67%', label: 'Open Rate Average' },
            { value: '5x', label: 'ROI Average' },
            { value: '-72%', label: 'Manual Work' }
        ],
        caseStudyLink: '/crm-automation'
    },
    {
        id: 'ai-seo',
        icon: '🔍',
        title: 'AI SEO Automation',
        tagline: 'Rank faster with intelligent content systems',
        description: 'Leverage AI to create, optimize, and interlink content at scale. Our supervised AI workflows produce SEO-optimized content that ranks, while building topical authority in your niche.',
        features: [
            'AI content generation',
            'Automated interlinking',
            'Local SEO management',
            'Backlink automation',
            'Schema markup',
            'Rank tracking'
        ],
        process: [
            { title: 'Research', desc: 'Keyword & competitor analysis' },
            { title: 'Strategy', desc: 'Content planning' },
            { title: 'Execute', desc: 'Publish & optimize' },
            { title: 'Scale', desc: 'Expand coverage' }
        ],
        metrics: [
            { value: '150+', label: 'Articles/Month' },
            { value: '3-6mo', label: 'To Page 1' },
            { value: '+240%', label: 'Organic Traffic' }
        ],
        caseStudyLink: '/seo-audit/'
    },
    {
        id: 'content-systems',
        icon: '🎬',
        title: 'Content Systems & Social Media',
        tagline: 'Compound awareness into bookings',
        description: 'Create and distribute content across all platforms with our systematic approach. From short-form videos to long-form content, we build systems that consistently generate engagement and drive conversions.',
        features: [
            'Short-form video creation',
            'Content repurposing',
            'Social media management',
            'Paid ads management',
            'Influencer outreach',
            'Performance analytics'
        ],
        process: [
            { title: 'Plan', desc: 'Content calendar' },
            { title: 'Create', desc: 'Produce content' },
            { title: 'Distribute', desc: 'Multi-platform posting' },
            { title: 'Analyze', desc: 'Measure & iterate' }
        ],
        metrics: [
            { value: '30+', label: 'Posts/Month' },
            { value: '10x', label: 'Engagement Rate' },
            { value: '$0.85', label: 'CPM Average' }
        ],
        caseStudyLink: '/content-social-media/'
    }
];

export default function ServicesPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentSlide < services.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            } else if (e.key === 'ArrowRight' && currentSlide < services.length - 1) {
                goToSlide(currentSlide + 1);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    // Dynamic lines effect
    useEffect(() => {
        const interval = setInterval(() => {
            const container = document.querySelector('.animated-lines');
            if (!container) return;

            const line = document.createElement('div');
            line.className = 'line';
            line.style.left = Math.random() * 100 + '%';
            line.style.animationDelay = Math.random() * 8 + 's';
            line.style.height = (50 + Math.random() * 150) + 'px';
            container.appendChild(line);

            setTimeout(() => line.remove(), 8000);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Tech Grid Background */}
            <div className="tech-grid"></div>

            {/* Animated Lines */}
            <div className="animated-lines">
                {[10, 30, 50, 70, 90].map((left, i) => (
                    <div
                        key={i}
                        className="line"
                        style={{ left: `${left}%`, animationDelay: `${i * 2}s` }}
                    />
                ))}
            </div>

            {/* Services Hero */}
            <section className="services-hero">
                <div className="container">
                    <h1>AI-Powered Growth Services</h1>
                    <p className="subtitle">Select a service category below to explore our comprehensive digital solutions</p>
                </div>
            </section>

            {/* Category Navigation */}
            <div className="category-navigation">
                <div className="container">
                    <div className="category-pills">
                        {services.map((service, index) => (
                            <button
                                key={service.id}
                                className={`category-pill ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            >
                                {service.title.split(' ')[0]} {service.title.split(' ')[1]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Carousel */}
            <section className="services-carousel-container">
                <div className="container">
                    <div
                        ref={carouselRef}
                        className="services-carousel"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {services.map((service, index) => (
                            <div key={service.id} className="service-slide" id={service.id}>
                                <div className="service-main-card">
                                    <span className="slide-number">{String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</span>

                                    <div className="service-header">
                                        <div className="service-icon-large">{service.icon}</div>
                                        <div className="service-info">
                                            <h2>{service.title}</h2>
                                            <p className="service-tagline">{service.tagline}</p>
                                            <p className="service-description">{service.description}</p>
                                        </div>
                                    </div>

                                    <div className="service-features">
                                        {service.features.map((feature, i) => (
                                            <div key={i} className="feature-item">
                                                <div className="feature-check"></div>
                                                <span className="feature-text">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="service-process">
                                        <h3 className="process-title">Implementation Process</h3>
                                        <div className="process-steps">
                                            {service.process.map((step, i) => (
                                                <div key={i} className="process-step">
                                                    <div className="step-number">{i + 1}</div>
                                                    <div className="step-title">{step.title}</div>
                                                    <div className="step-desc">{step.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="service-cta">
                                        <div className="service-metrics">
                                            {service.metrics.map((metric, i) => (
                                                <div key={i} className="metric">
                                                    <div className="metric-value">{metric.value}</div>
                                                    <div className="metric-label">{metric.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="service-buttons">
                                            <Link href="/book/" className="btn-primary">Get Started</Link>
                                            <Link href={service.caseStudyLink} className="btn-outline">
                                                {service.id === 'ai-lead-capture' ? 'View Service' :
                                                    service.id === 'website-development' ? 'View Portfolio' :
                                                        service.id === 'ai-seo' ? 'SEO Audit' :
                                                            service.id === 'content-systems' ? 'View Samples' :
                                                                service.id === 'crm-automation' ? 'See Examples' : 'View Case Study'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Dots */}
                    <div className="carousel-progress">
                        {services.map((_, index) => (
                            <button
                                key={index}
                                className={`progress-dot ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <div className="container">
                    <div className="cta-box">
                        <div className="cta-content">
                            <h2 className="cta-title">Ready to Transform Your Business?</h2>
                            <p className="cta-subtitle">Let&apos;s build AI-powered systems that work while you sleep</p>
                            <Link href="/book/" className="btn-white">
                                Book Your Strategy Call
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

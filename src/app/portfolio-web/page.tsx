'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Portfolio projects data
const projects = [
    {
        id: 'kravings-club',
        type: 'E-Commerce Platform',
        title: 'Kravings Club',
        description: 'A modern e-commerce platform for a premium food delivery service. We implemented AI-powered recommendation systems, seamless checkout flows, and an intuitive user interface that increased conversion rates by 45%.',
        image: 'https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a782a11602c113be2c0b34.png',
        features: [
            'AI-Powered Product Recommendations',
            'Mobile-First Responsive Design',
            'Integrated CRM & Email Automation',
            'Real-Time Inventory Management'
        ],
        techStack: ['React', 'Node.js', 'AI Integration', 'Stripe', 'GoHighLevel'],
        liveUrl: 'https://kravings.club/',
        caseStudyUrl: '/kravings-case-study/'
    },
    {
        id: 'microdosis-shopping',
        type: 'Wellness E-Commerce',
        title: 'Microdosis Shopping',
        description: 'A sophisticated wellness e-commerce platform featuring advanced product filtering, educational content integration, and AI-driven customer support. The platform achieved a 62% increase in average order value through strategic upselling.',
        image: 'https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d17bdd83739a3e136f28ff.png',
        features: [
            '24/7 AI Customer Support Chat',
            'Advanced Product Filtering System',
            'Educational Content Hub',
            'Automated Email Marketing Flows'
        ],
        techStack: ['WordPress', 'WooCommerce', 'AI Chatbot', 'SEO Optimization', 'Analytics'],
        liveUrl: 'https://microdosis.shopping/',
        caseStudyUrl: '/teonanactl/'
    },
    {
        id: 'merkadagency',
        type: 'Digital Agency',
        title: 'MerkadAgency',
        description: 'Our own digital agency website showcasing the perfect blend of cutting-edge technology and elegant design. Features AI-powered lead qualification, automated booking systems, and real-time analytics that converted 38% more visitors into clients.',
        image: 'https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68a782a15a99c14ac4a93d34.png',
        features: [
            'AI Lead Qualification System',
            'Automated Calendar Booking',
            'Dynamic Portfolio Showcase',
            'Performance Analytics Dashboard'
        ],
        techStack: ['Custom Development', 'AI Integration', 'GoHighLevel', 'Analytics', 'SEO'],
        liveUrl: 'https://merkadagency.com/',
        caseStudyUrl: '#'
    }
];

const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '3.2x', label: 'Average ROI' },
    { value: '24/7', label: 'AI Support' }
];

export default function PortfolioPage() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Scroll reveal animation
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.scroll-reveal').forEach((el) => {
            observerRef.current?.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    const handleImageClick = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="portfolio-wrapper">
            {/* Background Effects */}
            <div className="tech-grid"></div>
            <div className="animated-lines">
                {[10, 30, 50, 70, 90].map((left, i) => (
                    <div
                        key={i}
                        className="line portfolio-line"
                        style={{ left: `${left}%`, animationDelay: `${i * 2}s` }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <section className="portfolio-hero">
                <div className="container">
                    <div className="hero-badge">Our Portfolio</div>
                    <h1 className="portfolio-title">Crafting Digital Excellence</h1>
                    <p className="portfolio-subtitle">
                        Explore our latest projects where AI innovation meets stunning design to drive measurable business growth
                    </p>

                    {/* Stats Bar */}
                    <div className="stats-bar">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="portfolio-section">
                <div className="container">
                    <div className="portfolio-grid">
                        {projects.map((project, index) => (
                            <article key={project.id} className="portfolio-item scroll-reveal" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                                <div
                                    className="portfolio-image"
                                    onClick={() => handleImageClick(project.liveUrl)}
                                >
                                    <div className="image-overlay">
                                        <span className="overlay-text">View Live Site</span>
                                    </div>
                                    <Image
                                        src={project.image}
                                        alt={`${project.title} Website`}
                                        width={600}
                                        height={400}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                                <div className="portfolio-content">
                                    <span className="project-type">{project.type}</span>
                                    <h2 className="project-title">{project.title}</h2>
                                    <p className="project-description">{project.description}</p>

                                    <ul className="project-features">
                                        {project.features.map((feature, i) => (
                                            <li key={i}>
                                                <span className="feature-icon"></span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="project-links">
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-project">
                                            Visit Live Site
                                            <span>→</span>
                                        </a>
                                        <Link href={project.caseStudyUrl} className="btn-outline">
                                            View Case Study
                                        </Link>
                                    </div>

                                    <div className="tech-stack">
                                        {project.techStack.map((tech, i) => (
                                            <span key={i} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <div className="cta-content">
                            <h2 className="cta-title">Ready to Build Something Amazing?</h2>
                            <p className="cta-subtitle">
                                Let&apos;s create a website that converts visitors into customers
                            </p>
                            <Link href="/book/" className="btn-white">
                                Start Your Project
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

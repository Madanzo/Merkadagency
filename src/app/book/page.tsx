'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { ContactForm } from '@/components/ContactForm';

const faqData = [
    {
        question: "What should I prepare for the call?",
        answer: "Just bring your business goals and any current challenges you're facing. We'll handle the technical analysis and provide actionable insights during our call."
    },
    {
        question: "Is this really free with no obligations?",
        answer: "Yes, absolutely! This is a genuine strategy session where we'll provide value regardless of whether you decide to work with us. No high-pressure sales tactics."
    },
    {
        question: "How long until I can see results?",
        answer: "Most clients see initial improvements within 2-4 weeks of implementation. Significant ROI typically occurs within 60-90 days, depending on your industry and current setup."
    }
];

const benefits = [
    "Free comprehensive audit of your current marketing systems",
    "Custom AI automation strategy tailored to your business",
    "ROI projections based on your industry and goals",
    "Clear implementation roadmap with timelines",
    "No-obligation consultation with our experts"
];

const stats = [
    { number: '24hr', label: 'Response Time' },
    { number: '100%', label: 'Confidential' },
    { number: '30min', label: 'Strategy Session' }
];

export default function BookPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    // Particle creation effect
    useEffect(() => {
        const createParticle = () => {
            if (!particlesRef.current) return;

            const particle = document.createElement('div');
            particle.className = styles.particle;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particlesRef.current.appendChild(particle);

            setTimeout(() => particle.remove(), 25000);
        };

        const interval = setInterval(createParticle, 3000);
        return () => clearInterval(interval);
    }, []);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const cx = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

    return (
        <div className={styles['page-root']}>
            {/* Tech Grid Background */}
            <div className={styles['tech-grid']}></div>

            {/* Floating Particles */}
            <div className={styles.particles} ref={particlesRef}>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((left, i) => (
                    <div
                        key={i}
                        className={styles.particle}
                        style={{ left: `${left}%`, animationDelay: `${i * 2}s` }}
                    />
                ))}
            </div>

            {/* Main Container */}
            <div className={styles['booking-container']}>
                {/* Header */}
                <div className={styles['booking-header']}>
                    <h1>Book Your Strategy Call</h1>
                    <div className={styles['availability-badge']}>
                        <div className={styles['availability-dot']}></div>
                        <span className={styles['availability-text']}>Limited Availability</span>
                    </div>
                    <p>Let&apos;s discuss how AI-powered systems can transform your business and drive measurable growth</p>
                </div>

                {/* Main Content Grid */}
                <div className={styles['booking-content']}>
                    {/* Benefits Section */}
                    <div className={styles['benefits-card']}>
                        <h2 className={styles['benefits-title']}>What You&apos;ll Get</h2>

                        {benefits.map((benefit, index) => (
                            <div key={index} className={styles['benefit-item']}>
                                <div className={styles['benefit-icon']}></div>
                                <div className={styles['benefit-text']}>{benefit}</div>
                            </div>
                        ))}
                    </div>

                    {/* Booking Form Section */}
                    <div className={styles['calendar-wrapper']}>
                        <center>
                            <div className={styles['urgent-badge']}>
                                <svg className={styles['urgent-icon']} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className={styles['urgent-text']}>We&apos;ll reach out within 24 hours to schedule</span>
                            </div>
                        </center>

                        <div className="booking-form-container">
                            <ContactForm
                                formType="booking"
                                title="Request Your Strategy Call"
                                subtitle="Fill out the form below and we'll contact you to schedule a time that works best for you."
                                submitText="Request Call"
                                successMessage="Your request has been received! We'll reach out within 24 hours to schedule your strategy call."
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className={styles['stats-grid']}>
                    {stats.map((stat, index) => (
                        <div key={index} className={styles['stat-card']}>
                            <div className={styles['stat-number']}>{stat.number}</div>
                            <div className={styles['stat-label']}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className={styles['faq-section']}>
                    <h2 className={styles['faq-title']}>Frequently Asked Questions</h2>

                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className={cx(styles['faq-item'], activeFaq === index && styles.active)}
                        >
                            <div
                                className={styles['faq-question']}
                                onClick={() => toggleFaq(index)}
                            >
                                {faq.question}
                                <span className={styles['faq-arrow']}>▼</span>
                            </div>
                            <div className={styles['faq-answer']}>
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className={styles['footer-cta']}>
                    <h2>Need Help?</h2>
                    <p>Our team is available to assist you</p>
                    <div className={styles['contact-info']}>
                        <a href="tel:5124343793" className={styles['contact-item']}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            (512) 434-3793
                        </a>
                        <a href="mailto:info@merkadagency.com" className={styles['contact-item']}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            info@merkadagency.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

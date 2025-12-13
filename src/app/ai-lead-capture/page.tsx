'use client';

import React, { useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function AILeadCapturePage() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Animation Observer
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                    observerRef.current?.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const elements = document.querySelectorAll(`.${styles['fade-in']}`);
        elements.forEach(el => observerRef.current?.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const cx = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

    return (
        <div className={styles['page-root']}>
            <div className={styles['tech-grid']}></div>

            {/* Hero Section */}
            <section className={styles['service-hero']}>
                <div className={styles.container}>
                    <div className={styles['service-hero-content']}>
                        <div className={styles['service-badge']}>
                            <span>🤖</span>
                            <span>AI-Powered Lead Management</span>
                        </div>
                        <h1>Never Miss Another Lead with AI Automation</h1>
                        <p className={styles['service-subtitle']}>
                            Capture, qualify, and convert leads 24/7 with intelligent automation powered by Make.com, Lindy AI, and Voiceflow. No human intervention needed.
                        </p>

                        <div className={styles['hero-metrics']}>
                            <div className={styles['hero-metric']}>
                                <div className={styles['hero-metric-value']}>Instant</div>
                                <div className={styles['hero-metric-label']}>Response Time</div>
                            </div>
                            <div className={styles['hero-metric']}>
                                <div className={styles['hero-metric-value']}>95%</div>
                                <div className={styles['hero-metric-label']}>Qualification Accuracy</div>
                            </div>
                            <div className={styles['hero-metric']}>
                                <div className={styles['hero-metric-value']}>24/7</div>
                                <div className={styles['hero-metric-label']}>Automated Operation</div>
                            </div>
                            <div className={styles['hero-metric']}>
                                <div className={styles['hero-metric-value']}>3.5x</div>
                                <div className={styles['hero-metric-label']}>More Conversions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem vs Solution */}
            <section className={styles['comparison-section']}>
                <div className={styles.container}>
                    <div className={styles['section-header']}>
                        <h2>The Problem with Manual Lead Management</h2>
                        <p>Traditional lead capture wastes time and money while losing opportunities</p>
                    </div>

                    <div className={styles['comparison-grid']}>
                        <div className={cx(styles['comparison-card'], styles.problem, styles['fade-in'])}>
                            <div className={styles['comparison-icon']}>❌</div>
                            <h3 className={styles['comparison-title']}>Manual Lead Handling</h3>
                            <ul className={styles['comparison-list']}>
                                <li>Leads wait hours or days for responses</li>
                                <li>Manual qualification wastes staff time</li>
                                <li>Inconsistent follow-up processes</li>
                                <li>High cost per lead processed</li>
                                <li>Leads slip through the cracks</li>
                                <li>No qualification during off-hours</li>
                            </ul>
                            <div className={styles['comparison-desc']}>
                                <strong>Result:</strong> 60% of leads never get contacted, and your team wastes time on unqualified prospects
                            </div>
                        </div>

                        <div className={cx(styles['comparison-card'], styles.solution, styles['fade-in'])} style={{ transitionDelay: '0.1s' }}>
                            <div className={styles['comparison-icon']}>✅</div>
                            <h3 className={styles['comparison-title']}>AI-Powered Automation</h3>
                            <ul className={styles['comparison-list']}>
                                <li>Instant responses to every inquiry</li>
                                <li>AI qualifies leads automatically</li>
                                <li>Consistent process 24/7/365</li>
                                <li>90% cost reduction per lead</li>
                                <li>Zero leads missed</li>
                                <li>Works while you sleep</li>
                            </ul>
                            <div className={styles['comparison-desc']}>
                                <strong>Result:</strong> 100% lead follow-up with 95% qualification accuracy, freeing your team to close deals
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Automation Workflow */}
            <section className={styles['workflow-section']}>
                <div className={styles.container}>
                    <div className={styles['section-header']}>
                        <h2>Our AI Automation Stack</h2>
                        <p>Powerful tools working together to capture and qualify every lead</p>
                    </div>

                    {/* Workflow Visual Placeholder */}
                    <div className={styles['workflow-visual']}>
                        <h3 style={{ fontSize: '24px', marginBottom: '32px' }}>Complete Lead Capture Workflow</h3>
                        <div className={styles['workflow-placeholder']}>
                            <div className={styles['workflow-placeholder-text']}>📊 Your AI Automation Workflow Diagram Goes Here</div>
                            <div className={styles['workflow-placeholder-note']}>Replace this section with your automation screenshots</div>
                        </div>
                    </div>

                    {/* Tools Grid */}
                    <div className={styles['tools-grid']}>
                        <div className={cx(styles['tool-card'], styles['fade-in'])}>
                            <div className={styles['tool-icon']}>🔧</div>
                            <h3 className={styles['tool-name']}>Visual Automation</h3>
                            <p className={styles['tool-desc']}>Powerful workflow builder connecting all your tools with complex logic and intelligent data routing</p>
                        </div>

                        <div className={cx(styles['tool-card'], styles['fade-in'])} style={{ transitionDelay: '0.1s' }}>
                            <div className={styles['tool-icon']}>🧠</div>
                            <h3 className={styles['tool-name']}>AI Intelligence</h3>
                            <p className={styles['tool-desc']}>Advanced AI assistant for natural language qualification and smart decision-making capabilities</p>
                        </div>

                        <div className={cx(styles['tool-card'], styles['fade-in'])} style={{ transitionDelay: '0.2s' }}>
                            <div className={styles['tool-icon']}>💬</div>
                            <h3 className={styles['tool-name']}>Conversational AI</h3>
                            <p className={styles['tool-desc']}>Intelligent chat platform for engaging lead interactions across all communication channels</p>
                        </div>
                    </div>

                    {/* Additional Workflow Images Placeholders */}
                    <div className={styles['workflow-visual']} style={{ marginTop: '60px' }}>
                        <h3 style={{ fontSize: '24px', marginBottom: '32px' }}>AI Qualification Logic</h3>
                        <div className={styles['workflow-placeholder']}>
                            <div className={styles['workflow-placeholder-text']}>🤖 Your AI Qualification Setup Screenshot Goes Here</div>
                            <div className={styles['workflow-placeholder-note']}>Show how AI asks questions and scores leads</div>
                        </div>
                    </div>

                    <div className={styles['workflow-visual']} style={{ marginTop: '60px' }}>
                        <h3 style={{ fontSize: '24px', marginBottom: '32px' }}>Conversation Flow Design</h3>
                        <div className={styles['workflow-placeholder']}>
                            <div className={styles['workflow-placeholder-text']}>💬 Your Conversation Flow Diagram Goes Here</div>
                            <div className={styles['workflow-placeholder-note']}>Display the conversational paths and decision trees</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className={styles['features-section']}>
                <div className={styles.container}>
                    <div className={styles['section-header']}>
                        <h2>Complete Lead Capture Features</h2>
                        <p>Everything you need to automate your entire lead process</p>
                    </div>

                    <div className={styles['features-grid']}>
                        <div className={cx(styles['feature-card'], styles['fade-in'])}>
                            <div className={styles['feature-icon']}>⚡</div>
                            <h3 className={styles['feature-title']}>Instant Lead Response</h3>
                            <p className={styles['feature-desc']}>AI responds within seconds to every inquiry from any channel - website forms, SMS, email, chat, or social media.</p>
                        </div>

                        <div className={cx(styles['feature-card'], styles['fade-in'])} style={{ transitionDelay: '0.1s' }}>
                            <div className={styles['feature-icon']}>🎯</div>
                            <h3 className={styles['feature-title']}>Intelligent Qualification</h3>
                            <p className={styles['feature-desc']}>AI asks the right questions to determine lead quality, budget, timeline, and fit for your services.</p>
                        </div>

                        <div className={cx(styles['feature-card'], styles['fade-in'])} style={{ transitionDelay: '0.2s' }}>
                            <div className={styles['feature-icon']}>📅</div>
                            <h3 className={styles['feature-title']}>Automated Booking</h3>
                            <p className={styles['feature-desc']}>Qualified leads are instantly scheduled into your calendar with confirmations and reminders sent automatically.</p>
                        </div>

                        <div className={cx(styles['feature-card'], styles['fade-in'])} style={{ transitionDelay: '0.3s' }}>
                            <div className={styles['feature-icon']}>🔄</div>
                            <h3 className={styles['feature-title']}>CRM Integration</h3>
                            <p className={styles['feature-desc']}>Every lead, interaction, and data point flows directly into your CRM with proper tagging and scoring.</p>
                        </div>

                        <div className={cx(styles['feature-card'], styles['fade-in'])} style={{ transitionDelay: '0.4s' }}>
                            <div className={styles['feature-icon']}>📊</div>
                            <h3 className={styles['feature-title']}>Smart Lead Scoring</h3>
                            <p className={styles['feature-desc']}>AI assigns scores based on engagement, qualification answers, and behavior patterns to prioritize your best leads.</p>
                        </div>

                        <div className={cx(styles['feature-card'], styles['fade-in'])} style={{ transitionDelay: '0.5s' }}>
                            <div className={styles['feature-icon']}>🔔</div>
                            <h3 className={styles['feature-title']}>Instant Notifications</h3>
                            <p className={styles['feature-desc']}>Get real-time alerts for high-value leads while the AI handles routine qualification automatically.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Timeline */}
            <section className={styles['process-section']}>
                <div className={styles.container}>
                    <div className={styles['section-header']}>
                        <h2>How It Works</h2>
                        <p>From lead capture to qualified appointment in seconds</p>
                    </div>

                    <div className={styles['process-timeline']}>
                        <div className={cx(styles['process-step'], styles['fade-in'])}>
                            <div className={styles['step-number']}>1</div>
                            <div className={styles['step-content']}>
                                <h3 className={styles['step-title']}>Lead Arrives</h3>
                                <p className={styles['step-desc']}>Someone fills out your form, sends an SMS, starts a chat, or engages from any channel. Make.com instantly captures and routes the data.</p>
                            </div>
                        </div>

                        <div className={cx(styles['process-step'], styles['fade-in'])} style={{ transitionDelay: '0.1s' }}>
                            <div className={styles['step-number']}>2</div>
                            <div className={styles['step-content']}>
                                <h3 className={styles['step-title']}>AI Engages</h3>
                                <p className={styles['step-desc']}>Voiceflow or Lindy AI immediately responds with a personalized message, asking qualification questions in a natural conversation.</p>
                            </div>
                        </div>

                        <div className={cx(styles['process-step'], styles['fade-in'])} style={{ transitionDelay: '0.2s' }}>
                            <div className={styles['step-number']}>3</div>
                            <div className={styles['step-content']}>
                                <h3 className={styles['step-title']}>Lead Qualified</h3>
                                <p className={styles['step-desc']}>AI analyzes responses against your criteria, scores the lead, and determines if they&apos;re a good fit for your services.</p>
                            </div>
                        </div>

                        <div className={cx(styles['process-step'], styles['fade-in'])} style={{ transitionDelay: '0.3s' }}>
                            <div className={styles['step-number']}>4</div>
                            <div className={styles['step-content']}>
                                <h3 className={styles['step-title']}>CRM Updated</h3>
                                <p className={styles['step-desc']}>All lead data, conversation history, and qualification scores automatically sync to your CRM with proper tags and segments.</p>
                            </div>
                        </div>

                        <div className={cx(styles['process-step'], styles['fade-in'])} style={{ transitionDelay: '0.4s' }}>
                            <div className={styles['step-number']}>5</div>
                            <div className={styles['step-content']}>
                                <h3 className={styles['step-title']}>Meeting Booked</h3>
                                <p className={styles['step-desc']}>High-quality leads get calendar links instantly, choosing times that work for them. Confirmations and reminders sent automatically.</p>
                            </div>
                        </div>

                        <div className={cx(styles['process-step'], styles['fade-in'])} style={{ transitionDelay: '0.5s' }}>
                            <div className={styles['step-number']}>6</div>
                            <div className={styles['step-content']}>
                                <h3 className={styles['step-title']}>You Close</h3>
                                <p className={styles['step-desc']}>Show up to pre-qualified appointments with full context. Your team focuses only on closing deals, not chasing cold leads.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI Section */}
            <section className={styles['roi-section']}>
                <div className={styles.container}>
                    <div className={styles['section-header']}>
                        <h2>The ROI Is Undeniable</h2>
                        <p>See the dramatic impact AI lead capture has on your bottom line</p>
                    </div>

                    <div className={styles['roi-box']}>
                        <div className={styles['roi-grid']}>
                            <div className={cx(styles['roi-card'], styles['fade-in'])}>
                                <div className={styles['roi-value']}>90%</div>
                                <div className={styles['roi-label']}>Cost Reduction Per Lead</div>
                            </div>

                            <div className={cx(styles['roi-card'], styles['fade-in'])} style={{ transitionDelay: '0.1s' }}>
                                <div className={styles['roi-value']}>3.5x</div>
                                <div className={styles['roi-label']}>More Leads Converted</div>
                            </div>

                            <div className={cx(styles['roi-card'], styles['fade-in'])} style={{ transitionDelay: '0.2s' }}>
                                <div className={styles['roi-value']}>100%</div>
                                <div className={styles['roi-label']}>Lead Follow-Up Rate</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ fontSize: '18px', color: 'var(--success-green)', fontWeight: 600 }}>
                                Average client saves 20+ hours per week while converting 3.5x more leads into customers
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles['cta-section']}>
                <div className={styles.container}>
                    <div className={styles['cta-box']}>
                        <div className={styles['cta-content']}>
                            <h2 className={styles['cta-title']}>Ready to Capture Every Lead?</h2>
                            <p className={styles['cta-subtitle']}>
                                Let&apos;s build your AI lead capture system that works 24/7
                            </p>
                            <a href="https://merkadagency.com/book/" className={styles['btn-white']}>
                                Book Your Strategy Call
                                <span>→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

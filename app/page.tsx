"use client";

import StatusCard from "@/components/StatusCard";
import CTAButton from "@/components/CTAButton";
import Card from "@/components/Card";
import ConsolePanel from "@/components/ConsolePanel";
import SystemBriefVideo from "@/components/SystemBriefVideo";
import Link from "next/link";
import { trackCTAClick } from "@/lib/analytics";

export default function HomePage() {
    return (
        <main>
            {/* ========== HERO ========== */}
            <section className="section hero-section">
                <div className="container">
                    <div className="hero-grid">
                        {/* Left Column: Primary / Dominant */}
                        <div className="hero-left">
                            <p className="label" style={{ marginBottom: "0.75rem" }}>
                                ACQUISITION INFRASTRUCTURE
                            </p>
                            <h1 style={{ marginBottom: "1rem" }}>
                                AI-Driven Acquisition Systems Built to Convert
                            </h1>
                            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.7" }}>
                                Conversion infrastructure that turns traffic into booked conversations.
                                Measured by cost per lead and response time.
                            </p>
                            <CTAButton location="hero" />

                            {/* Status Panel - Tightly coupled with CTA */}
                            <div className="hero-status-group">
                                <StatusCard
                                    title="STATUS"
                                    items={[
                                        { label: "Conversion funnel", value: "ACTIVE", active: true },
                                        { label: "Follow-ups", value: "AUTOMATED", active: true },
                                        { label: "Response time", value: "< 60s" },
                                        { label: "Bottlenecks", value: "IDENTIFIED" },
                                    ]}
                                    style={{ maxWidth: "260px", flex: "1 1 200px" }}
                                />
                            </div>
                        </div>

                        {/* Right Column: Supporting Proof */}
                        <div className="hero-right">
                            <SystemBriefVideo style={{ width: "100%", maxWidth: "400px" }} />
                            <ConsolePanel style={{ maxWidth: "400px" }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== PROBLEM ========== */}
            <section className="section bg-elevated">
                <div className="container">
                    <div className="problem-system-grid">
                        <div className="grid-left">
                            <p className="label" style={{ marginBottom: "0.5rem" }}>PROBLEM</p>
                            <h2 style={{ marginBottom: "1.25rem" }}>
                                Most marketing systems leak leads.
                            </h2>
                            <ul className="structured-list">
                                <li><span className="icon icon-error">✕</span>Slow response times — leads go cold</li>
                                <li><span className="icon icon-error">✕</span>No follow-up automation</li>
                                <li><span className="icon icon-error">✕</span>Agencies optimize clicks, not conversations</li>
                                <li><span className="icon icon-error">✕</span>No visibility into what&apos;s working</li>
                            </ul>
                            <p style={{ marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                The issue isn&apos;t traffic. It&apos;s the system behind it.
                            </p>
                        </div>
                        <div className="grid-right">
                            <StatusCard
                                title="SYSTEM STATUS"
                                items={[
                                    { label: "Response time", value: "TIMEOUT", active: false },
                                    { label: "Follow-up", value: "MISSING", active: false },
                                    { label: "Lead routing", value: "FAILED", active: false },
                                    { label: "Visibility", value: "NONE", active: false },
                                ]}
                                style={{ maxWidth: "280px" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== SYSTEM ========== */}
            <section className="section">
                <div className="container">
                    <div className="problem-system-grid">
                        <div className="grid-left">
                            <p className="label" style={{ marginBottom: "0.5rem" }}>SYSTEM</p>
                            <h2 style={{ marginBottom: "1.25rem" }}>
                                We build the infrastructure — not just the ads.
                            </h2>
                            <ul className="structured-list" style={{ marginBottom: "1.5rem" }}>
                                <li><span className="icon icon-active">→</span>Conversion-first landing infrastructure</li>
                                <li><span className="icon icon-active">→</span>Automated follow-up sequences</li>
                                <li><span className="icon icon-active">→</span>Lead qualification and routing</li>
                                <li><span className="icon icon-active">→</span>Response time optimization</li>
                            </ul>
                            <Link
                                href="/services"
                                onClick={() => trackCTAClick("services-link")}
                                style={{ color: "var(--text-muted)", fontSize: "0.8125rem", textDecoration: "underline", textUnderlineOffset: "3px" }}
                            >
                                View system details →
                            </Link>
                        </div>
                        <div className="grid-right">
                            <StatusCard
                                title="SYSTEM STATUS"
                                items={[
                                    { label: "Conversion funnel", value: "ACTIVE", active: true },
                                    { label: "Follow-up", value: "AUTOMATED", active: true },
                                    { label: "Lead routing", value: "CONNECTED", active: true },
                                    { label: "Response time", value: "OPTIMIZED", active: true },
                                ]}
                                style={{ maxWidth: "280px" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== MARKETS ========== */}
            <section className="section bg-elevated section-transition">
                <div className="container">
                    <div className="section-header-centered">
                        <p className="label">MARKETS</p>
                        <h2>Regulated &amp; competitive.</h2>
                    </div>
                    <div className="grid-2">
                        <Card>
                            <h3 style={{ marginBottom: "0.375rem" }}>Cannabis</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                Compliance-aware systems for restricted platforms.
                            </p>
                        </Card>
                        <Card>
                            <h3 style={{ marginBottom: "0.375rem" }}>Med Spas</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                Local demand capture with booking-first funnels.
                            </p>
                        </Card>
                        <Card>
                            <h3 style={{ marginBottom: "0.375rem" }}>Roofing &amp; Construction</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                Speed-to-lead that wins before competitors respond.
                            </p>
                        </Card>
                        <Card>
                            <h3 style={{ marginBottom: "0.375rem" }}>E-commerce</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                Lifecycle flows that convert traffic to revenue.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ========== PROCESS ========== */}
            <section className="section">
                <div className="container">
                    <div className="section-header-centered">
                        <p className="label">PROCESS</p>
                        <h2>How we work.</h2>
                    </div>
                    <div className="process-timeline">
                        <div className="process-step">
                            <span className="step-number">01</span>
                            <h3 style={{ margin: "0.5rem 0 0.375rem" }}>Discovery</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                15 min to map goals and bottlenecks.
                            </p>
                        </div>
                        <div className="process-step">
                            <span className="step-number">02</span>
                            <h3 style={{ margin: "0.5rem 0 0.375rem" }}>Strategy</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                Custom system design for your market.
                            </p>
                        </div>
                        <div className="process-step">
                            <span className="step-number">03</span>
                            <h3 style={{ margin: "0.5rem 0 0.375rem" }}>Deployment</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                                Build, launch, optimize.
                            </p>
                        </div>
                    </div>
                    <div className="process-cta-wrapper">
                        <CTAButton location="how-it-works" />
                    </div>
                </div>
            </section>

            {/* ========== FINAL CTA ========== */}
            <section className="section section-final-cta bg-elevated" style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 style={{ marginBottom: "0.5rem" }}>Ready to fix the system?</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                        One call. Identify bottlenecks. Get a strategy.
                    </p>
                    <CTAButton location="final-cta" />
                </div>
            </section>
        </main>
    );
}

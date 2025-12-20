"use client";

import Section from "@/components/Section";
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
            <Section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {/* Hero Grid - Text left, Video right on desktop */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "2rem",
                    }}
                    className="hero-grid"
                >
                    {/* Left: Text content */}
                    <div>
                        <p className="label" style={{ marginBottom: "0.75rem" }}>
                            ACQUISITION INFRASTRUCTURE
                        </p>
                        <h1 style={{ marginBottom: "1rem", maxWidth: "700px" }}>
                            AI-Driven Acquisition Systems Built to Convert
                        </h1>
                        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "1.75rem", lineHeight: "1.7" }}>
                            Conversion infrastructure that turns traffic into booked conversations.
                            Measured by cost per lead and response time.
                        </p>
                        <CTAButton location="hero" />

                        {/* System Panels */}
                        <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
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
                            <ConsolePanel style={{ maxWidth: "260px", flex: "1 1 200px" }} />
                        </div>
                    </div>

                    {/* Right: Video (desktop) / Below status (mobile) */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <SystemBriefVideo style={{ width: "100%", maxWidth: "400px" }} />
                    </div>
                </div>
            </Section>

            {/* ========== PROBLEM ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>PROBLEM</p>
                <h2 style={{ marginBottom: "1.25rem", maxWidth: "500px" }}>
                    Most marketing systems leak leads.
                </h2>
                <ul className="structured-list" style={{ maxWidth: "420px" }}>
                    <li><span className="icon icon-error">✕</span>Slow response times — leads go cold</li>
                    <li><span className="icon icon-error">✕</span>No follow-up automation</li>
                    <li><span className="icon icon-error">✕</span>Agencies optimize clicks, not conversations</li>
                    <li><span className="icon icon-error">✕</span>No visibility into what&apos;s working</li>
                </ul>
                <p style={{ marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                    The issue isn&apos;t traffic. It&apos;s the system behind it.
                </p>
            </Section>

            {/* ========== SYSTEM ========== */}
            <Section>
                <p className="label" style={{ marginBottom: "0.5rem" }}>SYSTEM</p>
                <h2 style={{ marginBottom: "1.25rem", maxWidth: "500px" }}>
                    We build the infrastructure — not just the ads.
                </h2>
                <ul className="structured-list" style={{ maxWidth: "420px", marginBottom: "1.5rem" }}>
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
            </Section>

            {/* ========== MARKETS ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>MARKETS</p>
                <h2 style={{ marginBottom: "1.5rem" }}>Regulated &amp; competitive.</h2>
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
            </Section>

            {/* ========== PROCESS ========== */}
            <Section>
                <p className="label" style={{ marginBottom: "0.5rem" }}>PROCESS</p>
                <h2 style={{ marginBottom: "2rem" }}>How we work.</h2>
                <div className="grid-3" style={{ marginBottom: "2rem" }}>
                    <div>
                        <span className="step-number">01</span>
                        <h3 style={{ margin: "0.5rem 0 0.375rem" }}>Discovery</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                            15 min to map goals and bottlenecks.
                        </p>
                    </div>
                    <div>
                        <span className="step-number">02</span>
                        <h3 style={{ margin: "0.5rem 0 0.375rem" }}>Strategy</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                            Custom system design for your market.
                        </p>
                    </div>
                    <div>
                        <span className="step-number">03</span>
                        <h3 style={{ margin: "0.5rem 0 0.375rem" }}>Deployment</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                            Build, launch, optimize.
                        </p>
                    </div>
                </div>
                <CTAButton location="how-it-works" />
            </Section>

            {/* ========== FINAL CTA ========== */}
            <Section elevated centered>
                <h2 style={{ marginBottom: "0.5rem" }}>Ready to fix the system?</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                    One call. Identify bottlenecks. Get a strategy.
                </p>
                <CTAButton location="final-cta" />
            </Section>
        </main>
    );
}

"use client";

import Section from "@/components/Section";
import StatusCard from "@/components/StatusCard";
import CTAButton from "@/components/CTAButton";
import Card from "@/components/Card";
import CRMConsolePanel from "@/components/CRMConsolePanel";

export default function ServicesPage() {
    return (
        <main>
            {/* ========== HERO ========== */}
            <Section style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    CRM AUTOMATION
                </p>
                <h1 style={{ marginBottom: "1rem", maxWidth: "700px" }}>
                    Lead Capture and Response Infrastructure
                </h1>
                <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "1.75rem", lineHeight: "1.7" }}>
                    Automated systems that capture, qualify, and follow up with leads until a conversation happens.
                </p>
                <CTAButton location="services-hero" />

                {/* System Panels */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
                    <StatusCard
                        title="SYSTEM"
                        items={[
                            { label: "Lead capture", value: "AUTOMATED", active: true },
                            { label: "Follow-up sequence", value: "ACTIVE", active: true },
                            { label: "Response time", value: "< 60s" },
                            { label: "Manual chasing", value: "ELIMINATED", active: true },
                        ]}
                        style={{ maxWidth: "260px", flex: "1 1 240px" }}
                    />
                    <CRMConsolePanel style={{ maxWidth: "280px", flex: "1 1 240px" }} />
                </div>
            </Section>

            {/* ========== PROBLEM REMOVED ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    PROBLEM REMOVED
                </p>
                <h2 style={{ marginBottom: "1.25rem", maxWidth: "500px" }}>
                    What this system eliminates.
                </h2>
                <ul className="structured-list" style={{ maxWidth: "420px" }}>
                    <li><span className="icon icon-error">✕</span>Leads going cold from slow response</li>
                    <li><span className="icon icon-error">✕</span>Manual follow-up that gets forgotten</li>
                    <li><span className="icon icon-error">✕</span>No visibility into lead status</li>
                    <li><span className="icon icon-error">✕</span>Agencies optimizing clicks, not calls</li>
                </ul>
            </Section>

            {/* ========== WHAT'S AUTOMATED ========== */}
            <Section>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    AUTOMATED
                </p>
                <h2 style={{ marginBottom: "1.25rem", maxWidth: "500px" }}>
                    What the system handles.
                </h2>
                <ul className="structured-list" style={{ maxWidth: "420px" }}>
                    <li><span className="icon icon-active">→</span>Instant lead capture from all sources</li>
                    <li><span className="icon icon-active">→</span>SMS + email follow-up sequences</li>
                    <li><span className="icon icon-active">→</span>Lead qualification routing</li>
                    <li><span className="icon icon-active">→</span>Calendar booking integration</li>
                </ul>
            </Section>

            {/* ========== WHAT IMPROVES ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    PERFORMANCE
                </p>
                <h2 style={{ marginBottom: "1.5rem" }}>What improves.</h2>
                <div className="grid-3">
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>RESPONSE TIME</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>&lt; 60s</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>FOLLOW-UP RATE</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>100%</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>BOOKING RATE</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>+40%</p>
                    </Card>
                </div>
            </Section>

            {/* ========== FIT CHECK ========== */}
            <Section>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    FIT CHECK
                </p>
                <h2 style={{ marginBottom: "1.5rem" }}>Who this is for.</h2>
                <div className="grid-2">
                    <Card>
                        <p className="label" style={{ marginBottom: "0.75rem", color: "var(--status-active)" }}>✓ THIS IS A FIT IF</p>
                        <ul className="structured-list">
                            <li>You need consistent inbound conversations</li>
                            <li>You operate in a regulated market</li>
                            <li>You value systems over hacks</li>
                        </ul>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.75rem", color: "var(--status-error)" }}>✕ NOT A FIT IF</p>
                        <ul className="structured-list">
                            <li>You want cheap traffic with no follow-up</li>
                            <li>You&apos;re looking for a one-off campaign</li>
                            <li>You&apos;re not ready to invest in infrastructure</li>
                        </ul>
                    </Card>
                </div>
            </Section>

            {/* ========== FINAL CTA ========== */}
            <Section elevated centered>
                <h2 style={{ marginBottom: "0.5rem" }}>Ready to automate?</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                    One call to map your bottlenecks.
                </p>
                <CTAButton location="services-final" />
            </Section>
        </main>
    );
}

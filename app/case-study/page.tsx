"use client";

import Section from "@/components/Section";
import StatusCard from "@/components/StatusCard";
import CTAButton from "@/components/CTAButton";
import Card from "@/components/Card";
import ConsolePanel from "@/components/ConsolePanel";

/**
 * Case Study Page Template (System Pattern)
 * 
 * Case studies are SYSTEM LOGS, not narratives.
 * Structure: INPUTS → SYSTEM CHANGES → OUTPUTS
 */
export default function CaseStudyPage() {
    return (
        <main>
            {/* ========== HERO ========== */}
            <section className="section hero-section">
                <div className="container">
                    <p className="label" style={{ marginBottom: "0.5rem" }}>
                        CASE STUDY
                    </p>
                    <h1 style={{ marginBottom: "1rem", maxWidth: "700px" }}>
                        Cannabis Dispensary: Lead Response System
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "1.5rem", lineHeight: "1.7" }}>
                        Multi-location dispensary. Leads were going cold. No follow-up system in place.
                    </p>
                    <ConsolePanel style={{ maxWidth: "300px" }} />
                </div>
            </section>

            {/* ========== INPUTS ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    INPUTS
                </p>
                <h2 style={{ marginBottom: "1.25rem" }}>Initial State</h2>
                <StatusCard
                    title="BEFORE"
                    items={[
                        { label: "Response time", value: "> 4 HOURS", active: false },
                        { label: "Follow-up rate", value: "23%", active: false },
                        { label: "Lead tracking", value: "MANUAL", active: false },
                        { label: "Booking rate", value: "8%", active: false },
                    ]}
                    style={{ maxWidth: "280px" }}
                />
            </Section>

            {/* ========== SYSTEM CHANGES ========== */}
            <Section style={{ paddingTop: "3rem" }}>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    SYSTEM CHANGES
                </p>
                <h2 style={{ marginBottom: "1.25rem" }}>What we deployed.</h2>
                <ul className="structured-list" style={{ maxWidth: "420px" }}>
                    <li><span className="icon icon-active">→</span>Centralized lead capture from all locations</li>
                    <li><span className="icon icon-active">→</span>Automated SMS sequence (3-touch)</li>
                    <li><span className="icon icon-active">→</span>Email follow-up with booking link</li>
                    <li><span className="icon icon-active">→</span>Lead status dashboard for managers</li>
                </ul>
            </Section>

            {/* ========== OUTPUTS ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>
                    OUTPUTS
                </p>
                <h2 style={{ marginBottom: "1.5rem" }}>Results after 60 days.</h2>
                <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>RESPONSE TIME</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>&lt; 2 min</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>FOLLOW-UP RATE</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>100%</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>BOOKING RATE</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>34%</p>
                    </Card>
                </div>

                {/* Before/After Status */}
                <div className="grid-2" style={{ maxWidth: "600px" }}>
                    <StatusCard
                        title="BEFORE"
                        items={[
                            { label: "Response time", value: "> 4h", active: false },
                            { label: "Booking rate", value: "8%", active: false },
                        ]}
                    />
                    <StatusCard
                        title="AFTER"
                        items={[
                            { label: "Response time", value: "< 2 min", active: true },
                            { label: "Booking rate", value: "34%", active: true },
                        ]}
                    />
                </div>
            </Section>

            {/* ========== FINAL CTA ========== */}
            <section className="section section-final-cta" style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 style={{ marginBottom: "0.5rem" }}>Ready to see similar results?</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                        One call to map your system.
                    </p>
                    <CTAButton location="case-study-final" />
                </div>
            </section>
        </main>
    );
}

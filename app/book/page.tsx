"use client";

import Section from "@/components/Section";
import Card from "@/components/Card";
import StatusCard from "@/components/StatusCard";
import CalendarEmbed from "@/components/CalendarEmbed";

export default function BookPage() {
    return (
        <main>
            {/* ========== HERO ========== */}
            <section className="section hero-section" style={{ textAlign: "center" }}>
                <div className="container">
                    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                        <p className="label" style={{ marginBottom: "0.5rem" }}>
                            BOOK CONSULTATION
                        </p>
                        <h1 style={{ marginBottom: "1rem" }}>Strategy Call</h1>
                        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                            A short call to map your bottlenecks. No pressure.
                        </p>

                        {/* Process Status */}
                        <StatusCard
                            title="PROCESS"
                            items={[
                                { label: "Duration", value: "15 MIN" },
                                { label: "Format", value: "VIDEO CALL" },
                                { label: "Follow-up", value: "< 24h", active: true },
                                { label: "Pressure", value: "NONE", active: true },
                            ]}
                            style={{ maxWidth: "260px", margin: "0 auto", textAlign: "left" }}
                        />
                    </div>
                </div>
            </section>

            {/* ========== FIT CHECK ========== */}
            <Section elevated style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                    <div className="grid-2">
                        <Card>
                            <p className="label" style={{ marginBottom: "0.75rem", color: "var(--status-active)" }}>
                                ✓ THIS CALL IS
                            </p>
                            <ul className="structured-list">
                                <li>A clarity session on bottlenecks</li>
                                <li>A chance to see if our systems fit</li>
                                <li>Direction you can use immediately</li>
                            </ul>
                        </Card>

                        <Card>
                            <p className="label" style={{ marginBottom: "0.75rem", color: "var(--status-error)" }}>
                                ✕ THIS CALL IS NOT
                            </p>
                            <ul className="structured-list">
                                <li>A high-pressure sales pitch</li>
                                <li>A generic consultation</li>
                                <li>A fit for everyone</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </Section>

            {/* ========== BOOKING CALENDAR ========== */}
            <Section style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <p className="label" style={{ marginBottom: "1rem", textAlign: "center" }}>
                        SELECT A TIME
                    </p>
                    <CalendarEmbed />
                </div>
            </Section>

            {/* ========== TRUST ========== */}
            <Section elevated centered style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
                <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                        We specialize in regulated &amp; competitive markets.
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
                        If we&apos;re not a fit, we&apos;ll tell you.
                    </p>
                </div>
            </Section>
        </main>
    );
}

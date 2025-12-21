"use client";

import Link from "next/link";
import Section from "@/components/Section";
import Card from "@/components/Card";
import CTAButton from "@/components/CTAButton";

/**
 * Case Studies Index Page
 * Lists all available case studies
 */
export default function CaseStudiesPage() {
    return (
        <main>
            {/* ========== HERO ========== */}
            <section className="section hero-section">
                <div className="container">
                    <p className="label" style={{ marginBottom: "0.5rem" }}>
                        CASE STUDIES
                    </p>
                    <h1 style={{ marginBottom: "1rem", maxWidth: "700px" }}>
                        Real Systems. Real Results.
                    </h1>
                    <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "1.5rem", lineHeight: "1.7" }}>
                        See how we build revenue infrastructure for service businesses.
                    </p>
                </div>
            </section>

            {/* ========== CASE STUDY CARDS ========== */}
            <Section>
                <div className="grid-2" style={{ maxWidth: "900px" }}>
                    {/* Kravings Club */}
                    <Link href="/case-study/kravingsclub" style={{ textDecoration: "none" }}>
                        <Card style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            height: "100%",
                        }}>
                            <div style={{
                                aspectRatio: "16/9",
                                overflow: "hidden",
                                borderRadius: "var(--radius-sm)",
                                marginBottom: "1rem",
                                border: "1px solid var(--border-subtle)",
                            }}>
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FScreenshot%202025-08-21%20153207.png?alt=media&token=87afa2fd-ca5f-4683-ad24-fecb592cca89"
                                    alt="Kravings Club"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <p className="label" style={{ marginBottom: "0.25rem", color: "var(--purple-primary)" }}>
                                CANNABIS DELIVERY
                            </p>
                            <h3 style={{ marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                                Kravings Club
                            </h3>
                            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                                From zero to $6,988/month in 4 months. New startup with no digital presence.
                            </p>
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                <span style={{
                                    fontSize: "0.6875rem",
                                    color: "var(--status-active)",
                                    background: "rgba(34, 197, 94, 0.1)",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "var(--radius-sm)",
                                }}>
                                    +4.2x Revenue
                                </span>
                                <span style={{
                                    fontSize: "0.6875rem",
                                    color: "var(--status-active)",
                                    background: "rgba(34, 197, 94, 0.1)",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "var(--radius-sm)",
                                }}>
                                    68 Reviews
                                </span>
                                <span style={{
                                    fontSize: "0.6875rem",
                                    color: "var(--text-muted)",
                                    background: "var(--bg-surface)",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "var(--radius-sm)",
                                }}>
                                    #1 Google
                                </span>
                            </div>
                        </Card>
                    </Link>

                    {/* Placeholder for future case study */}
                    <Card style={{
                        opacity: 0.5,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        minHeight: "300px",
                    }}>
                        <p className="label" style={{ marginBottom: "0.5rem" }}>COMING SOON</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                            More case studies in development
                        </p>
                    </Card>
                </div>
            </Section>

            {/* ========== FINAL CTA ========== */}
            <section className="section section-final-cta bg-elevated" style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 style={{ marginBottom: "0.5rem" }}>Ready to be the next case study?</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                        Book a call to see if your business qualifies.
                    </p>
                    <CTAButton location="case-studies-final" />
                </div>
            </section>
        </main>
    );
}

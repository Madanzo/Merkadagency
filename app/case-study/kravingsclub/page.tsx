"use client";

import Section from "@/components/Section";
import StatusCard from "@/components/StatusCard";
import CTAButton from "@/components/CTAButton";
import Card from "@/components/Card";

/**
 * Kravings Club Case Study
 * Cannabis Delivery Service - Los Angeles, CA
 * Timeline: November 2024 → August 2025
 */
export default function KravingsClubCaseStudy() {
    return (
        <main>
            {/* ========== HERO ========== */}
            <section className="section hero-section">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-left">
                            <p className="label" style={{ marginBottom: "0.5rem" }}>
                                CASE STUDY
                            </p>
                            <h1 style={{ marginBottom: "1rem", maxWidth: "600px" }}>
                                From Zero to $6,988/Month in 4 Months
                            </h1>
                            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "520px", marginBottom: "1.5rem", lineHeight: "1.7" }}>
                                Cannabis delivery startup. No website. No systems. New to market.
                            </p>
                            <CTAButton location="kravings-hero" />

                            <div className="hero-status-group">
                                <StatusCard
                                    title="SYSTEM"
                                    items={[
                                        { label: "Status", value: "ACTIVE", active: true },
                                        { label: "Industry", value: "CANNABIS" },
                                        { label: "Timeline", value: "4 MONTHS" },
                                        { label: "Revenue", value: "+4.2X" },
                                    ]}
                                    style={{ maxWidth: "260px" }}
                                />
                            </div>
                        </div>
                        <div className="hero-right">
                            {/* Website Screenshot */}
                            <div style={{
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                                border: "1px solid var(--border-subtle)",
                            }}>
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FScreenshot%202025-08-21%20153207.png?alt=media&token=87afa2fd-ca5f-4683-ad24-fecb592cca89"
                                    alt="Kravings Club Website"
                                    style={{ width: "100%", height: "auto", display: "block" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== INPUTS (BEFORE) ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>INPUTS</p>
                <h2 style={{ marginBottom: "1.25rem" }}>Initial State</h2>
                <StatusCard
                    title="BEFORE"
                    items={[
                        { label: "Website", value: "NONE", active: false },
                        { label: "Digital presence", value: "NONE", active: false },
                        { label: "SEO / Content", value: "NONE", active: false },
                        { label: "Follow-up system", value: "NONE", active: false },
                        { label: "Review collection", value: "NONE", active: false },
                        { label: "Google reviews", value: "0", active: false },
                    ]}
                    style={{ maxWidth: "320px" }}
                />
                <p style={{ marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                    Brand new company with zero market knowledge entering a competitive cannabis delivery market in Los Angeles.
                </p>
            </Section>

            {/* ========== SYSTEM CHANGES ========== */}
            <Section style={{ paddingTop: "3rem" }}>
                <p className="label" style={{ marginBottom: "0.5rem" }}>SYSTEM CHANGES</p>
                <h2 style={{ marginBottom: "1.5rem" }}>What We Built</h2>

                {/* Website */}
                <div style={{ marginBottom: "3rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>Website</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                        Built from scratch. Rebuilt twice for optimization.
                    </p>
                    <div style={{
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        border: "1px solid var(--border-subtle)",
                        maxWidth: "600px",
                    }}>
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FScreenshot%202025-08-21%20153207.png?alt=media&token=87afa2fd-ca5f-4683-ad24-fecb592cca89"
                            alt="Kravings Club Website"
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                    </div>
                </div>

                {/* SMS System */}
                <div style={{ marginBottom: "3rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>SMS System</h3>
                    <ul className="structured-list" style={{ marginBottom: "1rem", maxWidth: "400px" }}>
                        <li><span className="icon icon-active">→</span>Promo blasts</li>
                        <li><span className="icon icon-active">→</span>Order confirmations</li>
                        <li><span className="icon icon-active">→</span>Order follow-ups</li>
                        <li><span className="icon icon-active">→</span>Review requests</li>
                    </ul>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", maxWidth: "600px" }}>
                        {[
                            "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FSMS%201.jpg?alt=media&token=c40ef68e-31f7-47a2-a3be-164fae223363",
                            "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FSMS%202.jpg?alt=media&token=6e2cf95c-e378-47d2-97ec-af1c7a3d2976",
                            "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FSMS%203.jpg?alt=media&token=956641f7-420c-4dd1-8582-87fb43525b3b",
                        ].map((src, i) => (
                            <div key={i} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                                <img src={src} alt={`SMS Screenshot ${i + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email System */}
                <div style={{ marginBottom: "3rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>Email System</h3>
                    <ul className="structured-list" style={{ marginBottom: "1rem", maxWidth: "400px" }}>
                        <li><span className="icon icon-active">→</span>Promo blasts</li>
                        <li><span className="icon icon-active">→</span>Review requests</li>
                    </ul>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", maxWidth: "700px" }}>
                        {[
                            "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email1.png?alt=media&token=84e7dadb-2ac7-4fc3-be6b-9f4cd19033f1",
                            "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email2.png?alt=media&token=ce8b23e0-de09-4d03-aa66-043316df5628",
                            "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email3.png?alt=media&token=43b5bc06-cd50-4532-a45a-151d65bcf0d4",
                            "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email4.png?alt=media&token=bda0de8f-61b1-4efb-8644-13d1dd8028c1",
                        ].map((src, i) => (
                            <div key={i} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                                <img src={src} alt={`Email Screenshot ${i + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* SEO */}
                <div>
                    <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>SEO</h3>
                    <ul className="structured-list" style={{ marginBottom: "1rem", maxWidth: "400px" }}>
                        <li><span className="icon icon-active">→</span>Fixed all code structure for Google ranking</li>
                        <li><span className="icon icon-active">→</span>Optimized H1, H2, title cards</li>
                        <li><span className="icon icon-active">→</span>Created blog content</li>
                        <li><span className="icon icon-active">→</span>Press placements on external sites</li>
                    </ul>
                    <div style={{
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        border: "1px solid var(--border-subtle)",
                        maxWidth: "600px",
                    }}>
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fgoogle%20rankings%20kravings.png?alt=media&token=640525af-64a6-4891-9939-0db521cc7253"
                            alt="Google Rankings"
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                    </div>
                </div>
            </Section>

            {/* ========== OUTPUTS (RESULTS) ========== */}
            <Section elevated>
                <p className="label" style={{ marginBottom: "0.5rem" }}>OUTPUTS</p>
                <h2 style={{ marginBottom: "1.5rem" }}>Results After 4 Months</h2>

                {/* Revenue Metrics */}
                <div className="grid-3" style={{ marginBottom: "2rem" }}>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>DECEMBER</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>$1,659</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>net sales</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>JANUARY</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--status-active)" }}>$5,674</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>+3.4x increase</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>MARCH</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--status-active)" }}>$6,988</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>+4.2x from start</p>
                    </Card>
                </div>

                {/* Revenue Images */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "2rem" }}>
                    {[
                        "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Frevenue-12.24-01.25.png?alt=media&token=d4ab92c8-6fe6-4a75-a9aa-1e24f5e02b78",
                        "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Frevenue-01.25-02.25.png?alt=media&token=7f92d550-f0e9-47f9-8d3a-a5032ad972ed",
                        "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Frevenue-03.25-04.25.png?alt=media&token=89817fec-22f4-4178-a350-73f5654aeb75",
                    ].map((src, i) => (
                        <div key={i} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                            <img src={src} alt={`Revenue Month ${i + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>
                    ))}
                </div>

                {/* SEO/Traffic Metrics */}
                <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>SEO &amp; Traffic</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
                    From zero, with $0 ad spend
                </p>
                <div className="grid-2" style={{ marginBottom: "1.5rem", maxWidth: "600px" }}>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>KEYWORDS</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "600" }}>1.5K</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--status-active)" }}>+1K growth</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>ORGANIC TRAFFIC</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "600" }}>888</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--status-active)" }}>+700 growth</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>IMPRESSIONS</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "600" }}>48.8K</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--status-active)" }}>+47K growth</p>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.25rem" }}>GOOGLE POSITION</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "600" }}>#1</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>for &quot;Kravings Club&quot;</p>
                    </Card>
                </div>

                <div style={{
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--border-subtle)",
                    maxWidth: "600px",
                    marginBottom: "2rem",
                }}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fimpresions-kraivngs.png?alt=media&token=9d0dd6aa-5f41-4ffe-9e89-b006c13ccf8b"
                        alt="Impressions Growth"
                        style={{ width: "100%", height: "auto", display: "block" }}
                    />
                </div>

                {/* Reviews */}
                <h3 style={{ marginBottom: "1rem", marginTop: "2rem" }}>Reviews</h3>
                <div className="grid-2" style={{ maxWidth: "400px", marginBottom: "1rem" }}>
                    <StatusCard
                        title="BEFORE"
                        items={[{ label: "Google reviews", value: "0", active: false }]}
                    />
                    <StatusCard
                        title="AFTER"
                        items={[{ label: "Google reviews", value: "68", active: true }]}
                    />
                </div>
                <div style={{
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--border-subtle)",
                    maxWidth: "500px",
                }}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Freviews-kravings.png?alt=media&token=abe396e1-7f7e-448d-b481-35edfc4bddc6"
                        alt="Google Reviews"
                        style={{ width: "100%", height: "auto", display: "block" }}
                    />
                </div>
            </Section>

            {/* ========== FIT CHECK ========== */}
            <Section style={{ paddingTop: "3rem" }}>
                <p className="label" style={{ marginBottom: "0.5rem" }}>FIT CHECK</p>
                <h2 style={{ marginBottom: "1.5rem" }}>Is This Right for You?</h2>
                <div className="grid-2" style={{ maxWidth: "700px" }}>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.75rem", color: "var(--status-active)" }}>
                            ✓ THIS WORKS IF
                        </p>
                        <ul className="structured-list">
                            <li>You&apos;re launching with no digital presence</li>
                            <li>You need website + marketing systems built from scratch</li>
                            <li>You&apos;re in a competitive/regulated industry</li>
                            <li>You want automated customer follow-up</li>
                            <li>You&apos;re willing to commit 3-6 months</li>
                        </ul>
                    </Card>
                    <Card>
                        <p className="label" style={{ marginBottom: "0.75rem", color: "var(--status-error)" }}>
                            ✕ NOT A FIT IF
                        </p>
                        <ul className="structured-list">
                            <li>You need results in 30 days</li>
                            <li>You&apos;re not ready to invest in infrastructure</li>
                            <li>You want ads-only growth with no systems</li>
                        </ul>
                    </Card>
                </div>
            </Section>

            {/* ========== FINAL CTA ========== */}
            <section className="section section-final-cta bg-elevated" style={{ textAlign: "center" }}>
                <div className="container">
                    <h2 style={{ marginBottom: "0.5rem" }}>Ready to Build Your System?</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                        See if your business qualifies for a similar system.
                    </p>
                    <CTAButton location="kravings-final" />
                </div>
            </section>
        </main>
    );
}

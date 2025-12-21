"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TrackedCTA from "./TrackedCTA";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/case-study", label: "Case Study" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: "0.75rem 0",
                background: "var(--bg-primary)",
                borderBottom: "1px solid var(--border-subtle)",
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Elegant_Merkadagency_logo%201.png?alt=media&token=eccf7036-fa7a-4694-a97a-9f81a7fb624e"
                        alt="MerkadAgency"
                        style={{
                            height: "32px",
                            width: "auto",
                        }}
                    />
                </Link>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    color: "var(--text-secondary)",
                                    fontSize: "0.8125rem",
                                    textDecoration: "none",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Desktop CTA */}
                {!isMobile && (
                    <TrackedCTA
                        href="/book"
                        location="header"
                        className="btn-primary"
                        style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.75rem",
                        }}
                    >
                        Book Consultation
                    </TrackedCTA>
                )}

                {/* Mobile Hamburger - Only visible on mobile */}
                {isMobile && (
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                        style={{
                            background: "none",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "5px",
                            width: "40px",
                            height: "40px",
                        }}
                    >
                        <span style={{
                            display: "block",
                            width: "22px",
                            height: "2px",
                            background: "var(--text-primary)",
                            borderRadius: "1px",
                            transition: "all 0.2s ease",
                            transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                        }} />
                        <span style={{
                            display: "block",
                            width: "22px",
                            height: "2px",
                            background: "var(--text-primary)",
                            borderRadius: "1px",
                            transition: "all 0.2s ease",
                            opacity: mobileMenuOpen ? 0 : 1,
                        }} />
                        <span style={{
                            display: "block",
                            width: "22px",
                            height: "2px",
                            background: "var(--text-primary)",
                            borderRadius: "1px",
                            transition: "all 0.2s ease",
                            transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                        }} />
                    </button>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobile && mobileMenuOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "var(--bg-primary)",
                        borderBottom: "1px solid var(--border-subtle)",
                        padding: "1rem 0",
                    }}
                >
                    <div className="container">
                        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        color: "var(--text-secondary)",
                                        fontSize: "0.9375rem",
                                        textDecoration: "none",
                                        padding: "0.5rem 0",
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <TrackedCTA
                                href="/book"
                                location="header-mobile"
                                className="btn-primary"
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "0.875rem",
                                    marginTop: "0.5rem",
                                    textAlign: "center",
                                }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Book Consultation
                            </TrackedCTA>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}

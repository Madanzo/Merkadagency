"use client";

import Link from "next/link";
import TrackedCTA from "./TrackedCTA";

export default function Header() {
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

                {/* CTA - Only emphasized element */}
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
            </div>
        </header>
    );
}

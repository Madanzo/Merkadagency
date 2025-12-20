export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{
                padding: "2rem 0",
                borderTop: "1px solid var(--border-subtle)",
                background: "var(--bg-primary)",
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                    textAlign: "center",
                }}
            >
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    © {currentYear} MerkadAgency. All rights reserved.
                </p>

                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    <a
                        href="mailto:camilo.reyna@merkadagency.com"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        camilo.reyna@merkadagency.com
                    </a>
                    {" · "}
                    <a
                        href="tel:+15124343793"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        +1 (512) 434-3793
                    </a>
                </p>

                <p
                    style={{
                        color: "var(--text-muted)",
                        fontSize: "0.6875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    Austin, TX · Serving clients nationwide
                </p>
            </div>
        </footer>
    );
}

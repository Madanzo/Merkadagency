import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    elevated?: boolean;
    centered?: boolean;
    style?: React.CSSProperties;
}

/**
 * Section - Consistent section wrapper (System Pattern)
 * 
 * Enforces consistent padding, borders, and background.
 * 
 * @example
 * <Section elevated centered>
 *   <h2>Ready?</h2>
 * </Section>
 */
export default function Section({
    children,
    elevated = false,
    centered = false,
    style,
}: SectionProps) {
    return (
        <section
            className={`section ${elevated ? "bg-elevated" : ""}`}
            style={{
                textAlign: centered ? "center" : undefined,
                ...style,
            }}
        >
            <div className="container">{children}</div>
        </section>
    );
}

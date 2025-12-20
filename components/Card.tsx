import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    style?: React.CSSProperties;
}

/**
 * Card - Hard-edge card component (System Pattern)
 * 
 * Subtle 1px border, no heavy shadows, no rounded "SaaS fluff".
 * 
 * @example
 * <Card>
 *   <h3>Cannabis</h3>
 *   <p>Compliance-aware systems.</p>
 * </Card>
 */
export default function Card({ children, style }: CardProps) {
    return (
        <div className="card" style={style}>
            {children}
        </div>
    );
}

"use client";

interface StatusItem {
    label: string;
    value: string;
    active?: boolean;
}

interface StatusCardProps {
    title?: string;
    items: StatusItem[];
    style?: React.CSSProperties;
}

/**
 * StatusCard - System Status Pattern Component
 * 
 * Displays dashboard-style status indicators.
 * Use for: System state, performance metrics, before/after states.
 * 
 * @example
 * <StatusCard
 *   title="STATUS"
 *   items={[
 *     { label: "Conversion funnel", value: "ACTIVE", active: true },
 *     { label: "Response time", value: "< 60s" },
 *   ]}
 * />
 */
export default function StatusCard({ title = "STATUS", items, style }: StatusCardProps) {
    return (
        <div className="system-block" style={style}>
            <span className="status-label">{title}</span>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="status-line"
                    style={{ marginBottom: index < items.length - 1 ? "0.25rem" : 0 }}
                >
                    <span
                        className="status-dot"
                        style={{
                            background: item.active !== false ? "var(--status-active)" : "var(--text-muted)",
                        }}
                    />
                    <span>{item.label}</span>
                    <span
                        className="status-value"
                        style={{
                            color: item.active ? "var(--status-active)" : "var(--text-primary)",
                        }}
                    >
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

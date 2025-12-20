interface StatusRowProps {
    label: string;
    value: string;
    active?: boolean;
    style?: React.CSSProperties;
}

/**
 * StatusRow - Single status line for system panels
 * 
 * Displays a label-value pair with optional active state.
 * Used inside SystemPanel or StatusCard components.
 * 
 * @example
 * <StatusRow label="Conversion funnel" value="ACTIVE" active />
 * <StatusRow label="Response time" value="< 60s" />
 */
export default function StatusRow({ label, value, active = false, style }: StatusRowProps) {
    return (
        <div className="status-line" style={style}>
            <span
                className="status-dot"
                style={{
                    background: active ? "var(--status-active)" : "var(--text-muted)",
                }}
            />
            <span>{label}</span>
            <span
                className="status-value"
                style={{
                    color: active ? "var(--status-active)" : "var(--text-primary)",
                }}
            >
                {value}
            </span>
        </div>
    );
}

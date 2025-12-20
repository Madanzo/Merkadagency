import { ReactNode } from "react";

interface SystemPanelProps {
    title?: string;
    children: ReactNode;
    style?: React.CSSProperties;
}

/**
 * SystemPanel - Container for system-style content blocks
 * 
 * Provides consistent styling for dashboard-like panels.
 * Use as wrapper for StatusRow components or console output.
 * 
 * @example
 * <SystemPanel title="STATUS">
 *   <StatusRow label="Funnel" value="ACTIVE" active />
 *   <StatusRow label="Response" value="< 60s" />
 * </SystemPanel>
 */
export default function SystemPanel({ title, children, style }: SystemPanelProps) {
    return (
        <div className="system-block" style={style}>
            {title && <span className="status-label">{title}</span>}
            {children}
        </div>
    );
}

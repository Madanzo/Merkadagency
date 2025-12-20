"use client";

import { useEffect, useState } from "react";

/**
 * CRM-specific log events for Services page
 */
const CRM_LOG_EVENTS = [
    { label: "lead.captured", status: "form_submit" },
    { label: "lead.enriched", status: "complete" },
    { label: "qualify.score", status: "87" },
    { label: "route.sales", status: "assigned" },
    { label: "sms.sent", status: "delivered" },
    { label: "email.queued", status: "pending" },
    { label: "lead.responded", status: "opened" },
    { label: "calendar.check", status: "available" },
    { label: "meeting.booked", status: "confirmed" },
    { label: "pipeline.updated", status: "stage_2" },
];

interface CRMConsolePanelProps {
    style?: React.CSSProperties;
}

/**
 * CRMConsolePanel - CRM-specific console for Services page
 */
export default function CRMConsolePanel({ style }: CRMConsolePanelProps) {
    const [visibleLines, setVisibleLines] = useState<number[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let currentIndex = 0;

        const interval = setInterval(() => {
            setVisibleLines((prev) => {
                const newLines = [...prev, currentIndex % CRM_LOG_EVENTS.length];
                if (newLines.length > 5) {
                    return newLines.slice(-5);
                }
                return newLines;
            });
            currentIndex++;
        }, 1800);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <div className="console-panel" style={style}>
                <span className="console-label">CRM PIPELINE</span>
                <div className="console-line">
                    <span className="console-prefix">&gt;</span>
                    <span className="console-event">system.init</span>
                    <span className="console-status">loading</span>
                </div>
            </div>
        );
    }

    return (
        <div className="console-panel" style={style}>
            <span className="console-label">CRM PIPELINE</span>
            {visibleLines.map((eventIndex, i) => {
                const event = CRM_LOG_EVENTS[eventIndex];
                const isLatest = i === visibleLines.length - 1;
                return (
                    <div
                        key={`${eventIndex}-${i}`}
                        className={`console-line ${isLatest ? "console-line-active" : ""}`}
                        style={{
                            opacity: isLatest ? 1 : 0.5 - (visibleLines.length - 1 - i) * 0.1,
                        }}
                    >
                        <span className="console-prefix">&gt;</span>
                        <span className="console-event">{event.label}</span>
                        <span
                            className="console-status"
                            style={{
                                color:
                                    event.status === "confirmed" || event.status === "complete"
                                        ? "var(--status-active)"
                                        : "var(--text-secondary)",
                            }}
                        >
                            {event.status}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

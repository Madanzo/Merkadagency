"use client";

import { useEffect, useState } from "react";

/**
 * Predefined log events - deterministic, no randomness
 */
const LOG_EVENTS = [
    { type: "ingest", label: "ingest.lead", status: "received" },
    { type: "qualify", label: "qualify.intent", status: "high" },
    { type: "route", label: "route.owner", status: "assigned" },
    { type: "followup", label: "followup.sms", status: "sent" },
    { type: "followup", label: "followup.email", status: "queued" },
    { type: "track", label: "track.open", status: "confirmed" },
    { type: "qualify", label: "qualify.score", status: "85" },
    { type: "route", label: "route.calendar", status: "available" },
    { type: "booked", label: "booked.call", status: "confirmed" },
    { type: "system", label: "system.ready", status: "active" },
];

/**
 * ConsolePanel - Animated system console with cycling log lines
 * 
 * Deterministic loop using setInterval. No randomness.
 * Client-only rendering to avoid hydration issues.
 */
export default function ConsolePanel({ style }: { style?: React.CSSProperties }) {
    const [visibleLines, setVisibleLines] = useState<number[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let currentIndex = 0;

        // Add lines one by one
        const interval = setInterval(() => {
            setVisibleLines((prev) => {
                const newLines = [...prev, currentIndex % LOG_EVENTS.length];
                // Keep only last 5 lines visible
                if (newLines.length > 5) {
                    return newLines.slice(-5);
                }
                return newLines;
            });
            currentIndex++;
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Render placeholder on server to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="console-panel" style={style}>
                <span className="console-label">CONSOLE</span>
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
            <span className="console-label">CONSOLE</span>
            {visibleLines.map((eventIndex, i) => {
                const event = LOG_EVENTS[eventIndex];
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
                                    event.status === "confirmed" || event.status === "active"
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

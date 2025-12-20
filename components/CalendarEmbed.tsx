"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        Cal?: {
            (action: string, ...args: unknown[]): void;
            ns?: Record<string, (action: string, ...args: unknown[]) => void>;
            q?: unknown[];
            loaded?: boolean;
        };
    }
}

interface CalendarEmbedProps {
    style?: React.CSSProperties;
}

/**
 * CalendarEmbed - Inline Cal.com calendar widget
 * 
 * Embeds the Cal.com scheduling calendar for booking calls.
 */
export default function CalendarEmbed({ style }: CalendarEmbedProps) {
    useEffect(() => {
        // Load Cal.com embed script
        (function (C: Window, A: string, L: string) {
            const p = function (a: { q: unknown[] }, ar: unknown) {
                a.q.push(ar);
            };
            const d = C.document;
            C.Cal =
                C.Cal ||
                function (...args: unknown[]) {
                    const cal = C.Cal!;
                    if (!cal.loaded) {
                        cal.ns = {};
                        cal.q = cal.q || [];
                        const script = d.createElement("script");
                        script.src = A;
                        d.head.appendChild(script);
                        cal.loaded = true;
                    }
                    if (args[0] === L) {
                        const api = function (...apiArgs: unknown[]) {
                            p(api as unknown as { q: unknown[] }, apiArgs);
                        };
                        const namespace = args[1] as string;
                        (api as unknown as { q: unknown[] }).q = [];
                        if (typeof namespace === "string") {
                            const nsRecord = cal.ns as Record<string, unknown>;
                            nsRecord[namespace] = nsRecord[namespace] || api;
                            p(nsRecord[namespace] as unknown as { q: unknown[] }, args);
                            p(cal as unknown as { q: unknown[] }, ["initNamespace", namespace]);
                        } else {
                            p(cal as unknown as { q: unknown[] }, args);
                        }
                        return;
                    }
                    p(cal as unknown as { q: unknown[] }, args);
                };
        })(window, "https://app.cal.com/embed/embed.js", "init");

        // Initialize Cal
        window.Cal!("init", "merkadagency", { origin: "https://app.cal.com" });

        // Create inline embed
        const calNs = window.Cal?.ns as Record<string, ((action: string, config: object) => void) | undefined> | undefined;
        if (calNs?.merkadagency) {
            calNs.merkadagency("inline", {
                elementOrSelector: "#cal-inline-merkadagency",
                config: { layout: "month_view" },
                calLink: "camilo-reyna-ny2tuw/merkadagency",
            });

            // Configure UI
            calNs.merkadagency("ui", {
                hideEventTypeDetails: false,
                layout: "month_view",
            });
        }
    }, []);

    return (
        <div
            style={{
                width: "100%",
                minHeight: "600px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                ...style,
            }}
        >
            <div
                id="cal-inline-merkadagency"
                style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "600px",
                }}
            />
        </div>
    );
}

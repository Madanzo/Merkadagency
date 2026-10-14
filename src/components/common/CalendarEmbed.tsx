/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

interface CalendarEmbedProps {
    calLink: string;
    className?: string;
}

declare global {
    interface Window {
        Cal?: {
            (action: string, ...args: unknown[]): void;
            ns?: Record<string, unknown>;
            loaded?: boolean;
            q?: unknown[];
        };
    }
}

/**
 * CalendarEmbed - Embeds a Cal.com inline widget
 */
export function CalendarEmbed({ calLink, className = '' }: CalendarEmbedProps) {
    const calRef = useRef<HTMLDivElement>(null);
    const [activated, setActivated] = useState(false);

    useEffect(() => {
        if (!activated) return;
        (function (C: any, A: string, L: string) {
            const p = function (a: any, ar: any) { a.q.push(ar); };
            const d = C.document;
            C.Cal = C.Cal || function (...args: any[]) {
                const cal = C.Cal;
                const ar = args;
                if (!cal.loaded) {
                    cal.ns = {};
                    cal.q = cal.q || [];
                    d.head.appendChild(d.createElement("script")).src = A;
                    cal.loaded = true;
                }
                if (ar[0] === L) {
                    const api = function (...args: any[]) { p(api, args); };
                    const namespace = ar[1];
                    api.q = api.q || [];
                    if (typeof namespace === "string") {
                        cal.ns[namespace] = cal.ns[namespace] || api;
                        p(cal.ns[namespace], ar);
                        p(cal, ["initNamespace", namespace]);
                    } else p(cal, ar);
                    return;
                }
                p(cal, ar);
            };
        })(window, "https://app.cal.com/embed/embed.js", "init");

        window.Cal!("init", { origin: "https://app.cal.com" });

        window.Cal!("inline", {
            elementOrSelector: calRef.current!,
            calLink: calLink,
            layout: "month_view",
            config: {
                theme: "dark",
            },
        });

        window.Cal!("ui", {
            theme: "dark",
            styles: {
                branding: { brandColor: "#8B5CF6" },
            },
            hideEventTypeDetails: false,
        });

    }, [calLink, activated]);

    if (!activated) return <div className="p-8 text-center"><p>Open the external scheduling calendar to view available times. A booking is confirmed by the calendar provider.</p><button className="public-button" type="button" onClick={()=>setActivated(true)}>Load scheduling calendar</button><p className="mt-4"><a href={`https://cal.com/${calLink}`} target="_blank" rel="noopener noreferrer">Open calendar in a new tab ↗</a></p></div>;
    return (
        <div role="region" aria-label="Scheduling calendar"><div
            ref={calRef}
            className={`min-h-[600px] w-full rounded-xl overflow-hidden bg-merkad-bg-secondary ${className}`}
            data-cal-link={calLink}
        /><p className="p-4 text-center"><a href={`https://cal.com/${calLink}`} target="_blank" rel="noopener noreferrer">If the calendar does not load, open it in a new tab ↗</a></p></div>
    );
}

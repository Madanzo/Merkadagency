/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

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
    const scriptLoaded = useRef(false);

    useEffect(() => {
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

        window.Cal!("init", "merkadagency", { origin: "https://app.cal.com" });

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

    }, [calLink]);

    return (
        <div
            ref={calRef}
            className={`min-h-[600px] w-full rounded-xl overflow-hidden bg-merkad-bg-secondary ${className}`}
            data-cal-link={calLink}
        />
    );
}

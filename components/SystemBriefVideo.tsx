"use client";

import { useState, useRef, useEffect } from "react";

// Declare gtag on window for TypeScript
declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

const VIDEO_URL =
    "https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Merkadagency%20video.mp4?alt=media&token=8f751477-b305-4e69-a9ae-a5129a670750";

interface SystemBriefVideoProps {
    style?: React.CSSProperties;
}

/**
 * SystemBriefVideo - Inline video player for hero section
 * 
 * Features:
 * - Click-to-play only (no autoplay)
 * - Starts muted
 * - Lazy loading (video not fetched until play)
 * - Error handling with retry
 * - Subtle glow while playing
 */
export default function SystemBriefVideo({ style }: SystemBriefVideoProps) {
    const [state, setState] = useState<"poster" | "playing" | "paused" | "ended" | "error">("poster");
    const [mounted, setMounted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setMounted(true);
        // Fire view event on mount
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "system_brief_view");
        }
    }, []);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setState("playing");
            // Fire play event
            if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "system_brief_play");
            }
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setState("paused");
        }
    };

    const handleEnded = () => {
        setState("ended");
        // Fire complete event
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "system_brief_complete");
        }
    };

    const handleError = () => {
        setState("error");
    };

    const handleRetry = () => {
        setState("poster");
    };

    // SSR placeholder
    if (!mounted) {
        return (
            <div
                style={{
                    aspectRatio: "16/9",
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...style,
                }}
            >
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Loading...</span>
            </div>
        );
    }

    // Error state
    if (state === "error") {
        return (
            <div
                style={{
                    aspectRatio: "16/9",
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    ...style,
                }}
            >
                <span style={{ color: "var(--text-muted)", fontSize: "0.6875rem", fontFamily: "monospace" }}>
                    SYSTEM BRIEF unavailable
                </span>
                <button
                    onClick={handleRetry}
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--text-secondary)",
                        fontSize: "0.625rem",
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                position: "relative",
                aspectRatio: "16/9",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                overflow: "hidden",
                boxShadow: state === "playing" ? "0 0 20px rgba(90, 39, 255, 0.25)" : "none",
                transition: "box-shadow 0.3s ease",
                ...style,
            }}
        >
            {/* Video element - only loads src when not in poster state */}
            <video
                ref={videoRef}
                src={state !== "poster" ? VIDEO_URL : undefined}
                muted
                playsInline
                preload="metadata"
                controls={state !== "poster"}
                onEnded={handleEnded}
                onError={handleError}
                onPause={() => state === "playing" && setState("paused")}
                onPlay={() => setState("playing")}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: state === "poster" ? "none" : "block",
                }}
            />

            {/* Poster state - click to play */}
            {(state === "poster" || state === "ended") && (
                <button
                    onClick={handlePlay}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "var(--bg-surface)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                    }}
                >
                    {/* Label */}
                    <span
                        style={{
                            fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                            fontSize: "0.625rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                        }}
                    >
                        {state === "ended" ? "REPLAY · 20s" : "SYSTEM BRIEF · 20s"}
                    </span>

                    {/* Play button */}
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "rgba(90, 39, 255, 0.15)",
                            border: "1px solid rgba(90, 39, 255, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.2s ease, transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(90, 39, 255, 0.25)";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(90, 39, 255, 0.15)";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            style={{ marginLeft: "2px" }}
                        >
                            <path
                                d="M4 2.5L13 8L4 13.5V2.5Z"
                                fill="#5A27FF"
                            />
                        </svg>
                    </div>
                </button>
            )}
        </div>
    );
}

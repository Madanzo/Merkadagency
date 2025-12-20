"use client";

import { useState, useRef, useEffect, useCallback } from "react";

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
 * SystemBriefVideo - Autoplay looping video for hero section
 * 
 * Features:
 * - Autoplay with loop
 * - Starts muted (required for autoplay)
 * - Sound toggle button
 * - Click to expand (website fullscreen modal)
 * - Error handling with retry
 * - Subtle glow while playing
 */
export default function SystemBriefVideo({ style }: SystemBriefVideoProps) {
    const [isMuted, setIsMuted] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isHoveringSound, setIsHoveringSound] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setMounted(true);
        // Fire view event on mount
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "system_brief_view");
        }
    }, []);

    // Handle Escape key to close expanded view
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isExpanded) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener("keydown", handleKeyDown);
            // Prevent body scroll when expanded
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isExpanded]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            const newMutedState = !isMuted;
            videoRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
            // Fire analytics event
            if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", newMutedState ? "system_brief_mute" : "system_brief_unmute");
            }
        }
    }, [isMuted]);

    const handleExpand = () => {
        setIsExpanded(true);
        // Auto-unmute when expanding
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
        }
        // Fire analytics event
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "system_brief_expand");
        }
    };

    const handleClose = () => {
        setIsExpanded(false);
        // Re-mute when closing
        if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    };

    const handleError = () => {
        setHasError(true);
    };

    const handleRetry = () => {
        setHasError(false);
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play();
        }
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
    if (hasError) {
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

    // Sound toggle button component (reused in both views)
    const SoundButton = ({ size = 36 }: { size?: number }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggleMute();
            }}
            onMouseEnter={() => setIsHoveringSound(true)}
            onMouseLeave={() => setIsHoveringSound(false)}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            style={{
                position: "absolute",
                bottom: isExpanded ? "24px" : "12px",
                right: isExpanded ? "24px" : "12px",
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                background: isHoveringSound ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s ease, transform 0.2s ease",
                transform: isHoveringSound ? "scale(1.1)" : "scale(1)",
                zIndex: 10,
            }}
        >
            {isMuted ? (
                <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            ) : (
                <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
            )}
        </button>
    );

    return (
        <>
            {/* Normal inline view */}
            <div
                onClick={handleExpand}
                style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    overflow: "hidden",
                    boxShadow: "0 0 20px rgba(90, 39, 255, 0.15)",
                    transition: "box-shadow 0.3s ease",
                    cursor: "pointer",
                    ...style,
                }}
            >
                {/* Video element - autoplay, loop, muted */}
                <video
                    ref={videoRef}
                    src={VIDEO_URL}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    onError={handleError}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />

                <SoundButton />

                {/* Label overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                        fontSize: "0.5625rem",
                        color: "rgba(255, 255, 255, 0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        background: "rgba(0, 0, 0, 0.4)",
                        padding: "4px 8px",
                        borderRadius: "var(--radius-sm)",
                    }}
                >
                    SYSTEM BRIEF
                </div>

                {/* Expand hint */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                        fontSize: "0.5rem",
                        color: "rgba(255, 255, 255, 0.4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    Click to expand
                </div>
            </div>

            {/* Expanded fullscreen modal overlay */}
            {isExpanded && (
                <div
                    onClick={handleClose}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.95)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        animation: "fadeIn 0.3s ease-out",
                    }}
                >
                    {/* Video container */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "relative",
                            width: "90vw",
                            maxWidth: "1400px",
                            aspectRatio: "16/9",
                            cursor: "default",
                            animation: "techReveal 0.6s ease-out forwards, glitchFlash 0.8s ease-out",
                            overflow: "hidden",
                            borderRadius: "var(--radius-md)",
                        }}
                    >
                        {/* Scan line overlay */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                height: "4px",
                                background: "linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.6), transparent)",
                                animation: "scanLine 0.4s linear",
                                pointerEvents: "none",
                                zIndex: 20,
                            }}
                        />
                        <video
                            src={VIDEO_URL}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                borderRadius: "var(--radius-md)",
                            }}
                        />

                        <SoundButton size={48} />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            aria-label="Close video"
                            style={{
                                position: "absolute",
                                top: "-48px",
                                right: "0",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        {/* Label */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-48px",
                                left: "0",
                                fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                                fontSize: "0.6875rem",
                                color: "rgba(255, 255, 255, 0.6)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}
                        >
                            SYSTEM BRIEF
                        </div>

                        {/* Escape hint */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "-36px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontFamily: "'SF Mono', 'Monaco', 'Consolas', monospace",
                                fontSize: "0.625rem",
                                color: "rgba(255, 255, 255, 0.3)",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Press ESC or click outside to close
                        </div>
                    </div>
                </div>
            )}

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes techReveal {
                    0% {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                        clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
                        filter: brightness(2) saturate(0);
                    }
                    15% {
                        opacity: 1;
                        clip-path: polygon(0 0, 100% 0, 100% 15%, 0 15%);
                        filter: brightness(1.5) saturate(0.5);
                    }
                    30% {
                        clip-path: polygon(0 0, 100% 0, 100% 35%, 0 30%);
                        transform: scale(0.97) translateY(5px) translateX(-2px);
                        filter: brightness(1.2) saturate(0.7);
                    }
                    45% {
                        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 48%);
                        transform: scale(0.98) translateY(3px) translateX(2px);
                    }
                    60% {
                        clip-path: polygon(0 0, 100% 0, 100% 70%, 0 68%);
                        transform: scale(0.99) translateY(2px) translateX(-1px);
                        filter: brightness(1.1) saturate(0.9);
                    }
                    75% {
                        clip-path: polygon(0 0, 100% 0, 100% 88%, 0 85%);
                        transform: scale(1) translateY(1px);
                    }
                    90% {
                        clip-path: polygon(0 0, 100% 0, 100% 98%, 0 96%);
                        filter: brightness(1.05) saturate(1);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0) translateX(0);
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                        filter: brightness(1) saturate(1);
                    }
                }
                @keyframes glitchFlash {
                    0%, 100% {
                        box-shadow: 0 0 0 rgba(90, 39, 255, 0);
                    }
                    10% {
                        box-shadow: 0 0 60px rgba(90, 39, 255, 0.8), inset 0 0 30px rgba(0, 255, 255, 0.3);
                    }
                    20% {
                        box-shadow: 0 0 20px rgba(255, 0, 128, 0.5), inset 0 0 10px rgba(90, 39, 255, 0.2);
                    }
                    30% {
                        box-shadow: 0 0 40px rgba(0, 255, 255, 0.6), 0 0 80px rgba(90, 39, 255, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(90, 39, 255, 0.5);
                    }
                    70% {
                        box-shadow: 0 0 50px rgba(90, 39, 255, 0.3), 0 0 100px rgba(0, 255, 255, 0.2);
                    }
                }
                @keyframes scanLine {
                    0% {
                        top: -10%;
                    }
                    100% {
                        top: 110%;
                    }
                }
            `}</style>
        </>
    );
}

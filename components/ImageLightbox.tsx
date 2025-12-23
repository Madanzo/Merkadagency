"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * ImageLightbox Component
 * Renders a clickable thumbnail that opens a full-size modal on click.
 * - Click backdrop or X to close
 * - ESC key to close
 * - Subtle fade-in animation
 */
export default function ImageLightbox({ src, alt, className, style }: ImageLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure portal only renders on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle ESC key to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    const openLightbox = () => setIsOpen(true);
    const closeLightbox = () => setIsOpen(false);

    return (
        <>
            {/* Thumbnail */}
            <img
                src={src}
                alt={alt}
                className={className}
                style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "auto",
                    display: "block",
                    ...style,
                }}
                onClick={openLightbox}
            />

            {/* Modal via Portal */}
            {mounted && isOpen && createPortal(
                <div
                    className="lightbox-overlay"
                    onClick={closeLightbox}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "2rem",
                        animation: "lightboxFadeIn 150ms ease-out",
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                        style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "1.25rem",
                            transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
                    >
                        ✕
                    </button>

                    {/* Full-size Image */}
                    <img
                        src={src}
                        alt={alt}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "calc(100vw - 4rem)",
                            maxHeight: "calc(100vh - 4rem)",
                            objectFit: "contain",
                            borderRadius: "var(--radius-md, 8px)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        }}
                    />

                    {/* Inline keyframes for fade-in */}
                    <style jsx global>{`
                        @keyframes lightboxFadeIn {
                            from {
                                opacity: 0;
                            }
                            to {
                                opacity: 1;
                            }
                        }
                    `}</style>
                </div>,
                document.body
            )}
        </>
    );
}

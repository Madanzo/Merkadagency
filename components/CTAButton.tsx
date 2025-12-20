"use client";

import Link from "next/link";
import { trackCTAClick } from "@/lib/analytics";
import { ReactNode } from "react";

interface CTAButtonProps {
    location: string;
    children?: ReactNode;
    style?: React.CSSProperties;
}

/**
 * CTAButton - Primary CTA Component (System Pattern)
 * 
 * The ONLY visually emphasized element.
 * Always routes to /book. Always uses btn-primary styling.
 * 
 * Rules:
 * - One per section
 * - Same wording per page
 * - No secondary styles
 * 
 * @example
 * <CTAButton location="hero">Book Consultation</CTAButton>
 */
export default function CTAButton({
    location,
    children = "Book Consultation",
    style,
}: CTAButtonProps) {
    return (
        <Link
            href="/book"
            className="btn-primary"
            onClick={() => trackCTAClick(location)}
            style={style}
        >
            {children}
        </Link>
    );
}

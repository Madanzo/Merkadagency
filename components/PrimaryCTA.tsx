"use client";

import Link from "next/link";
import { trackCTAClick } from "@/lib/analytics";
import { ReactNode } from "react";

interface PrimaryCTAProps {
    location: string;
    children?: ReactNode;
    style?: React.CSSProperties;
}

/**
 * PrimaryCTA - The ONLY visually emphasized element (System Pattern)
 * 
 * Rules:
 * - Always routes to /book
 * - One per section
 * - Same wording per page
 * - No secondary CTA styles allowed
 * 
 * @example
 * <PrimaryCTA location="hero">Book Consultation</PrimaryCTA>
 */
export default function PrimaryCTA({
    location,
    children = "Book Consultation",
    style,
}: PrimaryCTAProps) {
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

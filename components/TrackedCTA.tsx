"use client";

import Link from "next/link";
import { trackCTAClick } from "@/lib/analytics";
import { ReactNode } from "react";

interface TrackedCTAProps {
    href: string;
    location: string;
    className?: string;
    style?: React.CSSProperties;
    children: ReactNode;
}

export default function TrackedCTA({
    href,
    location,
    className,
    style,
    children,
}: TrackedCTAProps) {
    const handleClick = () => {
        trackCTAClick(location);
    };

    return (
        <Link href={href} className={className} style={style} onClick={handleClick}>
            {children}
        </Link>
    );
}

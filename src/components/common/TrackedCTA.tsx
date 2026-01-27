import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface TrackedCTAProps {
    to: string;
    buttonName: string;
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
    showArrow?: boolean;
}

/**
 * TrackedCTA - A CTA button component
 * Note: Tracking is handled by Google Analytics via gtag
 */
export function TrackedCTA({
    to,
    buttonName,
    children,
    variant = 'primary',
    className = '',
    showArrow = true,
}: TrackedCTAProps) {

    const baseStyles = 'inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-300';
    const variantStyles = {
        primary: 'bg-gradient-purple text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 btn-arrow',
        secondary: 'bg-merkad-bg-tertiary text-white border border-merkad-border hover:bg-merkad-bg-elevated',
    };

    return (
        <Link
            to={to}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
            {showArrow && <ArrowRight className="w-5 h-5" />}
        </Link>
    );
}

'use client';

import { cn } from '@/lib/utils';

interface TechGridProps {
  className?: string;
  opacity?: number;
}

/**
 * Tech Grid - Decorative background grid pattern
 * Renders a subtle grid pattern that gives a technical, futuristic feel
 */
export function TechGrid({ className, opacity = 0.1 }: TechGridProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
      style={{ opacity }}
    >
      {/* Horizontal lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent"
            style={{ top: `${(i * 100) / 20}%` }}
          />
        ))}
      </div>

      {/* Vertical lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet/30 to-transparent"
            style={{ left: `${(i * 100) / 20}%` }}
          />
        ))}
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-ink" />
    </div>
  );
}

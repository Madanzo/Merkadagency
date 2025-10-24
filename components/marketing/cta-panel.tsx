'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CtaPanelProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref?: string;
  primaryButtonOnClick?: () => void;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonOnClick?: () => void;
  className?: string;
}

/**
 * CtaPanel - Call-to-action panel
 * Used at the end of pages to drive conversions
 */
export function CtaPanel({
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonHref,
  secondaryButtonOnClick,
  className,
}: CtaPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        'glass-card relative overflow-hidden rounded-2xl p-8 md:p-12',
        'animate-glow-pulse',
        className
      )}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet/20 via-pink/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="gradient-text mb-4 text-3xl font-bold md:text-4xl">
          {title}
        </h2>
        <p className="mb-8 text-lg text-graycool">{description}</p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-gradient-to-tr from-violet to-purple-400 text-white shadow-glow hover:shadow-glow-soft hover:-translate-y-0.5 transition-all duration-200"
            onClick={primaryButtonOnClick}
            asChild={!!primaryButtonHref}
          >
            {primaryButtonHref ? (
              <a href={primaryButtonHref}>{primaryButtonText}</a>
            ) : (
              <span>{primaryButtonText}</span>
            )}
          </Button>

          {secondaryButtonText && (
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-pink text-pink hover:bg-pink/10"
              onClick={secondaryButtonOnClick}
              asChild={!!secondaryButtonHref}
            >
              {secondaryButtonHref ? (
                <a href={secondaryButtonHref}>{secondaryButtonText}</a>
              ) : (
                <span>{secondaryButtonText}</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricStat } from './metric-stat';
import { TechGrid } from '@/components/decorative/tech-grid';
import { Particles } from '@/components/decorative/particles';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryButtonText: string;
  primaryButtonHref?: string;
  primaryButtonOnClick?: () => void;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonOnClick?: () => void;
  trustBadges?: string[];
  metrics?: Array<{
    value: string | number;
    label: string;
    suffix?: string;
    prefix?: string;
  }>;
  className?: string;
}

/**
 * Hero - Main hero section for homepage
 * Features gradient headline, CTA buttons, trust badges, and metrics
 */
export function Hero({
  headline,
  subheadline,
  primaryButtonText,
  primaryButtonHref,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonHref,
  secondaryButtonOnClick,
  trustBadges = [],
  metrics = [],
  className,
}: HeroProps) {
  return (
    <section className={cn('relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24', className)}>
      {/* Background effects */}
      <TechGrid opacity={0.05} />
      <Particles count={30} color="rgba(90, 39, 255, 0.4)" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            {/* Headline */}
            <h1 className="gradient-text mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-lg text-graycool md:text-xl">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-tr from-violet to-purple-400 text-white shadow-glow hover:shadow-glow-soft hover:-translate-y-0.5 transition-all duration-200 group"
                onClick={primaryButtonOnClick}
                asChild={!!primaryButtonHref}
              >
                {primaryButtonHref ? (
                  <a href={primaryButtonHref} className="flex items-center">
                    {primaryButtonText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                ) : (
                  <span className="flex items-center">
                    {primaryButtonText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
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

            {/* Trust badges */}
            {trustBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-wrap gap-2"
              >
                {trustBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    {badge}
                  </Badge>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right column: Tech Card with Metrics */}
          {metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="glass-card w-full max-w-md rounded-2xl p-8 shadow-soft-lg">
                <h3 className="mb-6 text-center text-xl font-semibold text-white">
                  Platform Metrics
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <MetricStat
                      key={index}
                      value={metric.value}
                      label={metric.label}
                      suffix={metric.suffix}
                      prefix={metric.prefix}
                      animate={true}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}

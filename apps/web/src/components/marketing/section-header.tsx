'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

/**
 * SectionHeader - Consistent section heading component
 * Used across all marketing pages for visual consistency
 */
export function SectionHeader({
  title,
  subtitle,
  description,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={cn(
        'mb-12 md:mb-16',
        centered && 'text-center',
        className
      )}
    >
      {subtitle && (
        <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet">
          {subtitle}
        </div>
      )}
      <h2 className="gradient-text mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl text-lg text-graycool">
          {description}
        </p>
      )}
    </motion.div>
  );
}

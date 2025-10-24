'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
  isLast?: boolean;
  className?: string;
}

/**
 * TimelineStep - Process timeline step component
 * Used in process/how-it-works sections
 */
export function TimelineStep({
  icon: Icon,
  title,
  description,
  step,
  isLast = false,
  className,
}: TimelineStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      className={cn('relative', className)}
    >
      {/* Mobile: vertical line on left */}
      {!isLast && (
        <div className="absolute left-6 top-16 h-full w-px bg-gradient-to-b from-violet/50 to-transparent md:hidden" />
      )}

      {/* Desktop: horizontal line */}
      {!isLast && (
        <div className="absolute left-1/2 top-6 hidden h-px w-full bg-gradient-to-r from-violet/50 to-transparent md:block" />
      )}

      <div className="flex flex-col items-start md:items-center">
        {/* Step number and icon */}
        <div className="relative z-10 mb-4 flex items-center gap-4 md:flex-col md:gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet to-purple-400 shadow-glow">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/20 text-sm font-bold text-violet">
            {step}
          </div>
        </div>

        {/* Content */}
        <div className="pl-16 md:pl-0 md:text-center">
          <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
          <p className="text-graycool">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

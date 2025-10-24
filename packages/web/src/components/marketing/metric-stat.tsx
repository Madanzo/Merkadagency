'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MetricStatProps {
  value: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
  animate?: boolean;
  className?: string;
}

/**
 * MetricStat - Animated metric/statistic display
 * Used in hero section and stats sections
 */
export function MetricStat({
  value,
  label,
  suffix = '',
  prefix = '',
  animate = true,
  className,
}: MetricStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/\D/g, ''), 10);

  useEffect(() => {
    if (!animate || isNaN(numericValue)) {
      return;
    }

    let start = 0;
    const end = numericValue;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue, animate]);

  const finalValue = animate && !isNaN(numericValue) ? displayValue : value;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn('text-center', className)}
    >
      <div className="gradient-text-violet mb-2 text-3xl font-bold md:text-4xl">
        {prefix}
        {finalValue}
        {suffix}
      </div>
      <div className="text-sm text-graycool">{label}</div>
    </motion.div>
  );
}

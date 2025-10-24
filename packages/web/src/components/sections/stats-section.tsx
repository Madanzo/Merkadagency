'use client';

import { motion } from 'framer-motion';
import { MetricStat } from '@/components/marketing/metric-stat';
import { container, sectionSpacing } from '@/lib/theme';
import { cn } from '@/lib/utils';

const stats = [
  { value: 250, suffix: '+', label: 'Projects Delivered' },
  { value: 3, suffix: 'x', label: 'Average ROI Increase' },
  { value: 95, suffix: '%', label: 'Client Satisfaction' },
  { value: 48, suffix: 'h', label: 'Average Turnaround' },
];

export function StatsSection() {
  return (
    <section className={cn('relative bg-ink', sectionSpacing)}>
      <div className={container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card-violet rounded-2xl p-8 md:p-12"
        >
          <div className="mb-8 text-center">
            <h2 className="gradient-text mb-4 text-3xl font-bold md:text-4xl">
              Results That Speak
            </h2>
            <p className="text-lg text-graycool">
              Real numbers from real businesses we've helped grow.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <MetricStat key={index} {...stat} animate={true} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

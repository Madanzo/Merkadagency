'use client';

import { Search, FileText, Rocket, TrendingUp } from 'lucide-react';
import { SectionHeader } from '@/components/marketing/section-header';
import { TimelineStep } from '@/components/marketing/timeline-step';
import { container, sectionSpacing } from '@/lib/theme';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: Search,
    title: 'Audit',
    description: 'We analyze your current digital presence, identify gaps, and uncover opportunities for growth.',
  },
  {
    icon: FileText,
    title: 'Plan',
    description: 'Create a data-driven roadmap with clear milestones, timelines, and success metrics.',
  },
  {
    icon: Rocket,
    title: 'Implement',
    description: 'Execute the strategy with our expert team, leveraging AI tools for maximum efficiency.',
  },
  {
    icon: TrendingUp,
    title: 'Optimize',
    description: 'Continuously monitor, test, and refine to ensure sustained growth and ROI.',
  },
];

export function ProcessSection() {
  return (
    <section className={cn('relative bg-ink-dark', sectionSpacing)}>
      <div className={container}>
        <SectionHeader
          subtitle="Our Process"
          title="How We Work"
          description="A proven methodology to transform your digital presence in 4 simple steps."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              {...step}
              step={index + 1}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

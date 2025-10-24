'use client';

import { Zap, Globe, Mail, FileText, Bot } from 'lucide-react';
import { SectionHeader } from '@/components/marketing/section-header';
import { ServiceCard } from '@/components/marketing/service-card';
import { container, sectionSpacing } from '@/lib/theme';
import { cn } from '@/lib/utils';

const services = [
  {
    icon: Zap,
    title: 'AI Lead Capture',
    description: 'Convert website visitors into qualified leads with intelligent chatbots and personalized experiences.',
    features: [
      'Real-time visitor engagement',
      'Qualification automation',
      'CRM integration',
    ],
  },
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Custom, high-performance websites built for conversions and optimized for search engines.',
    features: [
      'Modern tech stack',
      'Mobile-first design',
      'Lightning-fast performance',
    ],
  },
  {
    icon: Mail,
    title: 'CRM + Email/SMS Automation',
    description: 'Streamline your sales pipeline with automated workflows and multi-channel communication.',
    features: [
      'Automated follow-ups',
      'Multi-channel campaigns',
      'Performance analytics',
    ],
  },
  {
    icon: FileText,
    title: 'AI SEO Content',
    description: 'Rank higher with AI-generated, SEO-optimized content that drives organic traffic.',
    features: [
      'Keyword research automation',
      'Content generation',
      'On-page optimization',
    ],
  },
  {
    icon: Bot,
    title: 'Content Systems',
    description: 'Scale your content production with AI-powered workflows and brand consistency.',
    features: [
      'Automated publishing',
      'Brand voice training',
      'Multi-format output',
    ],
  },
];

export function ServicesSection() {
  return (
    <section className={cn('relative bg-ink', sectionSpacing)}>
      <div className={container}>
        <SectionHeader
          subtitle="Services"
          title="Everything You Need to Scale"
          description="Comprehensive digital solutions powered by AI to accelerate your growth."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

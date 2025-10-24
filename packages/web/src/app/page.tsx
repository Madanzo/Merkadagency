'use client';

import { Hero } from '@/components/marketing/hero';
import { ServicesSection } from '@/components/sections/services-section';
import { ProcessSection } from '@/components/sections/process-section';
import { StatsSection } from '@/components/sections/stats-section';
import { CtaPanel } from '@/components/marketing/cta-panel';
import { container, sectionSpacing } from '@/lib/theme';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        headline="AI Video Production That Respects Your Brand"
        subheadline="Transform product briefs into stunning vertical videos in minutes. Complete with storyboards, voiceover, music, and pro editing formats."
        primaryButtonText="Try Studio (Beta)"
        primaryButtonHref="/studio"
        secondaryButtonText="Book a Demo"
        secondaryButtonHref="/book"
        trustBadges={[
          'No credit card required',
          'FCPXML & EDL export',
          'Professional quality',
        ]}
        metrics={[
          { value: 5000, suffix: '+', label: 'Videos Created' },
          { value: 10, suffix: 'min', label: 'Avg. Time to Video' },
          { value: 99, suffix: '%', label: 'Brand Accuracy' },
          { value: 24, suffix: '/7', label: 'AI Availability' },
        ]}
      />

      {/* Services Section */}
      <ServicesSection />

      {/* Process Section */}
      <ProcessSection />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className={cn('relative bg-ink', sectionSpacing)}>
        <div className={container}>
          <CtaPanel
            title="Ready to Transform Your Digital Presence?"
            description="Join hundreds of businesses already scaling with MerkadAgency's AI-powered solutions."
            primaryButtonText="Get Started Free"
            primaryButtonHref="/studio"
            secondaryButtonText="Book a Discovery Call"
            secondaryButtonHref="/book"
          />
        </div>
      </section>
    </>
  );
}

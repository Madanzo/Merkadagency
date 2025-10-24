'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Mail, FileText, Bot, X } from 'lucide-react';
import { SectionHeader } from '@/components/marketing/section-header';
import { ServiceCard } from '@/components/marketing/service-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
      'Custom chat flows',
      'Analytics dashboard',
    ],
    details: 'Our AI-powered lead capture system uses natural language processing to engage visitors in real-time, qualify leads automatically, and route them to your sales team. Integrates seamlessly with your existing CRM.',
  },
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Custom, high-performance websites built for conversions and optimized for search engines.',
    features: [
      'Modern tech stack (Next.js, React)',
      'Mobile-first responsive design',
      'Lightning-fast performance',
      'SEO optimization',
      'Ongoing maintenance',
    ],
    details: 'We build blazing-fast, conversion-optimized websites using modern frameworks like Next.js and React. Every site is mobile-first, SEO-ready, and built to scale with your business.',
  },
  {
    icon: Mail,
    title: 'CRM + Email/SMS Automation',
    description: 'Streamline your sales pipeline with automated workflows and multi-channel communication.',
    features: [
      'Automated follow-ups',
      'Multi-channel campaigns (Email, SMS, WhatsApp)',
      'Performance analytics',
      'Lead scoring',
      'Pipeline management',
    ],
    details: 'Automate your entire sales and marketing funnel with intelligent workflows. From first touch to closed deal, our CRM automation ensures no lead falls through the cracks.',
  },
  {
    icon: FileText,
    title: 'AI SEO Content',
    description: 'Rank higher with AI-generated, SEO-optimized content that drives organic traffic.',
    features: [
      'Keyword research automation',
      'Content generation at scale',
      'On-page optimization',
      'Competitor analysis',
      'Performance tracking',
    ],
    details: 'Leverage AI to produce high-quality, SEO-optimized content at scale. Our system researches keywords, analyzes competitors, and generates content that ranks while maintaining your brand voice.',
  },
  {
    icon: Bot,
    title: 'Content Systems',
    description: 'Scale your content production with AI-powered workflows and brand consistency.',
    features: [
      'Automated content creation',
      'Brand voice training',
      'Multi-format output (blog, social, video)',
      'Content calendar management',
      'Quality assurance workflows',
    ],
    details: 'Build a content engine that works 24/7. Our AI-powered content systems learn your brand voice, create on-brand content across all formats, and maintain consistency at scale.',
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className={cn('relative bg-ink', 'py-16 md:py-24')}>
        <div className={container}>
          <SectionHeader
            subtitle="Our Services"
            title="Digital Solutions That Drive Growth"
            description="Comprehensive AI-powered services to transform your digital presence and accelerate your business."
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className={cn('relative bg-ink-dark', sectionSpacing)}>
        <div className={container}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={cn('relative bg-ink', sectionSpacing)}>
        <div className={container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="gradient-text mb-4 text-3xl font-bold md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-graycool">
              Book a free discovery call to discuss your specific needs.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-tr from-violet to-purple-400 text-white shadow-glow"
              asChild
            >
              <a href="/book">Book a Call</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {selectedService && (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet/20">
                    <selectedService.icon className="h-6 w-6 text-violet" />
                  </div>
                  {selectedService.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-sm font-semibold text-white">What's Included</h4>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-graycool-light">
                      <span className="mr-2 mt-0.5 text-violet">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-white">Details</h4>
                <p className="text-sm text-graycool">{selectedService.details}</p>
              </div>

              <Button
                className="w-full bg-gradient-to-tr from-violet to-purple-400"
                asChild
              >
                <a href="/book">Get Started</a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

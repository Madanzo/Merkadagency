import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Clock, MessageSquare, Users, CheckCircle2, Zap } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Instant Response',
    description: 'Every lead gets a response in under 2 minutes, even at 3am. No more cold leads.',
  },
  {
    icon: MessageSquare,
    title: 'Smart Qualification',
    description: 'AI asks the right questions to identify ready-to-buy prospects automatically.',
  },
  {
    icon: Users,
    title: 'Multi-Channel Capture',
    description: 'Capture leads from your website, social media, ads, and more—all in one place.',
  },
  {
    icon: Zap,
    title: 'CRM Integration',
    description: 'Qualified leads flow directly into your CRM with full context and history.',
  },
];

const benefits = [
  'Respond to leads 24/7 without hiring night staff',
  'Never lose a lead to slow response times',
  'Focus your team on closing, not qualifying',
  'Get full visibility into lead quality and sources',
  'Scale lead handling without scaling headcount',
];

import { NicheCallout } from '@/components/common/NicheCallout';

export default function AILeadCapture() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          {/* ... Hero Content ... */}
          {/* (Skipping internal hero details for brevity, inserting callout at end of hero section) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                AI Lead Capture
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                Never Miss Another Lead
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                Respond to every inquiry in under 2 minutes, qualify leads automatically, and send hot prospects to your team—all without lifting a finger.
              </p>

              {/* Key Metric */}
              <div className="mt-8 stats-card inline-block">
                <div className="stats-card-inner flex items-center gap-4">
                  <div className="text-4xl font-mono font-bold text-merkad-purple-light text-glow">
                    47s
                  </div>
                  <div>
                    <div className="text-white font-semibold">Average Response Time</div>
                    <div className="text-merkad-text-muted text-sm">vs. 6+ hours industry average</div>
                  </div>
                </div>
              </div>

              <Link
                to="/book"
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="browser-frame image-floating">
                {/* ... existing browser frame content ... */}
                <div className="browser-frame-header">
                  <div className="browser-frame-dot bg-red-500" />
                  <div className="browser-frame-dot bg-yellow-500" />
                  <div className="browser-frame-dot bg-green-500" />
                </div>
                <div className="p-6 bg-merkad-bg-tertiary">
                  <div className="space-y-4">
                    {/* Chat simulation */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-merkad-purple flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 max-w-xs">
                        <p className="text-sm text-white">Hi! Thanks for your interest. What service are you looking for today?</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-merkad-purple rounded-lg p-3 max-w-xs">
                        <p className="text-sm text-white">I'm interested in your facial treatments</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-merkad-purple flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 max-w-xs">
                        <p className="text-sm text-white">Great choice! When works best for you? We have availability this week.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NicheCallout />

      {/* Problem */}
      <section className="py-20 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
              The Average Business Loses 78% of Leads to Slow Response
            </h2>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              Studies show leads contacted within 5 minutes are 21x more likely to convert. But most businesses take 6+ hours to respond—if they respond at all.
            </p>
            <p className="text-merkad-purple-light mt-4 font-semibold">
              Your competitors are faster. We make you fastest.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="service-card">
                <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">{feature.title}</h3>
                <p className="text-merkad-text-secondary mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                Benefits
              </span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                What You Get
              </h2>
              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-merkad-green flex-shrink-0 mt-0.5" />
                    <span className="text-merkad-text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Study Snippet */}
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <span className="text-xs font-mono text-merkad-text-muted uppercase tracking-wider">
                  Case Study
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-3">
                  Kravings Club
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-mono font-bold text-merkad-purple-light text-glow">
                    6+ hrs
                  </span>
                  <span className="text-merkad-text-muted mb-1">→</span>
                  <span className="text-4xl font-mono font-bold text-merkad-green text-glow">
                    47s
                  </span>
                </div>
                <p className="text-merkad-text-muted text-sm mt-2">Response time improvement</p>
                <Link
                  to="/case-studies/kravings"
                  className="mt-6 inline-flex items-center gap-2 text-merkad-purple-light hover:text-white transition-colors font-medium btn-arrow"
                >
                  Read full case study
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
            Ready to Capture Every Lead?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            Book a call to see how AI Lead Capture can transform your lead response.
          </p>
          <Link
            to="/book"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
          >
            Book Discovery Call
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
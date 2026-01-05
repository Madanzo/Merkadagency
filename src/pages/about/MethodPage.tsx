import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';

const phases = [
  {
    icon: Zap,
    number: '01',
    title: 'Capture',
    description: 'Every lead captured instantly across all channels',
    details: [
      'AI-powered chat responds in under 2 minutes',
      'Multi-channel capture (web, social, ads)',
      'Smart forms that qualify on entry',
      '24/7 availability without extra staff',
    ],
  },
  {
    icon: Target,
    number: '02',
    title: 'Qualify',
    description: 'Automatically separate hot leads from tire-kickers',
    details: [
      'AI asks qualifying questions naturally',
      'Lead scoring based on responses',
      'Budget, timeline, and intent detection',
      'Only qualified leads reach your team',
    ],
  },
  {
    icon: MessageSquare,
    number: '03',
    title: 'Nurture',
    description: 'Keep leads warm until they\'re ready to buy',
    details: [
      'Automated email sequences',
      'SMS follow-ups and reminders',
      'Personalized content delivery',
      'Re-engagement campaigns',
    ],
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Convert',
    description: 'Hand off hot leads with full context for easy closing',
    details: [
      'Complete lead history and context',
      'Automatic CRM updates',
      'Calendar integration for booking',
      'Performance tracking and attribution',
    ],
  },
];

const comparison = [
  {
    aspect: 'Lead Response Time',
    traditional: '6+ hours average',
    merkadflow: 'Under 2 minutes, 24/7',
  },
  {
    aspect: 'Lead Qualification',
    traditional: 'Manual, inconsistent',
    merkadflow: 'AI-powered, instant',
  },
  {
    aspect: 'Follow-up',
    traditional: 'Depends on staff',
    merkadflow: 'Automated, never missed',
  },
  {
    aspect: 'Scalability',
    traditional: 'Hire more people',
    merkadflow: 'Unlimited, no extra cost',
  },
  {
    aspect: 'Data & Insights',
    traditional: 'Scattered, incomplete',
    merkadflow: 'Unified, actionable',
  },
];

export default function MethodPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Our Method
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mt-4">
              The{' '}
              <span className="text-gradient">MerkadFlow System™</span>
            </h1>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              A proprietary 4-phase automation framework that turns your marketing into a 24/7 revenue machine.
            </p>
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="space-y-16">
            {phases.map((phase, index) => (
              <div
                key={phase.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-primary/30">
                      <phase.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-mono text-merkad-purple-light">
                      PHASE {phase.number}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
                    {phase.title}
                  </h2>
                  <p className="text-merkad-text-secondary mt-4 text-lg">
                    {phase.description}
                  </p>
                  <div className="mt-6 space-y-3">
                    {phase.details.map((detail) => (
                      <div key={detail} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-merkad-green flex-shrink-0 mt-0.5" />
                        <span className="text-merkad-text-secondary">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="card-gradient-border">
                    <div className="card-gradient-border-inner aspect-square flex items-center justify-center">
                      <phase.icon className="w-32 h-32 text-merkad-purple/20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 lg:py-32 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Comparison
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              Traditional vs MerkadFlow
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-merkad-bg-tertiary rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-merkad-bg-elevated border-b border-white/5">
                <div className="font-semibold text-merkad-text-muted">Aspect</div>
                <div className="font-semibold text-merkad-text-muted">Traditional</div>
                <div className="font-semibold text-merkad-purple-light">MerkadFlow™</div>
              </div>
              {/* Rows */}
              {comparison.map((row, index) => (
                <div
                  key={row.aspect}
                  className={`grid grid-cols-3 gap-4 p-6 ${index !== comparison.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                >
                  <div className="font-medium text-white">{row.aspect}</div>
                  <div className="text-merkad-text-muted">{row.traditional}</div>
                  <div className="text-merkad-green font-medium">{row.merkadflow}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-merkad-purple/10 rounded-full blur-[100px]" />
        </div>
        <div className="container-custom relative text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
            Ready to Implement the MerkadFlow System?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            Book a discovery call to see how we can build this for your business.
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
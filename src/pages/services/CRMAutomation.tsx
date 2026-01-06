import { Layout } from '@/components/layout/Layout';
import { NicheCallout } from '@/components/common/NicheCallout';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, RefreshCw, BarChart3, Users, CheckCircle2, Bell } from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Automated Pipelines',
    description: 'Leads flow through stages automatically based on behavior and engagement.',
  },
  {
    icon: RefreshCw,
    title: 'Smart Follow-Up',
    description: 'Automated sequences ensure no lead falls through the cracks.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'See exactly where leads are and what is working at a glance.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Your team gets alerted only when human attention is needed.',
  },
];

const benefits = [
  'Never manually move a lead between stages again',
  'Get full visibility into your sales pipeline',
  'Automated nurture sequences keep leads warm',
  'Real-time alerts when hot leads need attention',
  'Track every interaction and touchpoint',
];

export function CRMAutomation() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                CRM Automation
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                Your Pipeline, On Autopilot
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                Stop babysitting your CRM. Leads move through stages, follow-ups send automatically, and your team focuses on closing—not clicking.
              </p>

              {/* Key Metric */}
              <div className="mt-8 stats-card inline-block">
                <div className="stats-card-inner flex items-center gap-4">
                  <div className="text-4xl font-mono font-bold text-merkad-purple-light text-glow">
                    0
                  </div>
                  <div>
                    <div className="text-white font-semibold">Manual Follow-Ups</div>
                    <div className="text-merkad-text-muted text-sm">Everything runs automatically</div>
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
                <div className="browser-frame-header">
                  <div className="browser-frame-dot bg-red-500" />
                  <div className="browser-frame-dot bg-yellow-500" />
                  <div className="browser-frame-dot bg-green-500" />
                </div>
                <div className="p-6 bg-merkad-bg-tertiary">
                  <div className="space-y-3">
                    {/* Pipeline visualization */}
                    <div className="flex gap-2">
                      {['New', 'Qualified', 'Proposal', 'Closed'].map((stage, i) => (
                        <div key={stage} className="flex-1 text-center">
                          <div className={`h-2 rounded-full mb-2 ${i === 2 ? 'bg-merkad-purple' : 'bg-merkad-bg-elevated'}`} />
                          <span className="text-xs text-merkad-text-muted">{stage}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      {[
                        { name: 'Sarah M.', stage: 'Proposal', value: '$2,400' },
                        { name: 'John D.', stage: 'Qualified', value: '$1,800' },
                        { name: 'Emma L.', stage: 'New', value: '$3,200' },
                      ].map((lead) => (
                        <div key={lead.name} className="flex items-center justify-between bg-merkad-bg-elevated rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-merkad-purple/20 flex items-center justify-center">
                              <Users className="w-4 h-4 text-merkad-purple-light" />
                            </div>
                            <span className="text-sm text-white">{lead.name}</span>
                          </div>
                          <span className="text-sm font-mono text-merkad-green">{lead.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
              Your Team Spends 40% of Their Day on Manual CRM Tasks
            </h2>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              Moving leads between stages, sending follow-ups, updating notes—it's busywork that kills productivity and lets deals slip through.
            </p>
            <p className="text-merkad-purple-light mt-4 font-semibold">
              What if every step happened automatically?
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
                  Teonanacatl
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-mono font-bold text-merkad-purple-light text-glow">
                    100%
                  </span>
                  <span className="text-merkad-text-muted ml-2">automated follow-ups</span>
                </div>
                <p className="text-merkad-text-muted text-sm mt-2">From zero systems to full CRM automation</p>
                <Link
                  to="/case-studies/teonanacatl"
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
            Ready to Automate Your Pipeline?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            Book a call to see how CRM Automation can free your team to focus on closing.
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

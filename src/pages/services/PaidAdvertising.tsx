import { Layout } from '@/components/layout/Layout';
import { NicheCallout } from '@/components/common/NicheCallout';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, DollarSign, TrendingUp, Layers, CheckCircle2, Eye } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Precision Targeting',
    description: 'Reach your exact ideal client with advanced audience segmentation.',
  },
  {
    icon: DollarSign,
    title: 'ROAS Optimization',
    description: 'Every dollar tracked. Constant optimization for maximum return.',
  },
  {
    icon: Layers,
    title: 'Multi-Platform',
    description: 'Google Ads, Meta, Instagram—we go where your clients are.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description: 'Real-time dashboards show exactly how your budget performs.',
  },
];

const benefits = [
  'Qualified traffic from day one',
  'Stop wasting money on clicks that do not convert',
  'Full-funnel tracking from ad to booking',
  'A/B testing to continuously improve results',
  'Monthly strategy calls to review and optimize',
];

export function PaidAdvertising() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                Paid Advertising
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                Turn Ad Spend Into Revenue
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                Precision-targeted campaigns that bring qualified leads directly to your door. No wasted spend, just results.
              </p>

              {/* Key Metric */}
              <div className="mt-8 stats-card inline-block">
                <div className="stats-card-inner flex items-center gap-4">
                  <div className="text-4xl font-mono font-bold text-merkad-purple-light text-glow">
                    4.2x
                  </div>
                  <div>
                    <div className="text-white font-semibold">Average ROAS</div>
                    <div className="text-merkad-text-muted text-sm">Return on ad spend</div>
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
                  <div className="space-y-4">
                    {/* Ad performance simulation */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-merkad-text-muted">Campaign Performance</span>
                      <span className="text-xs font-mono text-merkad-green">LIVE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 text-center">
                        <div className="text-2xl font-mono font-bold text-merkad-purple-light">$12.4K</div>
                        <div className="text-xs text-merkad-text-muted">Revenue</div>
                      </div>
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 text-center">
                        <div className="text-2xl font-mono font-bold text-merkad-green">4.2x</div>
                        <div className="text-xs text-merkad-text-muted">ROAS</div>
                      </div>
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 text-center">
                        <div className="text-2xl font-mono font-bold text-white">847</div>
                        <div className="text-xs text-merkad-text-muted">Clicks</div>
                      </div>
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 text-center">
                        <div className="text-2xl font-mono font-bold text-white">6.8%</div>
                        <div className="text-xs text-merkad-text-muted">Conv. Rate</div>
                      </div>
                    </div>
                    <div className="h-20 flex items-end gap-1">
                      {[40, 55, 45, 70, 85, 60, 90, 75, 95].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-merkad-purple to-merkad-purple-light rounded-t"
                          style={{ height: `${h}%` }}
                        />
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
              Most Ad Campaigns Burn 40% of Budget on Unqualified Clicks
            </h2>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              Without proper targeting and optimization, you're paying for window shoppers instead of buyers.
            </p>
            <p className="text-merkad-purple-light mt-4 font-semibold">
              We make every click count.
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
              Our Ads Approach
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

            {/* Results highlight */}
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <span className="text-xs font-mono text-merkad-text-muted uppercase tracking-wider">
                  Results
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-3">
                  Client Average
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-merkad-text-muted">Cost Per Lead</span>
                    <span className="text-xl font-mono font-bold text-merkad-green">-45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-merkad-text-muted">Conversion Rate</span>
                    <span className="text-xl font-mono font-bold text-merkad-green">+120%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-merkad-text-muted">ROAS</span>
                    <span className="text-xl font-mono font-bold text-merkad-purple-light">4.2x</span>
                  </div>
                </div>
                <Link
                  to="/case-studies"
                  className="mt-6 inline-flex items-center gap-2 text-merkad-purple-light hover:text-white transition-colors font-medium btn-arrow"
                >
                  See client results
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
            Ready to Scale With Paid Ads?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            Book a call to see how Paid Advertising can accelerate your growth.
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

import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp, FileText, Globe, CheckCircle2, BarChart } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Keyword Strategy',
    description: 'We target the exact terms your ideal clients are searching for.',
  },
  {
    icon: FileText,
    title: 'Content Creation',
    description: 'High-quality blog posts, landing pages, and service pages that rank.',
  },
  {
    icon: Globe,
    title: 'Technical SEO',
    description: 'Site structure, speed, and code optimizations for better rankings.',
  },
  {
    icon: BarChart,
    title: 'Performance Tracking',
    description: 'Monthly reports showing rankings, traffic, and lead attribution.',
  },
];

const benefits = [
  'Show up when clients search for your services',
  'Build long-term organic traffic (not just paid)',
  'Content that works 24/7 to attract leads',
  'Outrank competitors in your local market',
  'Track every lead back to the content that generated it',
];

export function SEOContent() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                SEO & Content
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                Get Found on Google
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                Rank for the terms your ideal clients are searching. Build a content engine that generates organic traffic and leads month after month.
              </p>

              {/* Key Metric */}
              <div className="mt-8 stats-card inline-block">
                <div className="stats-card-inner flex items-center gap-4">
                  <div className="text-4xl font-mono font-bold text-merkad-purple-light text-glow">
                    #1
                  </div>
                  <div>
                    <div className="text-white font-semibold">Google Rankings</div>
                    <div className="text-merkad-text-muted text-sm">for client target keywords</div>
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
                    {/* Search result simulation */}
                    <div className="flex items-center gap-2 bg-merkad-bg-elevated rounded-lg p-3">
                      <Search className="w-4 h-4 text-merkad-text-muted" />
                      <span className="text-sm text-white">best medspa near me</span>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="bg-merkad-bg-elevated rounded-lg p-4 border-l-2 border-merkad-purple">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-merkad-green/20 text-merkad-green px-2 py-0.5 rounded">#1</span>
                          <span className="text-merkad-purple-light text-sm">yourbusiness.com</span>
                        </div>
                        <h4 className="text-white font-semibold mt-1">Your MedSpa | Premium Treatments</h4>
                        <p className="text-xs text-merkad-text-muted mt-1">Experience luxury skincare and wellness...</p>
                      </div>
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 opacity-50">
                        <span className="text-xs text-merkad-text-muted">competitor1.com</span>
                      </div>
                      <div className="bg-merkad-bg-elevated rounded-lg p-3 opacity-30">
                        <span className="text-xs text-merkad-text-muted">competitor2.com</span>
                      </div>
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
              75% of Users Never Scroll Past Page 1
            </h2>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              If you're not ranking, you're invisible. Your competitors are taking the leads that should be yours.
            </p>
            <p className="text-merkad-purple-light mt-4 font-semibold">
              It's time to claim your spot at the top.
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
              Our SEO Approach
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
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-mono font-bold text-merkad-purple-light text-glow">1.5K</span>
                    <span className="text-merkad-text-muted">keywords ranking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-mono font-bold text-merkad-green text-glow">+47K</span>
                    <span className="text-merkad-text-muted">impressions</span>
                  </div>
                </div>
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
            Ready to Dominate Search Results?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            Book a call to see how SEO & Content can bring organic leads to your business.
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

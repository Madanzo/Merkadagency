import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Globe, Users, Search, CheckCircle2 } from 'lucide-react';

const systemsBuilt = [
  { title: 'Custom HTML Website', description: 'Mobile-first, conversion-optimized design' },
  { title: 'CRM Integration', description: 'Booking system with full client management' },
  { title: 'SEO Optimization', description: 'Technical fixes and content strategy' },
  { title: 'Local SEO', description: 'Google Business Profile optimization' },
];

const results = [
  { label: 'Google Visibility', value: '3x', growth: 'Improvement' },
  { label: 'Website', value: 'Custom', growth: 'Built from scratch' },
  { label: 'Booking System', value: 'Live', growth: 'Fully integrated' },
];

export default function TeonanacatlCaseStudy() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Content - 3 columns */}
            <div className="lg:col-span-3">
              <span className="text-sm font-mono text-merkad-text-muted uppercase tracking-wider">
                Case Study
              </span>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mt-4 leading-tight">
                From Invisible to{' '}
                <span className="text-gradient">3x Google Visibility</span>
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                How we built a complete digital presence for a wellness retreat center with no online footprint.
              </p>

              <Link
                to="/book"
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
              >
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* System Status Card - 2 columns */}
            <div className="lg:col-span-2">
              <div className="system-card w-full max-w-sm lg:ml-auto">
                <div className="system-card-inner">
                  <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider mb-4">
                    System
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Status</span>
                      <span className="text-merkad-green">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Industry</span>
                      <span className="text-white">WELLNESS</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Focus</span>
                      <span className="text-white">RETREATS</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Visibility</span>
                      <span className="text-merkad-purple-light">+3X</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="browser-frame max-w-4xl mx-auto image-floating">
            <div className="browser-frame-header">
              <div className="browser-frame-dot bg-red-500" />
              <div className="browser-frame-dot bg-yellow-500" />
              <div className="browser-frame-dot bg-green-500" />
            </div>
            <div className="p-2 bg-merkad-bg-tertiary">
              <img
                src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d17bdd83739a3e136f28ff.png"
                alt="Teonanacatl Website"
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Initial State */}
      <section className="py-20 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                The Challenge
              </span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                Starting From Zero
              </h2>
              <p className="text-merkad-text-secondary mt-4">
                Teonanacatl is a wellness retreat center offering transformative experiences. They came to us with no website, no online booking system, and zero visibility on Google—in a market where most customers search online before booking.
              </p>
            </div>

            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider mb-4">
                  Before
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Website', value: 'NONE' },
                    { label: 'Online booking', value: 'NONE' },
                    { label: 'Google visibility', value: 'ZERO' },
                    { label: 'CRM system', value: 'NONE' },
                    { label: 'Lead capture', value: 'NONE' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• {item.label}</span>
                      <span className="text-merkad-text-muted">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Built */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              The Solution
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              What We Built
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {systemsBuilt.map((system, index) => (
              <div key={system.title} className="service-card flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center flex-shrink-0">
                  {index === 0 && <Globe className="w-6 h-6 text-white" />}
                  {index === 1 && <Users className="w-6 h-6 text-white" />}
                  {index === 2 && <Search className="w-6 h-6 text-white" />}
                  {index === 3 && <Eye className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{system.title}</h3>
                  <p className="text-merkad-text-secondary mt-1 text-sm">{system.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-24 lg:py-32 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Results
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              The Transformation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {results.map((result) => (
              <div key={result.label} className="metric-card text-center">
                <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider">
                  {result.label}
                </div>
                <div className="text-4xl font-mono font-bold text-merkad-purple-light text-glow mt-2">
                  {result.value}
                </div>
                <div className="text-sm text-merkad-green mt-1">
                  {result.growth}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <h3 className="text-xl font-display font-bold text-white mb-4">
                  Now They Have
                </h3>
                <div className="space-y-3">
                  {[
                    'Professional website that converts visitors to bookings',
                    'Integrated CRM for managing client relationships',
                    'Strong Google presence for local searches',
                    'Automated booking and follow-up systems',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-merkad-green flex-shrink-0 mt-0.5" />
                      <span className="text-merkad-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
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
            Ready to Get Found Online?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            See if your business qualifies for a complete digital transformation.
          </p>
          <Link
            to="/book"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
          >
            Book Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
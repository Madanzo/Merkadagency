import { Layout } from '@/components/layout/Layout';
import { IndustryTag } from '@/components/common/IndustryTag';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Eye } from 'lucide-react';

const caseStudies = [
  {
    client: 'Kravings Club',
    industry: 'Cannabis Delivery',
    industryType: 'cannabis',
    metric: '196%',
    metricLabel: 'Revenue Growth',
    description: 'From $2,358/mo to $6,988/mo in just 4 months with automated lead capture and follow-up systems.',
    href: '/case-studies/kravings',
    services: ['Website', 'SMS', 'SEO', 'CRM'],
    image: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FScreenshot%202025-08-21%20153207.png?alt=media&token=87afa2fd-ca5f-4683-ad24-fecb592cca89',
  },
  {
    client: 'Grid & Guard',
    industry: 'E-commerce',
    industryType: 'ecommerce',
    metric: '+150%',
    metricLabel: 'Revenue Growth',
    description: 'Abandoned cart recovery and retention automation scaling revenue by 150%.',
    href: '/case-studies/gridnguard',
    services: ['Email Marketing', 'CRM'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
  },
  {
    client: 'Teonanacatl',
    industry: 'Wellness & Retreats',
    metric: '3x',
    metricLabel: 'Google Visibility',
    description: 'Custom website, CRM integration, and SEO optimization transformed their digital presence from zero.',
    href: '/case-studies/teonanacatl',
    services: ['Website', 'CRM', 'SEO'],
    image: 'https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d17bdd83739a3e136f28ff.png',
  },
];

const aggregateMetrics = [
  { value: '196%', label: 'Average Revenue Growth' },
  { value: '$2.4M+', label: 'Revenue Generated' },
  { value: '2', label: 'Businesses Transformed' },
];

export default function CaseStudiesHub() {
  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Case Studies
            </span>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mt-4">
              Client Results
            </h1>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              Real businesses, real growth, real numbers.
            </p>
          </div>

          {/* Aggregate Metrics */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16 py-8 border-y border-white/5">
            {aggregateMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-mono font-bold text-merkad-purple-light text-glow">
                  {metric.value}
                </div>
                <div className="text-sm text-merkad-text-muted mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Case Study Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {caseStudies.map((study) => (
              <Link
                key={study.client}
                to={study.href}
                className="group card-gradient-border"
              >
                <div className="card-gradient-border-inner h-full flex flex-col">
                  {/* Image Preview */}
                  <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-merkad-bg-primary">
                    <img
                      src={study.image}
                      alt={`${study.client} Website`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Industry Tag */}
                  <div className="flex items-center justify-between mb-6">
                    {study.industryType ? (
                      <IndustryTag type={study.industryType as any} />
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-merkad-bg-elevated text-xs font-medium text-merkad-text-muted">
                        {study.industry}
                      </span>
                    )}
                    <div className="flex gap-2">
                      {study.services.map((service) => (
                        <span
                          key={service}
                          className="px-2 py-1 rounded bg-merkad-bg-primary text-xs font-mono text-merkad-purple-light"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metric */}
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl lg:text-6xl font-mono font-bold text-merkad-purple-light text-glow">
                      {study.metric}
                    </span>
                    <span className="text-merkad-text-muted text-sm mb-2">
                      {study.metricLabel}
                    </span>
                  </div>

                  {/* Client Name */}
                  <h2 className="text-2xl font-display font-bold text-white group-hover:text-merkad-purple-light transition-colors">
                    {study.client}
                  </h2>

                  {/* Description */}
                  <p className="text-merkad-text-secondary mt-3">
                    {study.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-6 flex items-center gap-2 text-merkad-purple-light group-hover:text-white transition-colors font-medium btn-arrow">
                    Read case study
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-merkad-text-secondary mb-6">
              Want results like these?
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
            >
              Book Discovery Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
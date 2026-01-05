import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Eye } from 'lucide-react';

const caseStudies = [
  {
    client: 'Kravings Club',
    industry: 'Cannabis Delivery',
    metric: '196%',
    metricLabel: 'Revenue Growth',
    description: 'From $2,358/mo to $6,988/mo in just 4 months with automated lead capture and follow-up.',
    href: '/case-studies/kravings',
    icon: TrendingUp,
  },
  {
    client: 'Teonanacatl',
    industry: 'Wellness & Retreats',
    metric: '3x',
    metricLabel: 'Google Visibility',
    description: 'Custom website, CRM integration, and SEO optimization transformed their digital presence.',
    href: '/case-studies/teonanacatl',
    icon: Eye,
  },
];

export function CaseStudiesSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Proof
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mt-4">
              Real Results, Real Businesses
            </h2>
          </div>
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-merkad-purple-light hover:text-white transition-colors font-medium btn-arrow"
          >
            View all case studies
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <Link
              key={study.client}
              to={study.href}
              className="group relative overflow-hidden rounded-3xl bg-merkad-bg-tertiary border border-white/5 hover:border-merkad-purple/30 transition-all duration-500 hover:-translate-y-2 shadow-glow"
            >
              {/* Content */}
              <div className="p-8 lg:p-10">
                {/* Industry Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-merkad-bg-elevated mb-6">
                  <span className="text-xs font-medium text-merkad-text-muted">
                    {study.industry}
                  </span>
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
                <h3 className="text-2xl font-display font-bold text-white">
                  {study.client}
                </h3>

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

              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-merkad-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
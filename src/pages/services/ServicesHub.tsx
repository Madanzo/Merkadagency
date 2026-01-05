import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Workflow, Search, Target } from 'lucide-react';

const services = [
  {
    icon: Bot,
    title: 'AI Lead Capture & Qualification',
    description: 'Respond to every lead in under 2 minutes, 24/7. Our AI qualifies leads automatically so your team only talks to ready-to-buy prospects.',
    href: '/services/ai-lead-capture',
    metrics: ['47s avg response', '24/7 availability', '85% qualification accuracy'],
    features: ['Instant lead response', 'Smart qualification questions', 'CRM integration', 'Multi-channel capture'],
  },
  {
    icon: Workflow,
    title: 'CRM & Pipeline Automation',
    description: 'Automate your entire sales pipeline. From first touch to closed deal, every step happens automatically.',
    href: '/services/crm-automation',
    metrics: ['80% less manual work', 'Zero leads lost', '3x faster pipeline'],
    features: ['Automated follow-ups', 'Pipeline management', 'Task automation', 'Performance tracking'],
  },
  {
    icon: Search,
    title: 'SEO & Content Systems',
    description: 'Dominate Google search results and attract customers who are actively looking for your services.',
    href: '/services/seo-content',
    metrics: ['3x visibility', 'Page 1 rankings', 'Organic growth'],
    features: ['Technical SEO audit', 'Content strategy', 'Local SEO', 'Link building'],
  },
  {
    icon: Target,
    title: 'Paid Advertising',
    description: 'High-converting ad campaigns on Meta and Google that bring in qualified leads consistently.',
    href: '/services/paid-advertising',
    metrics: ['4.2x avg ROAS', 'Lower CPL', 'Qualified traffic'],
    features: ['Campaign management', 'A/B testing', 'Conversion tracking', 'Retargeting'],
  },
];

export default function ServicesHub() {
  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Services
            </span>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mt-4">
              Growth Services Built for Scale
            </h1>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              Every service designed to work together as one automated system. The MerkadFlow System™ ensures all pieces work in harmony.
            </p>
          </div>

          {/* Services Grid */}
          <div className="space-y-8">
            {services.map((service, index) => (
              <Link
                key={service.title}
                to={service.href}
                className="block group"
              >
                <div className="card-gradient-border">
                  <div className="card-gradient-border-inner">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Content */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                            <service.icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-display font-bold text-white group-hover:text-merkad-purple-light transition-colors">
                              {service.title}
                            </h2>
                            <p className="text-merkad-text-secondary mt-2">
                              {service.description}
                            </p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mt-6 flex flex-wrap gap-3">
                          {service.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-3 py-1 rounded-full bg-merkad-bg-elevated text-sm text-merkad-text-secondary"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="flex flex-col justify-center">
                        <div className="space-y-3">
                          {service.metrics.map((metric) => (
                            <div
                              key={metric}
                              className="flex items-center gap-2"
                            >
                              <div className="w-2 h-2 rounded-full bg-merkad-purple-light" />
                              <span className="font-mono text-sm text-merkad-purple-light">
                                {metric}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-merkad-purple-light group-hover:text-white transition-colors font-medium btn-arrow">
                          Learn more
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
            >
              Book a Call to Discuss Your Needs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Workflow, Search, Target } from 'lucide-react';

const services = [
  {
    icon: Bot,
    title: 'AI Lead Capture',
    description: 'Respond to every lead in under 2 minutes, 24/7. Never miss an opportunity.',
    href: '/services/ai-lead-capture',
    metric: '47s avg response',
  },
  {
    icon: Workflow,
    title: 'CRM Automation',
    description: 'Automate your entire pipeline. Follow-ups, nurturing, and handoffs on autopilot.',
    href: '/services/crm-automation',
    metric: '80% less manual work',
  },
  {
    icon: Search,
    title: 'SEO & Content',
    description: 'Dominate Google search results. Get found by customers ready to buy.',
    href: '/services/seo-content',
    metric: '3x visibility',
  },
  {
    icon: Target,
    title: 'Paid Advertising',
    description: 'High-converting ad campaigns that bring in qualified leads consistently.',
    href: '/services/paid-advertising',
    metric: '4.2x ROAS',
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
            What We Build
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mt-4">
            Growth Services
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-2xl mx-auto text-lg">
            Every service designed to work together as one automated system.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              className="service-card group"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-primary/30">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-merkad-bg-elevated">
                  <span className="text-xs font-mono text-merkad-purple-light">
                    {service.metric}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-display font-bold text-white mt-6">
                {service.title}
              </h3>
              <p className="text-merkad-text-secondary mt-2">
                {service.description}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-merkad-purple-light group-hover:text-white transition-colors font-medium text-sm btn-arrow">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
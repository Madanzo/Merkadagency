import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, MessageSquare, TrendingUp } from 'lucide-react';

const phases = [
  {
    icon: Zap,
    number: '01',
    title: 'Capture',
    description: 'AI-powered lead capture that responds in under 2 minutes, 24/7.',
  },
  {
    icon: Target,
    number: '02',
    title: 'Qualify',
    description: 'Smart qualification that filters hot leads from tire-kickers automatically.',
  },
  {
    icon: MessageSquare,
    number: '03',
    title: 'Nurture',
    description: 'Automated follow-up sequences that keep leads warm until they\'re ready.',
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Convert',
    description: 'Seamless handoff to your team with full context for easy closing.',
  },
];

export function SolutionSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-merkad-bg-secondary via-merkad-bg-primary to-merkad-bg-secondary opacity-50" />
      
      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
            The Solution
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mt-4">
            Introducing The{' '}
            <span className="text-gradient">MerkadFlow System™</span>
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-2xl mx-auto text-lg">
            A proprietary 4-phase automation framework that captures, qualifies, nurtures, and converts leads 24/7 without additional staff.
          </p>
        </div>

        {/* Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase, index) => (
            <div
              key={phase.title}
              className="relative group"
            >
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-merkad-purple/50 to-transparent" />
              )}
              
              <div className="service-card h-full">
                {/* Phase Number */}
                <div className="text-5xl font-display font-bold text-merkad-bg-elevated group-hover:text-merkad-purple/20 transition-colors">
                  {phase.number}
                </div>
                
                {/* Icon */}
                <div className="mt-4 w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-primary/30">
                  <phase.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-display font-bold text-white mt-4">
                  {phase.title}
                </h3>
                <p className="text-merkad-text-secondary mt-2 text-sm">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/about/method"
            className="inline-flex items-center gap-2 text-merkad-purple-light hover:text-white transition-colors font-medium btn-arrow"
          >
            See How It Works
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
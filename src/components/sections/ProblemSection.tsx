import { Clock, Users, TrendingDown, HelpCircle } from 'lucide-react';

const painPoints = [
  {
    icon: Clock,
    title: 'Leads go cold because no one follows up fast enough',
    description: 'By the time you respond, they\'ve already contacted your competitor.',
  },
  {
    icon: Users,
    title: 'Your team is drowning in manual tasks instead of closing deals',
    description: 'Hours wasted on data entry, follow-ups, and scheduling.',
  },
  {
    icon: TrendingDown,
    title: 'You can\'t scale without hiring more staff',
    description: 'Growth means more overhead, more training, more problems.',
  },
  {
    icon: HelpCircle,
    title: 'You have no idea which marketing actually works',
    description: 'Money goes out, leads come in, but the connection is unclear.',
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
            The Problem
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mt-4">
            Sound Familiar?
          </h2>
        </div>

        {/* Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((point, index) => (
            <div
              key={point.title}
              className="card-gradient-border group"
            >
              <div className="card-gradient-border-inner flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-merkad-bg-elevated flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <point.icon className="w-6 h-6 text-merkad-purple-light" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    {point.title}
                  </h3>
                  <p className="text-merkad-text-secondary mt-2 text-sm">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition Statement */}
        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-4 rounded-2xl bg-merkad-bg-tertiary border border-white/5">
            <p className="text-xl lg:text-2xl font-display font-semibold text-white">
              You don't have a lead problem.{' '}
              <span className="text-gradient-purple">You have a systems problem.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
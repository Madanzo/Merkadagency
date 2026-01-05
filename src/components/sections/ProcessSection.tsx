import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Wrench, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Phone,
    number: '01',
    title: 'Discovery Call',
    description: 'We learn about your business, current systems, and growth goals. No pressure, just clarity.',
    duration: '30 minutes',
  },
  {
    icon: Wrench,
    number: '02',
    title: 'Custom Build',
    description: 'We design and build your MerkadFlow System™ tailored to your specific needs and tech stack.',
    duration: '2-4 weeks',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Launch & Optimize',
    description: 'We launch your system and continuously optimize based on real performance data.',
    duration: 'Ongoing',
  },
];

export function ProcessSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-merkad-bg-primary/50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mt-4">
            Simple, Effective, Done-For-You
          </h2>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute left-[2.75rem] top-0 bottom-0 w-px bg-gradient-to-b from-merkad-purple via-merkad-purple/50 to-transparent" />

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex items-start gap-6 lg:gap-8"
                >
                  {/* Step Icon */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-primary/30">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs font-mono text-merkad-purple-light">
                        STEP {step.number}
                      </span>
                      <span className="text-xs font-mono text-merkad-text-muted">
                        {step.duration}
                      </span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-display font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-merkad-text-secondary mt-2 max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
          >
            Start With a Discovery Call
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
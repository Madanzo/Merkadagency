import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Zap, Heart } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Results Over Retainers',
    description: 'We measure success by your growth, not hours logged. If you\'re not growing, we\'re not doing our job.',
  },
  {
    icon: Zap,
    title: 'Systems Over Tactics',
    description: 'Individual tactics fade. Integrated systems compound. We build the latter.',
  },
  {
    icon: Users,
    title: 'Partners, Not Vendors',
    description: 'We succeed when you succeed. That\'s why we offer guarantees and work until you see results.',
  },
  {
    icon: Heart,
    title: 'Clarity Over Complexity',
    description: 'Technology should simplify your life, not complicate it. We make the complex simple.',
  },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              About Us
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mt-4">
              We Build Growth Machines
            </h1>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              MerkadAgency exists because we saw too many great businesses losing leads to outdated processes and disconnected tools. We fix that.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 lg:py-32 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                  Our Mission
                </span>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                  Automate Growth for Service Businesses
                </h2>
                <p className="text-merkad-text-secondary mt-6">
                  We believe every service business deserves access to the same growth systems that power the fastest-growing companies in the world.
                </p>
                <p className="text-merkad-text-secondary mt-4">
                  The MerkadFlow System™ is our answer: a complete automation framework that captures, qualifies, nurtures, and converts leads 24/7—without requiring you to hire more staff or become a tech expert.
                </p>
              </div>
              <div className="card-gradient-border">
                <div className="card-gradient-border-inner">
                  <div className="text-5xl font-mono font-bold text-merkad-purple-light text-glow">
                    $2.4M+
                  </div>
                  <p className="text-merkad-text-secondary mt-2">
                    Revenue generated for clients
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-3xl font-mono font-bold text-white">
                      150-200%
                    </div>
                    <p className="text-merkad-text-secondary mt-1">
                      Average client growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              What We Believe
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="service-card">
                <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">{value.title}</h3>
                <p className="text-merkad-text-secondary mt-2">{value.description}</p>
              </div>
            ))}
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
            Ready to Work Together?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            Book a discovery call and let's talk about your growth goals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
            >
              Book Discovery Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about/method"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              Learn Our Method
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
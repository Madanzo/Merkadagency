import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Shield } from 'lucide-react';
import { CalendarEmbed } from '@/components/common/CalendarEmbed';

export default function BookPage() {
  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Let's Talk
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
              Book Your Discovery Call
            </h1>
            <p className="text-merkad-text-secondary mt-6 text-lg">
              30 minutes to explore how the MerkadFlow System™ can transform your business. No pressure, just clarity.
            </p>

            {/* What to Expect */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-merkad-bg-tertiary rounded-xl p-6 border border-white/5">
                <Clock className="w-8 h-8 text-merkad-purple-light mb-4" />
                <h3 className="text-lg font-semibold text-white">30 Minutes</h3>
                <p className="text-merkad-text-secondary text-sm mt-2">
                  A focused conversation about your goals
                </p>
              </div>
              <div className="bg-merkad-bg-tertiary rounded-xl p-6 border border-white/5">
                <Calendar className="w-8 h-8 text-merkad-purple-light mb-4" />
                <h3 className="text-lg font-semibold text-white">Custom Plan</h3>
                <p className="text-merkad-text-secondary text-sm mt-2">
                  We'll outline a strategy tailored to you
                </p>
              </div>
              <div className="bg-merkad-bg-tertiary rounded-xl p-6 border border-white/5">
                <Shield className="w-8 h-8 text-merkad-purple-light mb-4" />
                <h3 className="text-lg font-semibold text-white">No Pressure</h3>
                <p className="text-merkad-text-secondary text-sm mt-2">
                  Just honest advice, even if we're not a fit
                </p>
              </div>
            </div>

            {/* Calendar Embed */}
            <div className="mt-12 card-gradient-border">
              <div className="card-gradient-border-inner p-2">
                <CalendarEmbed
                  calLink="camilo-reyna-ny2tuw/merkadagency"
                  className="min-h-[500px]"
                />
              </div>
            </div>

            {/* Alternative CTA */}
            <div className="mt-12">
              <p className="text-merkad-text-secondary mb-4">
                Prefer to start with a free audit instead?
              </p>
              <Link
                to="/resources/free-audit"
                className="inline-flex items-center gap-2 text-merkad-purple-light hover:text-white transition-colors font-medium btn-arrow"
              >
                Get Your Free Automation Audit
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
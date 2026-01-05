import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileCheck, Zap } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-merkad-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white leading-tight">
            Ready to Stop{' '}
            <span className="text-gradient">Losing Leads</span>?
          </h2>

          {/* Subheadline */}
          <p className="mt-6 text-lg lg:text-xl text-merkad-text-secondary max-w-2xl mx-auto">
            Book a discovery call and see exactly how the MerkadFlow System™ can transform your business in 90 days.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-merkad-bg-primary font-semibold rounded-xl hover:bg-merkad-purple-light transition-colors btn-arrow"
            >
              Book Discovery Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/resources/free-audit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              Get Free Audit
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            <div className="flex items-center gap-2 text-merkad-text-muted">
              <Shield className="w-5 h-5 text-merkad-green" />
              <span className="text-sm font-medium">90-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-merkad-text-muted">
              <FileCheck className="w-5 h-5 text-merkad-purple-light" />
              <span className="text-sm font-medium">No Contracts</span>
            </div>
            <div className="flex items-center gap-2 text-merkad-text-muted">
              <Zap className="w-5 h-5 text-merkad-purple-light" />
              <span className="text-sm font-medium">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
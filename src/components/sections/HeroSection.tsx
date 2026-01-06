import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileCheck, Clock } from 'lucide-react';
import { ConsoleStatusCard } from '@/components/common/ConsoleStatusCard';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="container-custom py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-merkad-bg-tertiary border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-merkad-green animate-pulse" />
            <span className="text-sm font-medium text-merkad-text-secondary">
              AI-Powered Growth Systems
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight tracking-tight">
            Turn Website Traffic Into{' '}
            <span className="text-gradient">Booked Revenue</span>
            —Without Hiring More Staff
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-merkad-text-secondary max-w-2xl mx-auto leading-relaxed">
            The MerkadFlow System™ automates lead capture, qualification, and follow-up so you can scale your medspa or service business on autopilot.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
            >
              Book Discovery Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/case-studies"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              See Client Results
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
              <span className="text-sm font-medium">No Long-Term Contracts</span>
            </div>
            <div className="flex items-center gap-2 text-merkad-text-muted">
              <Clock className="w-5 h-5 text-merkad-purple-light" />
              <span className="text-sm font-medium">Done-For-You Setup</span>
            </div>
          </div>
        </div>

        {/* Hero Visual - Dashboard Mockup */}
        <div className="mt-16 lg:mt-24 relative">
          <div className="browser-frame max-w-5xl mx-auto image-floating">
            <div className="browser-frame-header">
              <div className="browser-frame-dot bg-red-500" />
              <div className="browser-frame-dot bg-yellow-500" />
              <div className="browser-frame-dot bg-green-500" />
              <div className="flex-1 ml-4">
                <div className="w-48 h-6 bg-merkad-bg-tertiary rounded" />
              </div>
            </div>
            <div className="p-4 bg-merkad-bg-tertiary">
              {/* Dashboard Preview */}
              <div className="aspect-video rounded-lg bg-merkad-bg-secondary flex items-center justify-center relative overflow-hidden">
                {/* Hero Video Background */}
                <video
                  src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Merkadagency%20video.mp4?alt=media&token=8f751477-b305-4e69-a9ae-a5129a670750"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />

                {/* Content Overlay */}
                <div className="text-center relative z-10">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
                    <div className="p-2 sm:p-4 rounded-lg bg-merkad-bg-tertiary/80 backdrop-blur-sm border border-white/5">
                      <div className="text-xl sm:text-3xl font-mono font-bold text-merkad-purple-light text-glow">196%</div>
                      <div className="text-[10px] sm:text-xs text-merkad-text-muted mt-1">Revenue Growth</div>
                    </div>
                    <div className="p-2 sm:p-4 rounded-lg bg-merkad-bg-tertiary/80 backdrop-blur-sm border border-white/5">
                      <div className="text-xl sm:text-3xl font-mono font-bold text-merkad-green text-glow">47s</div>
                      <div className="text-[10px] sm:text-xs text-merkad-text-muted mt-1">Response Time</div>
                    </div>
                    <div className="p-2 sm:p-4 rounded-lg bg-merkad-bg-tertiary/80 backdrop-blur-sm border border-white/5">
                      <div className="text-xl sm:text-3xl font-mono font-bold text-merkad-purple-light text-glow">24/7</div>
                      <div className="text-[10px] sm:text-xs text-merkad-text-muted mt-1">AI Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stats Card */}
          <ConsoleStatusCard />
        </div>
      </div>
    </section>
  );
}
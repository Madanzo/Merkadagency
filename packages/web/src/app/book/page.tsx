import { SectionHeader } from '@/components/marketing/section-header';
import { CtaPanel } from '@/components/marketing/cta-panel';
import { Calendar, Clock, Video } from 'lucide-react';

export const metadata = {
  title: 'Book a Call | MerkadAgency',
  description: 'Schedule a consultation to discuss your video production needs.',
};

export default function BookPage() {
  return (
    <div className="container mx-auto px-6 pt-32 pb-24">
      <section className="mb-16">
        <SectionHeader
          title="Book a Strategy Call"
          subtitle="Let's discuss how MerkadAgency can transform your video production workflow."
        />
      </section>

      <section className="mx-auto max-w-4xl">
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="mb-4 inline-flex rounded-lg bg-violet/20 p-3">
              <Clock className="h-6 w-6 text-violet" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">30 Minutes</h3>
            <p className="text-sm text-graycool">Quick consultation to understand your needs</p>
          </div>

          <div className="glass-card rounded-xl p-6 text-center">
            <div className="mb-4 inline-flex rounded-lg bg-teal/20 p-3">
              <Video className="h-6 w-6 text-teal" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Live Demo</h3>
            <p className="text-sm text-graycool">See our Studio in action with your content</p>
          </div>

          <div className="glass-card rounded-xl p-6 text-center">
            <div className="mb-4 inline-flex rounded-lg bg-pink/20 p-3">
              <Calendar className="h-6 w-6 text-pink" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Flexible Scheduling</h3>
            <p className="text-sm text-graycool">Pick a time that works best for you</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">What We'll Cover</h2>
          <ul className="mb-8 space-y-3 text-graycool">
            <li className="flex items-start gap-3">
              <span className="text-violet">•</span>
              <span>Your current video production workflow and pain points</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet">•</span>
              <span>How MerkadAgency Studio can streamline your process</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet">•</span>
              <span>Pricing options and package recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet">•</span>
              <span>Custom integrations and white-label solutions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet">•</span>
              <span>Q&A about features, exports, and technical requirements</span>
            </li>
          </ul>

          <div className="rounded-lg bg-ink p-6 text-center">
            <p className="mb-4 text-graycool">
              Calendly integration coming soon. For now, email us directly:
            </p>
            <a
              href="mailto:hello@merkadagency.com"
              className="text-xl font-semibold text-violet hover:underline"
            >
              hello@merkadagency.com
            </a>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <CtaPanel
          title="Prefer to Explore First?"
          description="Try our Studio Beta for free and see the magic yourself."
          primaryButtonText="Try Studio"
          primaryButtonHref="/studio"
          secondaryButtonText="View Pricing"
          secondaryButtonHref="/pricing"
        />
      </section>
    </div>
  );
}

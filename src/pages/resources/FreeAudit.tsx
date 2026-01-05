import { Layout } from '@/components/layout/Layout';
import { useState } from 'react';
import { CheckCircle2, ArrowRight, Clock, Search, Lightbulb, FileText } from 'lucide-react';

const benefits = [
  { icon: Clock, text: 'Lead response time analysis' },
  { icon: Search, text: 'Current funnel review' },
  { icon: Lightbulb, text: 'Automation opportunities identified' },
  { icon: FileText, text: 'Custom recommendations' },
];

const revenueRanges = [
  'Under $5K/month',
  '$5K - $15K/month',
  '$15K - $50K/month',
  '$50K - $150K/month',
  '$150K+/month',
];

const challenges = [
  'Leads falling through the cracks',
  'Slow response times',
  'Manual follow-up overwhelm',
  'No visibility into what works',
  'Scaling without hiring',
  'Other',
];

export function FreeAudit() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    website: '',
    revenue: '',
    challenge: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Content */}
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                Free Resource
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                Get Your Free Automation Audit
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                Discover exactly where you're losing leads and how to fix it. No obligation, just clarity.
              </p>

              <div className="mt-10 space-y-4">
                <h3 className="text-lg font-semibold text-white">What You'll Get:</h3>
                {benefits.map((benefit) => (
                  <div key={benefit.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-merkad-purple/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-merkad-purple-light" />
                    </div>
                    <span className="text-merkad-text-secondary">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="mt-10 p-6 bg-merkad-bg-tertiary rounded-xl border border-white/5">
                <p className="text-merkad-text-secondary italic">
                  "The audit revealed we were losing 60% of leads to slow response. Within a month of implementing their recommendations, we saw a 40% increase in bookings."
                </p>
                <p className="text-white font-semibold mt-3">— Wellness Clinic Owner</p>
              </div>
            </div>

            {/* Form */}
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-merkad-green mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold text-white">
                      Audit Request Received!
                    </h3>
                    <p className="text-merkad-text-secondary mt-3">
                      We'll review your information and send your personalized audit within 48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Business Name</label>
                      <input
                        type="text"
                        required
                        value={formData.business}
                        onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="Your business name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Website URL</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Monthly Revenue</label>
                      <select
                        required
                        value={formData.revenue}
                        onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                      >
                        <option value="">Select range</option>
                        {revenueRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Biggest Challenge</label>
                      <select
                        required
                        value={formData.challenge}
                        onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                      >
                        <option value="">Select challenge</option>
                        {challenges.map((challenge) => (
                          <option key={challenge} value={challenge}>{challenge}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Get My Free Audit
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-merkad-text-muted text-center">
                      No spam, ever. We'll only use your info to provide your audit.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

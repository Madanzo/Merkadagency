import { Layout } from '@/components/layout/Layout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Content */}
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                Get in Touch
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                Let's Talk Growth
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                Have a question or ready to get started? We'd love to hear from you.
              </p>

              {/* Primary CTA */}
              <div className="mt-10 p-6 bg-merkad-bg-tertiary rounded-xl border border-merkad-purple/20">
                <h3 className="text-lg font-semibold text-white">Ready to book a call?</h3>
                <p className="text-merkad-text-secondary text-sm mt-2">
                  The fastest way to get started is with a 30-minute discovery call.
                </p>
                <Link
                  to="/book"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-purple text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                >
                  Book Discovery Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-merkad-bg-tertiary flex items-center justify-center">
                    <Mail className="w-5 h-5 text-merkad-purple-light" />
                  </div>
                  <div>
                    <div className="text-sm text-merkad-text-muted">Email</div>
                    <a href="mailto:hello@merkadagency.com" className="text-white hover:text-merkad-purple-light transition-colors">
                      hello@merkadagency.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-merkad-bg-tertiary flex items-center justify-center">
                    <Phone className="w-5 h-5 text-merkad-purple-light" />
                  </div>
                  <div>
                    <div className="text-sm text-merkad-text-muted">Phone</div>
                    <a href="tel:+1234567890" className="text-white hover:text-merkad-purple-light transition-colors">
                      [Phone Number]
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-merkad-bg-tertiary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-merkad-purple-light" />
                  </div>
                  <div>
                    <div className="text-sm text-merkad-text-muted">Location</div>
                    <span className="text-white">Remote / [City, Country]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <h3 className="text-xl font-display font-bold text-white mb-6">Send a Message</h3>

                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-merkad-green mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold text-white">
                      Message Sent!
                    </h3>
                    <p className="text-merkad-text-secondary mt-3">
                      We'll get back to you within 24 hours.
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
                      <label className="block text-sm font-medium text-white mb-2">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Send Message
                      <ArrowRight className="w-5 h-5" />
                    </button>
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

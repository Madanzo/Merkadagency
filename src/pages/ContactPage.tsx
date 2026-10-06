import { journeyEvent } from '@/lib/journeyEvents';
import { inquiryAttribution } from '@/lib/inquiryAttribution';
import { ContactVerification } from '@/components/common/ContactVerification';
import { Layout } from '@/components/layout/Layout';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { CONTACT_ATTEMPT_KEY, prepareContactAttempt, restoreContactAttempt, submitContactAttempt, type ContactAttempt, type ContactFields } from '@/lib/contactIntake';

export function ContactPage({ requestType = 'contact' }: { requestType?: 'contact' | 'audit' }) {
  const [restored] = useState(restoreContactAttempt);
  const attempt = useRef<ContactAttempt | null>(restored);
  const inFlight = useRef(false);
  const started = useRef(false);
  const contextStarted = useRef(false);
  const surface = requestType === 'audit' ? 'audit' : 'contact';
  const feedback = useRef<HTMLDivElement>(null);
  const errorFeedback = useRef<HTMLParagraphElement>(null);
  const [locked, setLocked] = useState(Boolean(restored));
  const [formData, setFormData] = useState<ContactFields>(() => restored ? JSON.parse(restored.body) : ({
    name: '',
    email: '',
    subject: '',
    message: '',
  }));
  const [available, setAvailable] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [discarding, setDiscarding] = useState(false);
  const [cleanupWarning, setCleanupWarning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (submitted) feedback.current?.focus(); else if (error) errorFeedback.current?.focus(); }, [submitted, error, available]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current || submitted || !available || !verificationToken) return;
    inFlight.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const pending = attempt.current ?? prepareContactAttempt({ ...formData, attribution: inquiryAttribution() });
      // Save before sending so a lost response/reload can retry the exact request.
      sessionStorage.setItem(CONTACT_ATTEMPT_KEY, JSON.stringify(pending));
      attempt.current = pending;
      setLocked(true);
      journeyEvent('form_submit', surface);
      await submitContactAttempt(pending, verificationToken);
      journeyEvent('intake_persisted', surface, 'persisted');
      setSubmitted(true);
      attempt.current = null;
      setFormData({ name: '', email: '', subject: '', message: '' });
      try { sessionStorage.removeItem(CONTACT_ATTEMPT_KEY); } catch { setCleanupWarning(true); }
    } catch {
      journeyEvent('form_error', surface, attempt.current ? 'unconfirmed' : 'invalid');
      setError(attempt.current
        ? 'We could not confirm your message was saved. Your details are kept here. Retry this same message, or email us directly.'
        : 'Your message has not been sent. Check that all fields are complete, shorten very long messages, and allow this tab to save your pending request before retrying.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
      setVerificationToken('');
      setAttemptNumber(value => value + 1);
    }
  };

  const discard = () => {
    if (inFlight.current) return;
    try {
      sessionStorage.removeItem(CONTACT_ATTEMPT_KEY);
      attempt.current = null;
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLocked(false);
      setDiscarding(false);
      setError(null);
    } catch { setError('The saved draft could not be removed. Use your browser settings to clear this site’s session data.'); }
  };

  return (
    <Layout>
      {requestType === 'audit' && <p className="public-audit-note">A systems review begins with a discussion of fit and scope. This request does not book a review or imply a free service, fixed price or delivery date.</p>}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Content */}
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                Get in Touch
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
                {requestType === 'audit' ? 'Discuss a website and workflow review' : 'Request a systems review'}
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                Tell us what is getting lost between your website, inquiries and tools. We will use your request to discuss fit and scope. Do not include passwords, customer records or sensitive business data.
              </p>

              {/* Primary CTA */}
              <div className="mt-10 p-6 bg-merkad-bg-tertiary rounded-xl border border-merkad-purple/20">
                <h2 className="text-lg font-semibold text-white">Ready to book a call?</h2>
                <p className="text-merkad-text-secondary text-sm mt-2">
                  View the external calendar to check available appointments. Booking is confirmed by the calendar provider.
                </p>
                <Link
                  to="/book"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-purple text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                >
                  Book Discovery Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <aside className="mt-8 text-sm text-merkad-text-secondary" aria-label="Other services">
                <p>Looking for print, signs or vehicle graphics? Visit <a className="underline" href="https://canvas-advertising.com/?utm_source=merkadagency&utm_medium=referral&utm_campaign=brand_referral" rel="noreferrer">Canvas Advertising</a>. For wraps and coatings, visit <a className="underline" href="https://phantomwrapsco.com/?utm_source=merkadagency&utm_medium=referral&utm_campaign=brand_referral" rel="noreferrer">Phantom Wraps &amp; Coatings</a>.</p>
                <p className="mt-2">You will leave this website. Each brand handles its own inquiry and service scope; this form does not transfer your details or book work with either brand.</p>
              </aside>

              {/* Contact Info */}
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-merkad-bg-tertiary flex items-center justify-center">
                    <Mail className="w-5 h-5 text-merkad-purple-light" />
                  </div>
                  <div>
                    <div className="text-sm text-merkad-text-muted">Email</div>
                    <a href="mailto:camiloreyna@merkadagency.com" className="text-white hover:text-merkad-purple-light transition-colors">
                      camiloreyna@merkadagency.com
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Form */}
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <h2 className="text-xl font-display font-bold text-white mb-6">{available ? 'Send a Message' : 'Contact options'}</h2>
                {!submitted && <ContactVerification attemptNumber={attemptNumber} onToken={setVerificationToken} onAvailability={setAvailable} />}
                {!available && !submitted && <div className="mt-5 space-y-4 text-merkad-text-secondary">
                  <p>Online inquiry forms are unavailable. Email us to discuss your website and workflow needs. Your email app will open; this website does not send the message for you.</p>
                  <a className="public-button" href="mailto:camiloreyna@merkadagency.com">Email MerkadAgency</a>
                  {locked && <p role="status">An earlier pending attempt is retained in this tab. Intake being disabled does not cancel an inquiry that may already have been received. Avoid starting a new inquiry until its status is confirmed.</p>}
                </div>}

                {submitted ? (
                  <div ref={feedback} tabIndex={-1} role="status" className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-merkad-green mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold text-white">
                      Message received
                    </h3>
                    <p className="text-merkad-text-secondary mt-3">
                      Your inquiry has been saved for review.
                    </p>
                    {cleanupWarning && <p role="alert">Your browser could not clear the saved copy. Clear this site’s session data in browser settings. Do not submit the inquiry again.</p>}
                  </div>
                ) : available ? (
                  <form onFocus={() => { if (!started.current) { started.current = true; journeyEvent('form_start', surface); } }} onSubmit={handleSubmit} className="space-y-5" aria-busy={submitting}>
                    {locked && <p className="text-sm text-merkad-text-secondary">Retrying checks the same inquiry. Your message stays unchanged until we can confirm receipt. Pending details survive reload in this browser tab until receipt is confirmed or you discard them. Browser session restoration may retain them.</p>}
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-white mb-2">Name</label>
                      <input
                        type="text"
                        required
                        id="contact-name"
                        readOnly={locked}
                        maxLength={200}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-white mb-2">Email</label>
                      <input
                        type="email"
                        required
                        id="contact-email"
                        readOnly={locked}
                        maxLength={320}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-white mb-2">Subject</label>
                      <input
                        type="text"
                        required
                        id="contact-subject"
                        readOnly={locked}
                        maxLength={200}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-white mb-2">Message</label>
                      <textarea
                        required
                        rows={4}
                        id="contact-message"
                        readOnly={locked}
                        maxLength={4500}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>

                    <fieldset onFocus={() => { if (!contextStarted.current) { contextStarted.current = true; journeyEvent('form_step', surface); } }} disabled={locked || submitting} className="space-y-5 border-t border-white/10 pt-5">
                      <legend className="text-white font-medium pr-3">Context for the review <span className="text-merkad-text-secondary font-normal">(optional)</span></legend>
                      <p className="text-sm text-merkad-text-secondary">Share what you know. These details help frame a conversation; they do not reserve a service or confirm a price.</p>
                      {([
                        ['companyName', 'Company', 200, 'Your business name'],
                        ['currentStack', 'Current tools', 600, 'For example: your website platform, CRM and inbox'],
                        ['estimatedBudget', 'Budget context (USD)', 60, 'For example: 2500, or not decided'],
                      ] as const).map(([field, label, maxLength, placeholder]) => <div key={field}>
                        <label htmlFor={`contact-${field}`} className="block text-sm font-medium text-white mb-2">{label}</label>
                        <input id={`contact-${field}`} type="text" maxLength={maxLength} value={formData[field] || ''}
                          onChange={event => setFormData({ ...formData, [field]: event.target.value })} placeholder={placeholder}
                          className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-merkad-purple" />
                      </div>)}
                      {([
                        ['desiredTimeline', 'When would you like to start?', [['', 'Not decided'], ['Within a month', 'Within a month'], ['1–3 months', '1–3 months'], ['Later / exploring', 'Later / exploring']]],
                        ['locale', 'Preferred language', [['', 'No preference'], ['en', 'English'], ['es', 'Spanish']]],
                      ] as const).map(([field, label, options]) => <div key={field}>
                        <label htmlFor={`contact-${field}`} className="block text-sm font-medium text-white mb-2">{label}</label>
                        <select id={`contact-${field}`} value={formData[field] || ''} onChange={event => setFormData({ ...formData, [field]: event.target.value })}
                          className="w-full px-4 py-3 bg-merkad-bg-elevated border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-merkad-purple">
                          {options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                        </select>
                      </div>)}
                      <p className="text-sm text-merkad-text-secondary">Language preference is recorded for review; it does not guarantee a translated service.</p>
                    </fieldset>

                    <p className="text-sm text-merkad-text-secondary">When you send, this tab temporarily saves your contact details, optional review context, campaign codes, referring site, page addresses without queries, submission time and retry reference. Verification tokens are not saved. These details are cleared after confirmed receipt or when you discard the draft. Sending requests a response to this inquiry; it does not subscribe you to marketing or SMS. <Link to="/legal/privacy" className="underline">Privacy policy</Link>.</p>

                    <button
                      type="submit"
                      disabled={submitting || !verificationToken}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {submitting ? 'Saving...' : locked ? 'Retry Message' : 'Send Message'}
                      {!submitting && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <button type="button" disabled={submitting} onClick={() => setDiscarding(true)} className="text-sm underline text-merkad-text-secondary">Discard draft</button>
                    {discarding && <div className="p-4 border border-white/20 rounded-lg" role="alertdialog" aria-label="Discard saved draft">
                      <p>Discard the copy in this tab? This does not cancel an inquiry already received. Starting again after an uncertain response could create another inquiry.</p>
                      <div className="flex gap-5 mt-3">
                        <button type="button" onClick={discard} className="underline">Discard saved draft</button>
                        <button type="button" onClick={() => setDiscarding(false)} className="underline">Keep draft</button>
                      </div>
                    </div>}
                    {error && (
                      <p ref={errorFeedback} tabIndex={-1} role="alert" className="text-red-400 text-sm text-center mt-2">{error}</p>
                    )}
                  </form>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

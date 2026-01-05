import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'How long until I see results?',
    answer: 'Most clients see measurable improvements within 30-60 days. Our 90-day guarantee ensures you\'ll see significant results in lead response time and booking rates. The full revenue impact typically becomes clear within 90 days of launch.',
  },
  {
    question: 'Do you work with my existing CRM?',
    answer: 'Yes! We integrate with most major CRMs including HubSpot, Salesforce, GoHighLevel, and many others. If you don\'t have a CRM, we\'ll help you set one up as part of the process.',
  },
  {
    question: 'What does it cost?',
    answer: 'Pricing is customized based on your needs, business size, and the scope of automation required. We offer both project-based and monthly retainer options. Book a discovery call to get a custom quote.',
  },
  {
    question: 'What\'s your guarantee?',
    answer: 'We offer a 90-Day Growth Guarantee: If you don\'t see measurable improvement in lead response time and booking rates within 90 days, we\'ll work for free until you do. No long-term contracts required.',
  },
  {
    question: 'Do I need technical skills?',
    answer: 'None at all. We handle everything from setup to optimization. You\'ll get training on any dashboards you need to monitor, but the day-to-day operation is fully automated.',
  },
  {
    question: 'What makes MerkadAgency different?',
    answer: 'Most agencies focus on one channel or tactic. We build complete systems that work together—capture, qualify, nurture, and convert. The MerkadFlow System™ is our proprietary framework that ensures every piece of your marketing machine works in harmony.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mt-4">
            Common Questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={cn(
                'rounded-2xl border transition-all duration-300',
                openIndex === index
                  ? 'bg-merkad-bg-tertiary border-merkad-purple/30 shadow-glow'
                  : 'bg-merkad-bg-tertiary/50 border-white/5 hover:border-white/10'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-merkad-purple-light flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-merkad-text-muted flex-shrink-0" />
                )}
              </button>
              
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-6 text-merkad-text-secondary">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
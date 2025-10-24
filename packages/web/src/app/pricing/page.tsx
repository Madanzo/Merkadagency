import { SectionHeader } from '@/components/marketing/section-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export const metadata = {
  title: 'Pricing | MerkadAgency',
  description: 'Choose the perfect plan for your video production needs.',
};

const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for small businesses and creators',
    features: [
      '10 videos per month',
      'Up to 30 seconds per video',
      'HD 1080p export',
      'Basic templates',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For growing teams and agencies',
    features: [
      '50 videos per month',
      'Up to 60 seconds per video',
      '4K export',
      'Premium templates',
      'Custom branding',
      'Priority support',
      'FCPXML/EDL exports',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited videos',
      'Custom video length',
      '4K+ export',
      'Custom templates',
      'White-label solution',
      'Dedicated account manager',
      'SLA & priority support',
      'API access',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-6 pt-32 pb-24">
      <section className="mb-16">
        <SectionHeader
          title="Choose Your Plan"
          subtitle="Start with a 14-day free trial. No credit card required."
        />
      </section>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative p-8 ${
              plan.highlighted
                ? 'border-violet bg-gradient-to-br from-violet/10 to-pink/5 shadow-glow'
                : 'border-violet/20'
            }`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet to-purple-400">
                Most Popular
              </Badge>
            )}

            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-graycool">{plan.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-graycool">{plan.period}</span>
            </div>

            <Button
              className={`mb-8 w-full ${
                plan.highlighted
                  ? 'bg-gradient-to-tr from-violet to-purple-400 shadow-glow'
                  : 'bg-violet hover:bg-violet-light'
              }`}
            >
              {plan.cta}
            </Button>

            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal" />
                  <span className="text-sm text-graycool">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>

      <section className="mt-16 text-center">
        <p className="text-graycool">
          All plans include access to our Studio Beta.{' '}
          <a href="/book" className="text-violet hover:underline">
            Need help choosing? Book a call
          </a>
        </p>
      </section>
    </div>
  );
}

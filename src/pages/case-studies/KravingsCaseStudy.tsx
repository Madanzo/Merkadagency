import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, MessageSquare, Mail, Search, CheckCircle2, TrendingUp, BarChart3, Star, Clock, Image as ImageIcon } from 'lucide-react';
import { ImageLightbox } from '@/components/common/ImageLightbox';

const systemsBuilt = [
  { title: 'Custom Website', description: 'Modern, conversion-optimized e-commerce experience' },
  { title: 'SMS Automation', description: 'Promos, confirmations, follow-ups, review requests' },
  { title: 'Email Marketing', description: 'Automated sequences for nurturing and retention' },
  { title: 'SEO Optimization', description: 'Technical fixes, content strategy, local rankings' },
];

const results = [
  { label: 'Revenue Growth', value: '196%', growth: 'In 4 months' },
  { label: 'Monthly Revenue', value: '$6,988', growth: 'From $2,358' },
  { label: 'Google Rating', value: '5.0', growth: 'From 0 reviews' },
];

// Firebase Storage image gallery
const galleryImages = {
  revenue: [
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Frevenue-12.24-01.25.png?alt=media&token=d4ab92c8-6fe6-4a75-a9aa-1e24f5e02b78',
      alt: 'Revenue Dec 2024 - Jan 2025',
      label: 'Dec - Jan Revenue',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Frevenue-01.25-02.25.png?alt=media&token=7f92d550-f0e9-47f9-8d3a-a5032ad972ed',
      alt: 'Revenue Jan - Feb 2025',
      label: 'Jan - Feb Revenue',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Frevenue-03.25-04.25.png?alt=media&token=89817fec-22f4-4178-a350-73f5654aeb75',
      alt: 'Revenue Mar - Apr 2025',
      label: 'Mar - Apr Revenue',
    },
  ],
  sms: [
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FSMS-workflow.png?alt=media&token=e109fd6d-73f6-412e-ad9c-1a8dbfcd6e82',
      alt: 'SMS Automation Workflow',
      label: 'Automation Workflow',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FSMS%201.jpg?alt=media&token=c40ef68e-31f7-47a2-a3be-164fae223363',
      alt: 'SMS Campaign Example 1',
      label: 'Promo Blast',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FSMS%202.jpg?alt=media&token=6e2cf95c-e378-47d2-97ec-af1c7a3d2976',
      alt: 'SMS Campaign Example 2',
      label: 'Order Confirmation',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FSMS%203.jpg?alt=media&token=956641f7-420c-4dd1-8582-87fb43525b3b',
      alt: 'SMS Campaign Example 3',
      label: 'Review Request',
    },
  ],
  email: [
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email1.png?alt=media&token=84e7dadb-2ac7-4fc3-be6b-9f4cd19033f1',
      alt: 'Email Campaign 1',
      label: 'Welcome Email',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email2.png?alt=media&token=ce8b23e0-de09-4d03-aa66-043316df5628',
      alt: 'Email Campaign 2',
      label: 'Promotional Email',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email3.png?alt=media&token=43b5bc06-cd50-4532-a45a-151d65bcf0d4',
      alt: 'Email Campaign 3',
      label: 'Newsletter',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fkravings-email4.png?alt=media&token=bda0de8f-61b1-4efb-8644-13d1dd8028c1',
      alt: 'Email Campaign 4',
      label: 'Re-engagement',
    },
  ],
  seo: [
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fgoogle%20rankings%20kravings.png?alt=media&token=640525af-64a6-4891-9939-0db521cc7253',
      alt: 'Google Rankings for Kravings',
      label: 'Google Rankings',
    },
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Fimpresions-kraivngs.png?alt=media&token=9d0dd6aa-5f41-4ffe-9e89-b006c13ccf8b',
      alt: 'SEO Impressions Growth',
      label: 'Impressions Growth',
    },
  ],
  reviews: [
    {
      src: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2Freviews-kravings.png?alt=media&token=abe396e1-7f7e-448d-b481-35edfc4bddc6',
      alt: 'Google Reviews for Kravings',
      label: 'Google Reviews',
    },
  ],
};

export default function KravingsCaseStudy() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Content - 3 columns */}
            <div className="lg:col-span-3">
              <span className="text-sm font-mono text-merkad-text-muted uppercase tracking-wider">
                Case Study
              </span>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mt-4 leading-tight">
                From $2,358 to $6,988/mo in{' '}
                <span className="text-gradient">4 Months</span>
              </h1>
              <p className="text-merkad-text-secondary mt-6 text-lg">
                How we built a complete digital presence and automated growth system for a cannabis delivery startup.
              </p>

              <Link
                to="/book"
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
              >
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* System Status Card - 2 columns */}
            <div className="lg:col-span-2">
              <div className="system-card w-full max-w-sm lg:ml-auto">
                <div className="system-card-inner">
                  <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider mb-4">
                    System
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Status</span>
                      <span className="text-merkad-green">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Industry</span>
                      <span className="text-white">CANNABIS</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Focus</span>
                      <span className="text-white">DELIVERY</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• Revenue</span>
                      <span className="text-merkad-purple-light">+196%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="browser-frame max-w-4xl mx-auto image-floating">
            <div className="browser-frame-header">
              <div className="browser-frame-dot bg-red-500" />
              <div className="browser-frame-dot bg-yellow-500" />
              <div className="browser-frame-dot bg-green-500" />
            </div>
            <div className="p-2 bg-merkad-bg-tertiary">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FScreenshot%202025-08-21%20153207.png?alt=media&token=87afa2fd-ca5f-4683-ad24-fecb592cca89"
                alt="Kravings Club Website"
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Initial State */}
      <section className="py-20 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                The Challenge
              </span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                Starting From Zero
              </h2>
              <p className="text-merkad-text-secondary mt-4">
                Kravings Club came to us as a brand new cannabis delivery service with zero digital presence. No website, no marketing systems, no way to capture and follow up with customers.
              </p>
            </div>

            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider mb-4">
                  Before
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Website', value: 'NONE' },
                    { label: 'Digital presence', value: 'NONE' },
                    { label: 'Follow-up system', value: 'NONE' },
                    { label: 'Review collection', value: 'NONE' },
                    { label: 'Google reviews', value: '0' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm font-mono">
                      <span className="text-merkad-text-muted">• {item.label}</span>
                      <span className="text-merkad-text-muted">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Built */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              The Solution
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              What We Built
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {systemsBuilt.map((system, index) => (
              <div key={system.title} className="service-card flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center flex-shrink-0">
                  {index === 0 && <Globe className="w-6 h-6 text-white" />}
                  {index === 1 && <MessageSquare className="w-6 h-6 text-white" />}
                  {index === 2 && <Mail className="w-6 h-6 text-white" />}
                  {index === 3 && <Search className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{system.title}</h3>
                  <p className="text-merkad-text-secondary mt-1 text-sm">{system.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-24 lg:py-32 bg-merkad-bg-primary/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Results
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              The Transformation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {results.map((result) => (
              <div key={result.label} className="metric-card text-center">
                <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider">
                  {result.label}
                </div>
                <div className="text-4xl font-mono font-bold text-merkad-purple-light text-glow mt-2">
                  {result.value}
                </div>
                <div className="text-sm text-merkad-green mt-1">
                  {result.growth}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <h3 className="text-xl font-display font-bold text-white mb-4">
                  Now They Have
                </h3>
                <div className="space-y-3">
                  {[
                    'Professional website that converts visitors to orders',
                    'Automated SMS for promos, confirmations, and reviews',
                    'Email sequences for nurturing and retention',
                    'SEO strategy driving 48.8K+ monthly impressions',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-merkad-green flex-shrink-0 mt-0.5" />
                      <span className="text-merkad-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Gallery */}
      <section className="py-24 lg:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Evidence
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
              The Proof
            </h2>
            <p className="text-merkad-text-secondary mt-4">
              Click any image to view full size
            </p>
          </div>

          {/* Revenue Charts */}
          <div className="mb-16">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-merkad-green" />
              Revenue Growth
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.revenue.map((image) => (
                <div key={image.src} className="space-y-2">
                  <ImageLightbox
                    src={image.src}
                    alt={image.alt}
                    className="aspect-video w-full"
                  />
                  <p className="text-sm text-merkad-text-muted text-center">{image.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Automation */}
          <div className="mb-16">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              SMS Automation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.sms.map((image) => (
                <div key={image.src} className="space-y-2">
                  <ImageLightbox
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[3/4] w-full"
                  />
                  <p className="text-sm text-merkad-text-muted text-center">{image.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Email Marketing */}
          <div className="mb-16">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Email Marketing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.email.map((image) => (
                <div key={image.src} className="space-y-2">
                  <ImageLightbox
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[3/4] w-full"
                  />
                  <p className="text-sm text-merkad-text-muted text-center">{image.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO & Rankings */}
          <div className="mb-16">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-merkad-purple-light" />
              SEO & Rankings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryImages.seo.map((image) => (
                <div key={image.src} className="space-y-2">
                  <ImageLightbox
                    src={image.src}
                    alt={image.alt}
                    className="aspect-video w-full"
                  />
                  <p className="text-sm text-merkad-text-muted text-center">{image.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Google Reviews
            </h3>
            <div className="max-w-2xl mx-auto">
              {galleryImages.reviews.map((image) => (
                <div key={image.src} className="space-y-2">
                  <ImageLightbox
                    src={image.src}
                    alt={image.alt}
                    className="aspect-video w-full"
                  />
                  <p className="text-sm text-merkad-text-muted text-center">{image.label}</p>
                </div>
              ))}
            </div>
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
            Ready to Build Your System?
          </h2>
          <p className="text-merkad-text-secondary mt-4 max-w-xl mx-auto">
            See if your business qualifies for a similar growth system.
          </p>
          <Link
            to="/book"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
          >
            Book Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
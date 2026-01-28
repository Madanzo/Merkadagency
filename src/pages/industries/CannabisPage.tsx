import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Workflow, Search, Target, AlertTriangle, Cannabis } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function CannabisPage() {
    return (
        <Layout>
            <SEO
                title="Cannabis Dispensary Marketing"
                description="Compliant marketing and retention systems for dispensaries and delivery services. Grow your customer base safely."
            />
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-green-300">
                                Cannabis Marketing Systems
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight">
                            Growth Systems for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Dispensaries & Delivery</span>
                        </h1>

                        <p className="text-merkad-text-secondary mt-6 text-xl max-w-2xl mx-auto leading-relaxed">
                            Navigate marketing restrictions while building a loyal customer base. Automated retention for the modern cannabis brand.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/book"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                            >
                                Get Your Free Cannabis Audit
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Pain Points */}
            <section className="py-24 bg-merkad-bg-secondary border-y border-white/5">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-mono text-green-400 uppercase tracking-wider">The Challenge</span>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4 mb-6">
                                Marketing cannabis is hard.
                            </h2>
                            <p className="text-merkad-text-secondary text-lg mb-8">
                                With major ad platforms banning cannabis content, you need smarter ways to grow. Relying on Weedmaps isn't enough anymore.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Advertising restrictions on Meta and Google",
                                    "Competing with new dispensaries opening constantly",
                                    "Building repeat customers isn't happening automatically",
                                    "Compliance concerns with every marketing message"
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                                        <span className="text-merkad-text-primary">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-merkad-bg-tertiary rounded-2xl p-8 border border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-merkad-bg-elevated rounded-xl border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-white">Daily Drop Alert</span>
                                        <span className="text-xs text-merkad-text-muted">Now</span>
                                    </div>
                                    <p className="text-sm text-merkad-text-secondary">🔥 Fresh Drop: Blue Dream & Gelato back in stock! Order now for 10% off. <span className="text-blue-400 underline">link.com/menu</span></p>
                                </div>
                                <div className="p-4 bg-merkad-bg-elevated rounded-xl border border-green-500/30 shadow-lg shadow-green-500/10 transform translate-x-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Bot className="w-4 h-4 text-green-400" />
                                            <span className="text-sm font-medium text-white">Loyalty Bot</span>
                                        </div>
                                        <span className="text-xs text-merkad-text-muted">2m ago</span>
                                    </div>
                                    <p className="text-sm text-merkad-text-secondary">Hey Josh! You have <strong className="text-green-400">500 points</strong> expiring soon. Redeem them for a pre-roll on your next order?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-display font-bold text-white">
                            Compliant Growth
                        </h2>
                        <p className="text-merkad-text-secondary mt-4 max-w-2xl mx-auto">
                            We focus on the channels that work: SEO, SMS retention, and compliant advertising.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <ServiceCard
                            icon={Bot}
                            title="Loyalty Automation"
                            description="Capture customer info instantly. Automated SMS sequences for drops, restocks, and birthday promos."
                        />
                        <ServiceCard
                            icon={Target}
                            title="Programmatic Ads"
                            description="Compliant display advertising on mainstream websites. Target cannabis consumers where they browse."
                        />
                        <ServiceCard
                            icon={Search}
                            title="Dispensary SEO"
                            description="Rank for 'dispensary near me' and specific strain searches. Capture high-intent traffic organically."
                        />
                        <ServiceCard
                            icon={Workflow}
                            title="Review Generation"
                            description="Automated review requests after purchase. Build social proof on Google and Leafly automatically."
                        />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-merkad-bg-secondary border-t border-white/5">
                <div className="container-custom max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold text-white">
                            Cannabis Marketing FAQ
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-green-400">How do you advertise with platform restrictions?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                We use programmatic advertising networks that allow compliant cannabis ads on mainstream websites (like CNN, ESPN, etc.) rather than relying on Facebook or Google Ads which often ban accounts.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-green-400">Do you work with delivery-only services?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Yes! Delivery services actually benefit most from our SEO and retention systems because you don't have foot traffic. We help you dominate the digital map.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-green-400">Can you integrate with our POS?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                We integrate with major cannabis tech stacks including Dutchie, Jane, Blaze, and Flowhub to sync customer data and automate loyalty flows.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-green-400">How do you handle compliance?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                We stay up-to-date with state-specific regulations (BCC, etc.). All marketing messages are age-gated and follow strict compliance guidelines to protect your license.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="container-custom text-center">
                    <div className="max-w-2xl mx-auto bg-gradient-to-br from-merkad-bg-tertiary to-merkad-bg-elevated p-8 rounded-3xl border border-white/10">
                        <h2 className="text-3xl font-display font-bold text-white mb-6">
                            Ready to grow your dispensary?
                        </h2>
                        <p className="text-merkad-text-secondary mb-8">
                            Stop relying on Weedmaps. Build your own customer list and revenue engine.
                        </p>
                        <Link
                            to="/book"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-merkad-bg-primary font-bold rounded-xl hover:bg-green-50 transition-colors"
                        >
                            Book Strategy Call
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

function ServiceCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-merkad-bg-tertiary border border-white/5 hover:border-green-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-merkad-text-secondary text-sm leading-relaxed">{description}</p>
        </div>
    );
}

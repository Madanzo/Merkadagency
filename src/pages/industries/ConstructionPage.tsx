import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Workflow, Search, Target, AlertTriangle, Hammer } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function ConstructionPage() {
    return (
        <Layout>
            <SEO
                title="Construction Lead Generation"
                description="Automated lead qualification and scheduling for contractors. Stop chasing tire-kickers and get consistent high-value projects."
            />
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-sm font-medium text-amber-300">
                                Contractor Lead Generation
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight">
                            AI-Powered Lead Gen for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Construction & Home Services</span>
                        </h1>

                        <p className="text-merkad-text-secondary mt-6 text-xl max-w-2xl mx-auto leading-relaxed">
                            Stop chasing tire-kickers. Let qualified projects come to you. Automated qualification for busy contractors.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/book"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                            >
                                Get Your Free Contractor Audit
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Pain Points */}
            <section className="py-24 bg-merkad-bg-secondary border-y border-white/5">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-mono text-amber-400 uppercase tracking-wider">The Struggle</span>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4 mb-6">
                                Feast or famine is not a business plan.
                            </h2>
                            <p className="text-merkad-text-secondary text-lg mb-8">
                                You're either too busy to answer the phone, or wondering where the next job is coming from. Breaks in the pipeline kill growth.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Wasting time on unqualified leads and budget shoppers",
                                    "Inconsistent project pipeline (busy season vs dead season)",
                                    "No time to follow up when you're on the job site",
                                    "Losing bids to lowball competitors who reply faster"
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                                        <span className="text-merkad-text-primary">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-merkad-bg-tertiary rounded-2xl p-8 border border-white/5">
                            <div className="space-y-4">
                                <div className="p-4 bg-merkad-bg-elevated rounded-xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">JD</div>
                                        <div>
                                            <div className="text-sm font-medium text-white">John Doe</div>
                                            <div className="text-xs text-merkad-text-muted">Lead - Kitchen Remodel</div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-merkad-bg-secondary rounded-lg border border-white/5 text-sm text-merkad-text-secondary">
                                        "Just looking for quotes, budget is $5k."
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30">
                                        Auto-Disqualified
                                    </div>
                                </div>
                                <div className="p-4 bg-merkad-bg-elevated rounded-xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-400">SM</div>
                                        <div>
                                            <div className="text-sm font-medium text-white">Sarah Miller</div>
                                            <div className="text-xs text-merkad-text-muted">Lead - Full Home Addition</div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-merkad-bg-secondary rounded-lg border border-white/5 text-sm text-merkad-text-secondary">
                                        "Budget $150k+, need start next month."
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <div className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded border border-green-500/30">Qualified</div>
                                        <div className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">Call Scheduled</div>
                                    </div>
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
                            Built for Contractors
                        </h2>
                        <p className="text-merkad-text-secondary mt-4 max-w-2xl mx-auto">
                            Systems that qualify leads before they ever reach your phone.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <ServiceCard
                            icon={Bot}
                            title="Auto-Qualification"
                            description="Our AI asks project type, budget, and timeline questions instantly. You only talk to serious leads."
                        />
                        <ServiceCard
                            icon={Workflow}
                            title="Follow-Up Automation"
                            description="Automatically nurtures leads while you're on the job site. Reactivates old cold leads for new projects."
                        />
                        <ServiceCard
                            icon={Search}
                            title="Local Service SEO"
                            description="Rank for high-value keywords like 'Kitchen Remodel [City]' or 'Commercial HVAC [City]'."
                        />
                        <ServiceCard
                            icon={Target}
                            title="High-Intent Ads"
                            description="Google Ads that target homeowners actively searching for your service right now. High conversion."
                        />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-merkad-bg-secondary border-t border-white/5">
                <div className="container-custom max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold text-white">
                            Contractor Marketing FAQ
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-amber-400">Do you work with residential or commercial?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Both! We customize your strategy based on your target. Residential often relies more on Google Ads/Local SEO, while commercial benefits from LinkedIn outreach and cold email automation which we also provide.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-amber-400">Can you integrate with our CRM?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Yes, we integrate with JobNimbus, Buildertrend, Housecall Pro, and ServiceTitan to push qualified leads directly into your existing workflow.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-amber-400">How do you filter out small jobs?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Our AI qualification system asks budget questions upfront. If a lead's budget is below your minimum, we can automatically politely decline or refer them elsewhere, saving your sales team time.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-amber-400">What's the typical cost per lead?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                This varies by trade and location, but generally between $50-$150 for a *qualified* lead. We focus on Cost Per *Acquisition* (Signed Job) rather than just raw leads.
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
                            Ready to fill your pipeline?
                        </h2>
                        <p className="text-merkad-text-secondary mb-8">
                            Stop guessing where your next job is coming from. Build a predictable revenue engine.
                        </p>
                        <Link
                            to="/book"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-merkad-bg-primary font-bold rounded-xl hover:bg-amber-50 transition-colors"
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
        <div className="p-6 rounded-2xl bg-merkad-bg-tertiary border border-white/5 hover:border-amber-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-merkad-text-secondary text-sm leading-relaxed">{description}</p>
        </div>
    );
}

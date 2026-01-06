import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Workflow, Search, Target, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function MedspasPage() {
    return (
        <Layout>
            <SEO
                title="MedSpa Marketing Agency"
                description="AI-powered patient acquisition and booking automation for medical spas. Fill your schedule without adding front desk staff."
            />
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            <span className="text-sm font-medium text-pink-300">
                                Medical Spa Marketing Agency
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight">
                            AI-Powered Growth Systems for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Medical Spas</span>
                        </h1>

                        <p className="text-merkad-text-secondary mt-6 text-xl max-w-2xl mx-auto leading-relaxed">
                            Turn website visitors into booked appointments without adding front desk staff. Automated patient acquisition for modern aesthetics clinics.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/book"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                            >
                                Get Your Free Medspa Audit
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Pain Points */}
            <section className="py-24 bg-merkad-bg-secondary border-y border-white/5">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-mono text-pink-400 uppercase tracking-wider">The Problem</span>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4 mb-6">
                                Is your front desk losing you money?
                            </h2>
                            <p className="text-merkad-text-secondary text-lg mb-8">
                                Most medspas are great at treatments but terrible at lead follow-up. If you don't answer the phone, that patient calls the next clinic on Google.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Leads go cold because staff is busy with patients",
                                    "No-shows killing your revenue and specific slot availability",
                                    "Inconsistent follow-up on high-value treatment inquiries",
                                    "Competing with corporate chains that have massive ad budgets"
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
                                <div className="flex items-center justify-between p-4 bg-merkad-bg-secondary rounded-lg border border-white/5 opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700" />
                                        <div className="h-2 w-24 bg-slate-700 rounded" />
                                    </div>
                                    <span className="text-red-400 text-sm">Missed Call (1hr ago)</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-merkad-bg-secondary rounded-lg border border-white/5 opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700" />
                                        <div className="h-2 w-32 bg-slate-700 rounded" />
                                    </div>
                                    <span className="text-red-400 text-sm">No Show</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-merkad-bg-elevated rounded-lg border border-pink-500/30 shadow-lg shadow-pink-500/10 transform scale-105">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-pink-400" />
                                        </div>
                                        <div className="text-white font-medium">Merkad AI Agent</div>
                                    </div>
                                    <span className="text-green-400 text-sm font-mono">Responded in 23s</span>
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
                            Built for Aesthetics
                        </h2>
                        <p className="text-merkad-text-secondary mt-4 max-w-2xl mx-auto">
                            Our core services tailored specifically for the medical spa patient journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <ServiceCard
                            icon={Bot}
                            title="AI Lead Capture"
                            description="Instant response to Botox, filler, and facial inquiries via text. Captures bookings while you sleep."
                        />
                        <ServiceCard
                            icon={Workflow}
                            title="CRM Automation"
                            description="Automated appointment reminders reduce no-shows by 40%. Automatic follow-ups for 6-month treatment cycles."
                        />
                        <ServiceCard
                            icon={Search}
                            title="Local SEO"
                            description="Rank #1 for 'medspa near me' and specific treatments like 'CoolSculpting [City]'."
                        />
                        <ServiceCard
                            icon={Target}
                            title="Targeted Ads"
                            description="High-intent campaigns targeting women 30-55 searching for aesthetic improvements in your area."
                        />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-merkad-bg-secondary border-t border-white/5">
                <div className="container-custom max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold text-white">
                            Medspa Marketing FAQ
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-pink-400">Do you work with software like Zenoti or Boulevard?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Yes, our systems can integrate with most major medspa scheduling software including Zenoti, Boulevard, Mindbody, and Vagaro to sync leads and appointments.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-pink-400">Can you help with HIPAA-compliant marketing?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Absolutely. We understand HIPAA regulations regarding patient data and marketing communications. Our tools and strategies are designed with compliance in mind.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-pink-400">How do you handle leads for different treatments?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Our AI qualifies leads by asking what treatment they are interested in (e.g., Injectables vs. Lasers) and routes them to the correct follow-up sequence or staff member.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-white/10">
                            <AccordionTrigger className="text-white hover:text-pink-400">What is the typical ROI timeline?</AccordionTrigger>
                            <AccordionContent className="text-merkad-text-secondary">
                                Most medspas see an increase in booked appointments within the first 30 days. Full SEO impact typically ramps up over 3-6 months, but our paid ads and reactivation campaigns generate immediate cash flow.
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
                            Ready to fill your appointment book?
                        </h2>
                        <p className="text-merkad-text-secondary mb-8">
                            Stop letting leads slip through the cracks. Let's build a system that books them automatically.
                        </p>
                        <Link
                            to="/book"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-merkad-bg-primary font-bold rounded-xl hover:bg-pink-50 transition-colors"
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

function ServiceCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-merkad-bg-tertiary border border-white/5 hover:border-pink-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-merkad-text-secondary text-sm leading-relaxed">{description}</p>
        </div>
    );
}

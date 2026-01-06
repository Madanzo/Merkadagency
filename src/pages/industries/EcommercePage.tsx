import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Workflow, Search, Target, AlertTriangle, ShoppingCart, TrendingUp, Zap } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function EcommercePage() {
    return (
        <Layout>
            <SEO
                title="E-Commerce Marketing & Automation"
                description="Scale your online store with AI-powered marketing automation. Recover abandoned carts, boost repeat purchases, and grow revenue on autopilot."
            />
            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-sm font-medium text-cyan-300">
                                E-Commerce Growth
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight">
                            AI-Powered Marketing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">E-Commerce Stores</span>
                        </h1>

                        <p className="text-merkad-text-secondary mt-6 text-xl max-w-2xl mx-auto leading-relaxed">
                            Recover abandoned carts, drive repeat purchases, and scale your online store with intelligent automation.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/book"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                            >
                                Get Your Free Store Audit
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Pain Points */}
            <section className="py-24 bg-merkad-bg-secondary border-y border-white/5">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">The Problem</span>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4 mb-6">
                                You're leaving money on the table.
                            </h2>
                            <p className="text-merkad-text-secondary text-lg mb-8">
                                The average e-commerce store loses 70% of carts to abandonment. Manual marketing can't keep up with customer behavior.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Abandoned carts with no automated recovery",
                                    "One-time buyers who never return",
                                    "Rising ad costs eating into margins",
                                    "Inconsistent email/SMS marketing"
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                                        <span className="text-merkad-text-primary">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-merkad-bg-tertiary rounded-2xl p-8 border border-white/5">
                            <div className="text-center space-y-6">
                                <div className="text-6xl font-mono font-bold text-cyan-400">70%</div>
                                <p className="text-merkad-text-secondary">of shopping carts are abandoned without automated recovery systems</p>
                                <div className="h-px bg-white/10"></div>
                                <div className="text-4xl font-mono font-bold text-green-400">$18B+</div>
                                <p className="text-merkad-text-secondary">lost annually by D2C brands to preventable cart abandonment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">E-Commerce Solutions</span>
                        <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mt-4">
                            Turn browsers into buyers. Automatically.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShoppingCart,
                                title: "Abandoned Cart Recovery",
                                description: "Multi-channel sequences across email, SMS, and retargeting to bring customers back.",
                                stats: "Recover 15-30% of lost sales"
                            },
                            {
                                icon: Bot,
                                title: "AI Product Recommendations",
                                description: "Personalized upsells and cross-sells based on browsing and purchase history.",
                                stats: "Increase AOV by 25%"
                            },
                            {
                                icon: TrendingUp,
                                title: "Retention Marketing",
                                description: "Post-purchase flows, VIP programs, and win-back campaigns that drive LTV.",
                                stats: "2x repeat purchase rate"
                            },
                            {
                                icon: Search,
                                title: "E-Commerce SEO",
                                description: "Product page optimization, category targeting, and technical SEO for stores.",
                                stats: "Organic traffic growth"
                            },
                            {
                                icon: Target,
                                title: "Paid Ads (Meta & Google)",
                                description: "ROAS-focused campaigns with dynamic product ads and smart bidding.",
                                stats: "4x+ ROAS target"
                            },
                            {
                                icon: Zap,
                                title: "Store Automation",
                                description: "Inventory alerts, order updates, review requests, and customer service flows.",
                                stats: "Save 20+ hours/week"
                            }
                        ].map((service) => (
                            <div
                                key={service.title}
                                className="group p-6 bg-merkad-bg-secondary rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                                    <service.icon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-merkad-text-secondary mb-4">
                                    {service.description}
                                </p>
                                <div className="text-sm font-mono text-cyan-400">
                                    {service.stats}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Study Preview */}
            <section className="py-24 bg-merkad-bg-secondary border-y border-white/5">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">Client Results</span>
                        <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                            Real E-Commerce Growth
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-merkad-bg-tertiary rounded-2xl p-8 border border-cyan-500/20 shadow-xl shadow-cyan-500/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                    <ShoppingCart className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white">Grid & Guard</h3>
                                    <p className="text-merkad-text-muted">E-Commerce Store</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-4 bg-merkad-bg-elevated rounded-xl">
                                    <div className="text-3xl font-mono font-bold text-cyan-400">+150%</div>
                                    <div className="text-sm text-merkad-text-muted">Revenue Growth</div>
                                </div>
                                <div className="text-center p-4 bg-merkad-bg-elevated rounded-xl">
                                    <div className="text-3xl font-mono font-bold text-cyan-400">28%</div>
                                    <div className="text-sm text-merkad-text-muted">Cart Recovery</div>
                                </div>
                                <div className="text-center p-4 bg-merkad-bg-elevated rounded-xl">
                                    <div className="text-3xl font-mono font-bold text-cyan-400">4.2x</div>
                                    <div className="text-sm text-merkad-text-muted">ROAS</div>
                                </div>
                            </div>

                            <p className="text-merkad-text-secondary mb-6">
                                Complete e-commerce automation including abandoned cart recovery, post-purchase sequences, and retention marketing campaigns.
                            </p>

                            <Link
                                to="/case-studies/gridnguard"
                                className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-white transition-colors btn-arrow"
                            >
                                View Case Study
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">FAQ</span>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                                Common Questions
                            </h2>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {[
                                {
                                    q: "What platforms do you work with?",
                                    a: "We work with all major e-commerce platforms including Shopify, WooCommerce, BigCommerce, and custom builds. Our automation tools integrate seamlessly with most platforms."
                                },
                                {
                                    q: "How quickly can I expect results?",
                                    a: "Abandoned cart recovery typically shows results within the first week. Full marketing automation ROI is usually visible within 30-60 days of implementation."
                                },
                                {
                                    q: "Do you replace my existing email provider?",
                                    a: "Not necessarily. We can enhance your existing Klaviyo, Mailchimp, or other ESP with better automation flows, or recommend a switch if it makes sense for your business."
                                },
                                {
                                    q: "What's your minimum engagement?",
                                    a: "We work with stores doing $50k+/month in revenue. For smaller stores, we offer a one-time automation setup package to get you started."
                                }
                            ].map((item, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`} className="bg-merkad-bg-secondary rounded-xl border border-white/5 px-6">
                                    <AccordionTrigger className="text-left text-white hover:text-cyan-400 py-4">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-merkad-text-secondary pb-4">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-t border-white/5">
                <div className="container-custom text-center">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
                        Ready to Scale Your Store?
                    </h2>
                    <p className="text-merkad-text-secondary text-xl mb-10 max-w-2xl mx-auto">
                        Get a free e-commerce audit and see exactly where you're leaving money on the table.
                    </p>
                    <Link
                        to="/book"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-lg rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                    >
                        Book Your Free Audit
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </Layout>
    );
}

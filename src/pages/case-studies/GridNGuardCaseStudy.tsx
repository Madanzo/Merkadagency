import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, MessageSquare, Mail, Search, CheckCircle2, TrendingUp, BarChart3, Star, Clock, Image as ImageIcon, ShoppingCart } from 'lucide-react';

const systemsBuilt = [
    { title: 'Abandoned Cart Recovery', description: 'Multi-channel automated sequences (Email + SMS)' },
    { title: 'Post-Purchase Flows', description: 'Retention automation to drive repeat purchases' },
    { title: 'Ad Scaling System', description: 'ROAS-focused campaigns on Meta and Google' },
    { title: 'VIP Program', description: 'Tiered loyalty system to increase LTV' },
];

const results = [
    { label: 'Revenue Growth', value: '150%', growth: 'In 3 months' },
    { label: 'Cart Recovery', value: '28%', growth: 'From 0%' },
    { label: 'ROAS', value: '4.2x', growth: 'Target: 3x' },
];

export default function GridNGuardCaseStudy() {
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
                                From Stagnant to <span className="text-cyan-400">150% Growth</span> with Automation
                            </h1>
                            <p className="text-merkad-text-secondary mt-6 text-lg">
                                How Grid & Guard scaled their e-commerce store by automating cart recovery and retention marketing.
                            </p>

                            <Link
                                to="/book"
                                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
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
                                            <span className="text-green-400">SCALING</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-mono">
                                            <span className="text-merkad-text-muted">• Industry</span>
                                            <span className="text-white">E-COMMERCE</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-mono">
                                            <span className="text-merkad-text-muted">• Focus</span>
                                            <span className="text-white">GARDEN / HOME</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-mono">
                                            <span className="text-merkad-text-muted">• ROAS</span>
                                            <span className="text-cyan-400">4.2x</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero Image / Placeholder */}
            <section className="pb-20">
                <div className="container-custom">
                    <div className="browser-frame max-w-4xl mx-auto image-floating">
                        <div className="browser-frame-header">
                            <div className="browser-frame-dot bg-red-500" />
                            <div className="browser-frame-dot bg-yellow-500" />
                            <div className="browser-frame-dot bg-green-500" />
                        </div>
                        <div className="p-20 bg-merkad-bg-tertiary flex items-center justify-center">
                            <div className="text-center">
                                <ShoppingCart className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                <p className="text-merkad-text-muted">Case Study Images Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Initial State */}
            <section className="py-20 bg-merkad-bg-primary/50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">
                                The Challenge
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                                The Leak in the Bucket
                            </h2>
                            <p className="text-merkad-text-secondary mt-4">
                                Grid & Guard had a great product but was losing 70% of potential sales at checkout. They relied on manual emails and had no system to bring customers back for a second purchase.
                            </p>
                        </div>

                        <div className="card-gradient-border">
                            <div className="card-gradient-inner p-8">
                                <h3 className="text-xl font-bold text-white mb-6">Before MerkadFlow</h3>
                                <ul className="space-y-4">
                                    {[
                                        '70% Cart Abandonment Rate',
                                        'Zero automated follow-up',
                                        '100% reliance on new customer acquisition',
                                        'Inconsistent email marketing'
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                            </div>
                                            <span className="text-merkad-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">
                            The Solution
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mt-4">
                            MerkadFlow E-Commerce System
                        </h2>
                        <p className="text-merkad-text-secondary mt-4">
                            We implemented our complete e-commerce automation suite to plug the leaks and scale revenue.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {systemsBuilt.map((system) => (
                            <div key={system.title} className="p-6 rounded-xl bg-merkad-bg-secondary border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
                                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{system.title}</h3>
                                <p className="text-merkad-text-secondary">{system.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-20 bg-merkad-bg-tertiary border-y border-white/5">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
                            The Results
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {results.map((result) => (
                            <div key={result.label} className="text-center p-8 rounded-2xl bg-merkad-bg-elevated border border-white/5">
                                <div className="text-4xl lg:text-5xl font-mono font-bold text-cyan-400 mb-2">
                                    {result.value}
                                </div>
                                <div className="text-white font-medium mb-2">{result.label}</div>
                                <div className="text-sm text-merkad-text-muted">{result.growth}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-3xl p-8 lg:p-12 border border-cyan-500/20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
                                Ready to Scale Your Store?
                            </h2>
                            <p className="text-merkad-text-secondary text-xl mb-8 max-w-2xl mx-auto">
                                Stop losing sales. Get a custom e-commerce automation plan for your business.
                            </p>
                            <Link
                                to="/book"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-merkad-bg-primary font-bold rounded-xl hover:bg-cyan-50 transition-colors btn-arrow"
                            >
                                Get Your Free Audit
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

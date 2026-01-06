import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, Flower, Hammer } from 'lucide-react';

const industries = [
    {
        icon: Gem,
        title: 'Medical Spas & Aesthetics',
        description: 'Booking systems and patient acquisition for high-end aesthetic clinics.',
        href: '/industries/medspas',
        gradient: 'from-pink-500/20 to-purple-500/20',
        iconColor: 'text-pink-400',
        features: ['Patient Scheduling', 'Lead Qualification', 'Treatment Upsells']
    },
    {
        icon: Flower,
        title: 'Cannabis Dispensaries',
        description: 'Compliant delivery logistics and customer retention automation.',
        href: '/industries/cannabis',
        gradient: 'from-green-500/20 to-emerald-500/20',
        iconColor: 'text-green-400',
        features: ['Loyalty Programs', 'Delivery Management', 'Compliance Checks']
    },
    {
        icon: Hammer,
        title: 'Construction & Home Services',
        description: 'Lead qualification and project scheduling for contractors.',
        href: '/industries/construction',
        gradient: 'from-amber-500/20 to-orange-500/20',
        iconColor: 'text-amber-400',
        features: ['Project Quoting', 'Field Coordination', 'Lead Filtering']
    }
];

export default function IndustriesHub() {
    return (
        <Layout>
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
                <div className="container-custom">
                    {/* Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                            Industries
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mt-4">
                            Industries We Specialize In
                        </h1>
                        <p className="text-merkad-text-secondary mt-6 text-lg">
                            AI-powered growth systems built for your industry. We understand the unique challenges of your market.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {industries.map((industry) => (
                            <Link
                                key={industry.title}
                                to={industry.href}
                                className="group relative p-8 rounded-2xl bg-merkad-bg-tertiary border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <div className="relative z-10 flex flex-col flex-1">
                                    <div className={`w-14 h-14 rounded-xl bg-merkad-bg-elevated flex items-center justify-center mb-6 ${industry.iconColor}`}>
                                        <industry.icon className="w-7 h-7" />
                                    </div>

                                    <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-merkad-purple-light transition-colors">
                                        {industry.title}
                                    </h3>
                                    <p className="text-merkad-text-secondary mb-6 leading-relaxed flex-1">
                                        {industry.description}
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        {industry.features.map(f => (
                                            <div key={f} className="flex items-center gap-2 text-sm text-merkad-text-muted">
                                                <div className={`w-1.5 h-1.5 rounded-full ${industry.iconColor.replace('text-', 'bg-')}`} />
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 font-medium text-white group-hover:translate-x-1 transition-transform">
                                        Learn more
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}

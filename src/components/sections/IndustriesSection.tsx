import { Flower, Gem, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';

const industries = [
    {
        icon: Gem,
        title: 'Medical Spas & Aesthetics',
        description: 'Booking systems and patient acquisition for high-end aesthetic clinics.',
        gradient: 'from-pink-500/20 to-purple-500/20',
        iconColor: 'text-pink-400',
        href: '/industries/medspas'
    },
    {
        icon: Flower,
        title: 'Cannabis Dispensaries',
        description: 'Compliant delivery logistics and customer retention automation.',
        gradient: 'from-green-500/20 to-emerald-500/20',
        iconColor: 'text-green-400',
        href: '/industries/cannabis'
    },
    {
        icon: Hammer,
        title: 'Construction & Home Services',
        description: 'Lead qualification and project scheduling for contractors.',
        gradient: 'from-amber-500/20 to-orange-500/20',
        iconColor: 'text-amber-400',
        href: '/industries/construction'
    }
];

export function IndustriesSection() {
    return (
        <section className="relative py-20 border-b border-white/5">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <span className="text-sm font-mono text-merkad-text-muted uppercase tracking-wider">
                        Specialized Industries
                    </span>
                    <h2 className="text-3xl font-display font-bold text-white mt-3">
                        Who We Serve
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {industries.map((industry) => (
                        <Link
                            key={industry.title}
                            to={industry.href}
                            className="group relative p-6 rounded-2xl bg-merkad-bg-tertiary border border-white/5 hover:border-white/10 transition-all duration-300 block"
                        >
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-xl bg-merkad-bg-elevated flex items-center justify-center mb-4 ${industry.iconColor}`}>
                                    <industry.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {industry.title}
                                </h3>
                                <p className="text-sm text-merkad-text-secondary leading-relaxed">
                                    {industry.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

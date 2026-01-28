import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, DollarSign, BarChart3, Star, Clock, CheckCircle2 } from 'lucide-react';
import { IndustryTag, type IndustryType } from '@/components/common/IndustryTag';

// Reusing case study data logic
const featuredWins: {
    client: string;
    industry: string;
    industryType: IndustryType | null;
    stats: { label: string; value: string }[];
    image: string;
    href: string;
}[] = [
        {
            client: 'Kravings',
            industry: 'Cannabis',
            industryType: 'cannabis',
            stats: [
                { label: 'Revenue', value: '+196%' },
                { label: 'Orders', value: '+2.4k' }
            ],
            image: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Kravings%20Club%20Case%20Studie%2FScreenshot%202025-08-21%20153207.png?alt=media&token=87afa2fd-ca5f-4683-ad24-fecb592cca89',
            href: '/case-studies/kravings'
        },
        {
            client: 'Teonanacatl',
            industry: 'Wellness',
            industryType: null, // Fallback for now until Wellness page exists
            stats: [
                { label: 'Visibility', value: '+300%' },
                { label: 'Bookings', value: 'Live' }
            ],
            image: 'https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d17bdd83739a3e136f28ff.png',
            href: '/case-studies/teonanacatl'
        },
        {
            client: 'Grid & Guard',
            industry: 'E-Commerce',
            industryType: 'ecommerce',
            stats: [
                { label: 'Revenue', value: '+150%' },
                { label: 'ROAS', value: '4.2x' }
            ],
            image: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Grid%20n%20Guard%2FGridnGuard%20Website.png?alt=media&token=e50c438d-1d9b-4d4e-9c30-afc4e7322f83',
            href: '/case-studies/gridnguard'
        }
    ];

const impactStats = [
    { label: 'Total Revenue Generated', value: '$2M+', icon: DollarSign, color: 'text-green-400' },
    { label: 'Leads Captured', value: '50k+', icon: Users, color: 'text-blue-400' },
    { label: 'Avg. Client Growth', value: '150%', icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Automations Active', value: '500+', icon: Clock, color: 'text-amber-400' }
];

export default function ResultsPage() {
    return (
        <Layout>
            <SEO
                title="Real Results | MerkadAgency Portfolio"
                description="See how we've generated over $2M in revenue for MedSpas, Cannabis Dispensaries, and Construction firms. Real case studies, real data."
            />

            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
                            Client Wins
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight">
                            Real Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Real Businesses</span>
                        </h1>
                        <p className="text-merkad-text-secondary mt-6 text-xl max-w-2xl mx-auto">
                            We don't deal in vanity metrics. We measure success in revenue, booked appointments, and verified leads.
                        </p>
                    </div>
                </div>
                {/* Background Ambience */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Impact Stats Grid */}
            <section className="py-12 border-y border-white/5 bg-merkad-bg-secondary/50">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {impactStats.map((stat) => (
                            <div key={stat.label} className="text-center p-6 rounded-2xl bg-merkad-bg-tertiary border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex justify-center mb-4">
                                    <div className={`p-3 rounded-full bg-merkad-bg-elevated ${stat.color} bg-opacity-10`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="text-3xl lg:text-4xl font-mono font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-merkad-text-secondary uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Wins */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="flex items-end justify-between mb-16">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
                                Featured Case Studies
                            </h2>
                            <p className="text-merkad-text-secondary mt-2">
                                Deep dives into how we solved complex growth problems.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featuredWins.map((study) => (
                            <Link
                                key={study.client}
                                to={study.href}
                                className="group relative block rounded-2xl overflow-hidden bg-merkad-bg-tertiary border border-white/5 hover:border-merkad-purple/50 transition-all duration-500"
                            >
                                {/* Image Half */}
                                <div className="aspect-video relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-merkad-bg-tertiary to-transparent opacity-60 z-10" />
                                    <img
                                        src={study.image}
                                        alt={`${study.client} Case Study`}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Stats Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-4">
                                        {study.stats.map(stat => (
                                            <div key={stat.label} className="flex-1 bg-merkad-bg-primary/90 backdrop-blur-sm border border-white/10 p-3 rounded-lg text-center">
                                                <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                                                <div className="text-[10px] text-merkad-text-muted uppercase tracking-wider">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Content Half */}
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-display font-bold text-white">{study.client}</div>
                                        {study.industryType ? (
                                            <IndustryTag type={study.industryType} />
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-merkad-bg-elevated text-xs font-medium text-merkad-text-muted">
                                                {study.industry}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-merkad-purple-light group-hover:text-white transition-colors">
                                        Read Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Cross-Link */}
            <section className="py-20 border-t border-white/5 bg-merkad-bg-secondary/30">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-3xl bg-merkad-bg-tertiary border border-white/5 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-merkad-purple/10 to-pink-500/10 opacity-50" />
                        <div className="relative z-10 max-w-xl">
                            <span className="text-sm font-mono text-pink-400 uppercase tracking-wider mb-2 block">
                                Visual Storytelling
                            </span>
                            <h3 className="text-3xl font-display font-bold text-white mb-4">
                                Need High-Converting Video Creative?
                            </h3>
                            <p className="text-merkad-text-secondary">
                                See our library of AI-generated and live-action video content designed to stop the scroll.
                            </p>
                        </div>
                        <div className="relative z-10 flex-shrink-0">
                            <Link
                                to="/portfolio"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-merkad-bg-primary font-bold rounded-xl hover:bg-pink-50 transition-colors"
                            >
                                View Video Portfolio
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-merkad-purple/5" />
                <div className="container-custom relative text-center">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
                        Want results like these?
                    </h2>
                    <p className="text-merkad-text-secondary text-lg max-w-2xl mx-auto mb-10">
                        Stop guessing and start growing. Our systems are pre-built to deliver measurable ROI for your specific industry.
                    </p>
                    <Link
                        to="/book"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                    >
                        Book Your Strategy Call
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </Layout>
    );
}

import { Link } from 'react-router-dom';
import { Gem, Flower, Hammer } from 'lucide-react';

const niches = [
    { label: 'Medical Spas', icon: Gem, href: '/industries/medspas', color: 'text-pink-400', border: 'border-pink-500/20', hover: 'hover:border-pink-500/50' },
    { label: 'Cannabis', icon: Flower, href: '/industries/cannabis', color: 'text-green-400', border: 'border-green-500/20', hover: 'hover:border-green-500/50' },
    { label: 'Construction', icon: Hammer, href: '/industries/construction', color: 'text-amber-400', border: 'border-amber-500/20', hover: 'hover:border-amber-500/50' },
];

export function NicheCallout() {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 animate-on-scroll">
            <span className="text-sm font-mono text-merkad-text-muted uppercase tracking-wider">
                Engineered for:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
                {niches.map((niche) => (
                    <Link
                        key={niche.label}
                        to={niche.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full bg-merkad-bg-tertiary border ${niche.border} ${niche.hover} transition-all duration-300 group`}
                    >
                        <niche.icon className={`w-3.5 h-3.5 ${niche.color}`} />
                        <span className="text-sm font-medium text-merkad-text-secondary group-hover:text-white transition-colors">
                            {niche.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

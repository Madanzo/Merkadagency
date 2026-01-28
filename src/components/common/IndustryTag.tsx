import { Link } from 'react-router-dom';
import { Gem, Flower, Hammer, ShoppingCart } from 'lucide-react';

export type IndustryType = 'medspa' | 'cannabis' | 'construction' | 'ecommerce' | 'wellness';

const config = {
    medspa: {
        label: 'Medical Spa',
        icon: Gem,
        href: '/industries/medspas',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        hover: 'hover:border-pink-500/50'
    },
    cannabis: {
        label: 'Cannabis',
        icon: Flower,
        href: '/industries/cannabis',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        hover: 'hover:border-green-500/50'
    },
    construction: {
        label: 'Construction',
        icon: Hammer,
        href: '/industries/construction',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        hover: 'hover:border-amber-500/50'
    },
    ecommerce: {
        label: 'E-Commerce',
        icon: ShoppingCart,
        href: '/industries/ecommerce',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        hover: 'hover:border-cyan-500/50'
    },
    wellness: {
        label: 'Wellness & Retreats',
        icon: Gem,
        href: '/industries/medspas',
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        hover: 'hover:border-pink-500/50'
    }
};

interface IndustryTagProps {
    type: IndustryType;
    className?: string;
}

export function IndustryTag({ type, className = '' }: IndustryTagProps) {
    const style = config[type];
    const Icon = style.icon;

    return (
        <Link
            to={style.href}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${style.bg} ${style.border} ${style.hover} ${className} group`}
        >
            <Icon className={`w-3.5 h-3.5 ${style.color}`} />
            <span className="text-white group-hover:underline decoration-white/30 underline-offset-2">
                {style.label}
            </span>
        </Link>
    );
}

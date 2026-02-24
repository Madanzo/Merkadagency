// Service Library Types

export type ServiceCategory = 'base' | 'one-time' | 'monthly' | 'creative' | 'bundle';

export type ServicePriceType = 'one-time' | 'monthly' | 'per-item' | 'per-session';

export type ServiceSubcategory =
    | 'E-commerce'
    | 'UI/UX'
    | 'AI Features'
    | 'SEO & Marketing'
    | 'Content'
    | 'Funnels'
    | 'Integrations'
    | 'Platform'
    | 'Technical'
    | 'Training'
    | 'Marketing Management'
    | 'Community & Reputation'
    | 'Analytics & Optimization'
    | 'Maintenance & Support'
    | 'Social Media'
    | 'Blog & Content'
    | 'Video Production'
    | 'Ad Creative'
    | 'Brand & Design'
    | 'Email & Newsletter'
    | 'YouTube & Podcast'
    | 'Platform-Specific'
    | 'Print & Documents'
    | 'Other Creative';

export interface MonthlyFee {
    name: string;
    price: number;
    id: string;
}

export interface Service {
    id: string;
    name: string;
    category: ServiceCategory;
    subcategory?: ServiceSubcategory;
    price: number;
    priceType: ServicePriceType;
    priceNote?: string; // e.g., "per 25 products", "per session"
    shortDescription: string; // 1 sentence for card view
    fullDescription: string; // Detailed explanation
    includes: string[]; // Bullet points
    sellWhen: string[]; // Trigger phrases
    relatedServices: string[]; // IDs of related services
    monthlyFee?: MonthlyFee; // If this one-time service has associated monthly
    tags: string[]; // For search
}

// Category colors for badges
export const CATEGORY_COLORS: Record<ServiceCategory, { bg: string; text: string }> = {
    'base': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    'one-time': { bg: 'bg-green-500/20', text: 'text-green-400' },
    'monthly': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    'creative': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    'bundle': { bg: 'bg-pink-500/20', text: 'text-pink-400' },
};

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
    'base': 'Base Package',
    'one-time': 'One-Time Add-on',
    'monthly': 'Monthly Fee',
    'creative': 'Creative Service',
    'bundle': 'Bundle',
};

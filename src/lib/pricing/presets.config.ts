import type { PresetState } from './calculator.types';

export interface Preset {
    id: string;
    name: string;
    description: string;
    oneTimeTotal: number;
    monthlyTotal: number;
    state: PresetState;
}

export const PRESETS: Preset[] = [
    {
        id: 'cannabis-dispensary',
        name: 'Cannabis Dispensary',
        description: 'AI Stack + E-commerce + Local SEO + Menu System',
        oneTimeTotal: 10200,
        monthlyTotal: 3700,
        state: {
            basePackage: 'ai-stack',
            addons: {
                ecommerce: 'standard',
                paymentGateway: true,
                uiux: 'semi',
                seo: 'local',
                productDescriptions: true,
                socialMedia: 'standard',
                videoProduction: 'basic',
            },
        },
    },
    {
        id: 'medspa-growth',
        name: 'Med Spa',
        description: 'Automation + Auto-booking + Full UX + Local SEO + Socials',
        oneTimeTotal: 10000,
        monthlyTotal: 3150,
        state: {
            basePackage: 'automation',
            addons: {
                aiChatbot: true,
                autoBooking: true,
                uiux: 'full',
                seo: 'local',
                content: 'basic',
                socialMedia: 'standard',
                adCreative: 'staticOnly',
            },
        },
    },
    {
        id: 'construction-leadgen',
        name: 'Roofing/Construction',
        description: 'Growth + AI Caller + Google Ads + Single Landing Page',
        oneTimeTotal: 6200,
        monthlyTotal: 2550,
        state: {
            basePackage: 'growth',
            addons: {
                aiCaller: true,
                googleAds: true,
                seo: 'basic',
                landingPage: true,
                adCreative: 'staticVideo',
            },
        },
    },
    {
        id: 'ecommerce-standard',
        name: 'E-commerce Store',
        description: 'Foundation + Store + Payment + Shipping + SEO',
        oneTimeTotal: 4400,
        monthlyTotal: 150,
        state: {
            basePackage: 'foundation',
            addons: {
                ecommerce: 'standard',
                paymentGateway: true,
                shipping: true,
                uiux: 'semi',
                seo: 'basic',
                productDescriptions: true,
            },
        },
    },
    {
        id: 'full-creative',
        name: 'Full Creative Client',
        description: 'Creative Only + Premium Social + Video + Ads + Blog',
        oneTimeTotal: 0,
        monthlyTotal: 7250,
        state: {
            basePackage: 'none',
            addons: {
                socialMedia: 'premium',
                videoProduction: 'standard',
                adCreative: 'fullSuite',
                blogWriting: 'standard',
            },
        },
    },
    {
        id: 'enterprise-full',
        name: 'Enterprise Full Stack',
        description: 'AI Stack + E-commerce Enterprise + Full UX + Brand + Custom AI',
        oneTimeTotal: 21600,
        monthlyTotal: 7500,
        state: {
            basePackage: 'ai-stack',
            addons: {
                ecommerce: 'enterprise',
                paymentGateway: true,
                shipping: true,
                uiux: 'full',
                brandIdentity: true,
                aiCaller: true,
                customAiWorkflow: true,
                seo: 'advanced',
                fullOnboarding: true,
                socialMedia: 'premium',
                videoProduction: 'standard',
                adCreative: 'fullSuite',
            },
        },
    },
];


import type { Service } from './service.types';

export const SERVICES: Service[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // BASE PACKAGES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'creative-only',
        name: 'Creative Only',
        category: 'base',
        price: 0,
        priceType: 'one-time',
        shortDescription: 'Video/Ads only - no website build.',
        fullDescription: 'Client only wants content/ads, no website or tech build. Opens access to monthly creative services.',
        includes: ['Access to creative services', 'No website build', 'No hosting required'],
        sellWhen: ['Client already has a website they like', 'They only need social media, video, or ads', 'Agency referral for creative work only'],
        relatedServices: ['social-basic', 'video-basic', 'ad-creative-static'],
        tags: ['creative', 'content', 'no build']
    },
    {
        id: 'foundation',
        name: 'Foundation',
        category: 'base',
        price: 1500,
        priceType: 'one-time',
        shortDescription: 'Custom website with basic lead capture.',
        fullDescription: 'Professional website with hosting, forms, analytics, and basic SEO. Perfect for new businesses needing an online presence.',
        includes: ['Custom website (Next.js + Firebase)', 'Hosting setup', 'Contact forms', 'Google Analytics', 'Basic on-page SEO'],
        sellWhen: ['New business needs online presence', 'Replacing old/ugly website', 'Simple service business (1-5 services)'],
        relatedServices: ['growth', 'basic-seo', 'basic-copywriting'],
        monthlyFee: { name: 'Hosting & Maintenance', price: 150, id: 'hosting' },
        tags: ['website', 'basic', 'starter']
    },
    {
        id: 'growth',
        name: 'Growth',
        category: 'base',
        price: 2800,
        priceType: 'one-time',
        shortDescription: 'Website + CRM to track and manage leads.',
        fullDescription: 'Everything in Foundation plus a full CRM system with pipelines, lead tracking, and dashboards.',
        includes: ['Everything in Foundation', 'CRM setup (lead tracking)', 'Sales pipelines', 'Calendar integration', 'Basic dashboard', 'Lead notifications'],
        sellWhen: ['Client is getting leads but losing track', 'Multiple team members need to see leads', '"How do I know who to follow up with?"'],
        relatedServices: ['foundation', 'automation', 'crm-migration'],
        monthlyFee: { name: 'CRM Management', price: 300, id: 'crm-management' },
        tags: ['website', 'crm', 'leads', 'pipeline']
    },
    {
        id: 'automation',
        name: 'Automation',
        category: 'base',
        price: 4500,
        priceType: 'one-time',
        shortDescription: 'Website + CRM + automated follow-up sequences.',
        fullDescription: 'Everything in Growth plus email/SMS automation, abandoned cart recovery, and lead nurturing sequences.',
        includes: ['Everything in Growth', 'Email sequences', 'SMS sequences', 'Abandoned cart recovery', 'Lead segmentation', 'Re-engagement campaigns'],
        sellWhen: ['"I don\'t have time to follow up with everyone"', 'Leads going cold because no one calls back', 'Want "set it and forget it" follow-up'],
        relatedServices: ['growth', 'ai-stack', 'ai-chatbot'],
        monthlyFee: { name: 'Automation Management', price: 450, id: 'automation-management' },
        tags: ['website', 'crm', 'automation', 'email', 'sms']
    },
    {
        id: 'ai-stack',
        name: 'AI Stack',
        category: 'base',
        price: 7000,
        priceType: 'one-time',
        shortDescription: 'Full system with AI handling conversations and booking.',
        fullDescription: 'Complete solution with AI chatbot, AI caller, lead scoring, and auto-booking. Leads get qualified and booked without staff involvement.',
        includes: ['Everything in Automation', 'AI chatbot', 'AI caller', 'Lead scoring', 'Auto-booking'],
        sellWhen: ['Wants leads booked without staff', 'Missing calls/chats after hours', 'High volume of inquiries', '"I wish someone could answer 24/7"'],
        relatedServices: ['automation', 'ai-chatbot', 'ai-caller'],
        monthlyFee: { name: 'AI Stack Management', price: 750, id: 'ai-stack-management' },
        tags: ['website', 'crm', 'automation', 'ai', 'chatbot', 'caller']
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // AI FEATURES (One-Time Add-ons)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ai-chatbot',
        name: 'AI Chatbot',
        category: 'one-time',
        subcategory: 'AI Features',
        price: 1200,
        priceType: 'one-time',
        shortDescription: 'AI that answers visitor questions and captures leads.',
        fullDescription: 'Intelligent chatbot that handles FAQs, qualifies leads by asking questions, and captures contact info 24/7.',
        includes: ['Answers FAQs', 'Qualifies leads', 'Captures contact info', 'Available 24/7'],
        sellWhen: ['"We miss a lot of chats"', '"I answer the same questions all day"', '"I wish someone could answer 24/7"'],
        relatedServices: ['ai-caller', 'auto-booking', 'ai-stack'],
        monthlyFee: { name: 'AI Chat Management', price: 350, id: 'ai-chat-management' },
        tags: ['ai', 'chatbot', 'lead capture', '24/7']
    },
    {
        id: 'ai-caller',
        name: 'AI Caller (Setup)',
        category: 'one-time',
        subcategory: 'AI Features',
        price: 1800,
        priceType: 'one-time',
        shortDescription: 'AI that makes/receives phone calls.',
        fullDescription: 'AI phone system that follows up with leads, answers incoming calls, qualifies prospects, and books appointments.',
        includes: ['Follows up by phone', 'Answers incoming calls', 'Qualifies and books', 'Natural-sounding voice'],
        sellWhen: ['"We can\'t call everyone back"', '"We miss calls after hours"', 'High volume of phone inquiries'],
        relatedServices: ['ai-chatbot', 'auto-booking', 'ai-stack'],
        monthlyFee: { name: 'AI Caller Usage', price: 500, id: 'ai-caller-usage' },
        tags: ['ai', 'phone', 'caller', 'voice', 'follow-up']
    },
    {
        id: 'lead-scoring',
        name: 'Lead Scoring AI',
        category: 'one-time',
        subcategory: 'AI Features',
        price: 800,
        priceType: 'one-time',
        shortDescription: 'AI that ranks leads by likelihood to buy.',
        fullDescription: 'Analyzes lead behavior and data to score leads as hot/warm/cold.',
        includes: ['Analyzes lead behavior', 'Scores hot/warm/cold', 'Prioritizes follow-up list'],
        sellWhen: ['High lead volume', 'Sales needs to focus on best leads', '"We waste time on bad leads"'],
        relatedServices: ['ai-chatbot', 'ai-caller', 'ai-stack'],
        monthlyFee: { name: 'Lead Scoring Management', price: 250, id: 'lead-scoring-management' },
        tags: ['ai', 'lead scoring', 'prioritization', 'sales']
    },
    {
        id: 'auto-booking',
        name: 'Auto-booking System',
        category: 'one-time',
        subcategory: 'AI Features',
        price: 1000,
        priceType: 'one-time',
        shortDescription: 'AI-powered booking that qualifies and schedules.',
        fullDescription: 'Smart booking that asks qualifying questions, routes to right appointment type, books automatically.',
        includes: ['Asks qualifying questions', 'Routes to right appointment', 'Books with right team member', 'Sends confirmations'],
        sellWhen: ['"People book wrong appointments"', '"I want leads booked automatically"', 'Multiple appointment types/staff'],
        relatedServices: ['booking-system', 'ai-chatbot', 'ai-stack'],
        monthlyFee: { name: 'Auto-booking Management', price: 200, id: 'auto-booking-management' },
        tags: ['ai', 'booking', 'scheduling', 'automation']
    },
    {
        id: 'custom-ai-workflow',
        name: 'Custom AI Workflow',
        category: 'one-time',
        subcategory: 'AI Features',
        price: 2500,
        priceType: 'one-time',
        shortDescription: 'Custom AI automation for unique business needs.',
        fullDescription: 'Build custom AI automations specific to client\'s unique processes.',
        includes: ['Custom AI logic', 'Specific to their workflow', 'Integration with their systems'],
        sellWhen: ['Unique process that AI could handle', 'Standard AI features don\'t fit', 'Complex automation requirements'],
        relatedServices: ['ai-chatbot', 'ai-caller', 'complex-workflow'],
        tags: ['ai', 'custom', 'workflow', 'automation']
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // E-COMMERCE (One-Time Add-ons)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ecommerce-basic',
        name: 'Basic Store (≤25 products)',
        category: 'one-time',
        subcategory: 'E-commerce',
        price: 800,
        priceType: 'one-time',
        shortDescription: 'Simple online store for up to 25 products.',
        fullDescription: 'Perfect for small product catalogs. Includes product pages, cart, and checkout.',
        includes: ['Up to 25 products', 'Product pages', 'Shopping cart', 'Checkout flow'],
        sellWhen: ['Small product catalog', 'Just starting e-commerce', 'Testing online sales'],
        relatedServices: ['ecommerce-standard', 'payment-gateway', 'shipping'],
        tags: ['ecommerce', 'store', 'products', 'small']
    },
    {
        id: 'ecommerce-standard',
        name: 'Standard Store (26-100 products)',
        category: 'one-time',
        subcategory: 'E-commerce',
        price: 1400,
        priceType: 'one-time',
        shortDescription: 'Full-featured store for growing catalogs.',
        fullDescription: 'Robust store with categories, filters, search, and inventory management.',
        includes: ['26-100 products', 'Categories & filters', 'Search', 'Inventory tracking', 'Discount codes'],
        sellWhen: ['Growing product line', 'Multiple categories', 'Need inventory management'],
        relatedServices: ['ecommerce-enterprise', 'payment-gateway', 'shipping'],
        tags: ['ecommerce', 'store', 'products', 'medium']
    },
    {
        id: 'ecommerce-enterprise',
        name: 'Enterprise Store (100+ products)',
        category: 'one-time',
        subcategory: 'E-commerce',
        price: 2500,
        priceType: 'one-time',
        shortDescription: 'Large-scale e-commerce with advanced features.',
        fullDescription: 'Enterprise solution with bulk management, variants, wholesale pricing, and advanced analytics.',
        includes: ['Unlimited products', 'Bulk management', 'Product variants', 'Wholesale pricing', 'Advanced analytics'],
        sellWhen: ['Large catalog', 'B2B + B2C sales', 'Complex product variants', 'Multiple price tiers'],
        relatedServices: ['ecommerce-standard', 'shipping', 'product-descriptions'],
        tags: ['ecommerce', 'store', 'enterprise', 'large']
    },
    {
        id: 'payment-gateway',
        name: 'Payment Gateway',
        category: 'one-time',
        subcategory: 'E-commerce',
        price: 400,
        priceType: 'one-time',
        shortDescription: 'Stripe/Square integration for payments.',
        fullDescription: 'Payment processing setup with secure checkout, saved cards, and payment methods.',
        includes: ['Stripe or Square setup', 'Secure checkout', 'Multiple payment methods', 'Saved cards'],
        sellWhen: ['Need to accept payments online', 'Selling products or services', 'Booking deposits'],
        relatedServices: ['ecommerce-basic', 'ecommerce-standard', 'booking-system'],
        tags: ['payments', 'stripe', 'checkout', 'ecommerce']
    },
    {
        id: 'shipping',
        name: 'Shipping & Inventory',
        category: 'one-time',
        subcategory: 'E-commerce',
        price: 600,
        priceType: 'one-time',
        shortDescription: 'Shipping rates & inventory management.',
        fullDescription: 'Automated shipping calculator, inventory tracking, low stock alerts, and shipping label generation.',
        includes: ['Real-time shipping rates', 'Inventory tracking', 'Low stock alerts', 'Shipping labels'],
        sellWhen: ['Shipping physical products', 'Need inventory tracking', 'Want automated shipping'],
        relatedServices: ['ecommerce-standard', 'ecommerce-enterprise'],
        tags: ['shipping', 'inventory', 'ecommerce', 'logistics']
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // BRAND & DESIGN (One-Time Add-ons)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'logo-design',
        name: 'Logo Design',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 800,
        priceType: 'one-time',
        shortDescription: 'Custom logo design (no full brand package).',
        fullDescription: 'Professional logo design for your business. Includes concept development, revisions, and final files in all formats.',
        includes: ['Logo concept development', '3 revision rounds', 'Vector files (AI, EPS, SVG)', 'PNG files (transparent \u0026 white background)', 'Color \u0026 black/white versions'],
        sellWhen: ['New business needs a logo', 'Rebranding/logo refresh', 'Current logo looks outdated', 'Need professional logo for credibility'],
        relatedServices: ['logo-variations', 'brand-guidelines', 'social-brand-kit'],
        tags: ['logo', 'design', 'branding', 'identity']
    },
    {
        id: 'logo-variations',
        name: 'Logo + Variations',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 1200,
        priceType: 'one-time',
        shortDescription: 'Logo with horizontal, vertical, and icon versions.',
        fullDescription: 'Complete logo suite with multiple variations for different use cases. Perfect for businesses that need flexibility across platforms.',
        includes: ['Primary horizontal logo', 'Vertical stacked logo', 'Icon/badge version', 'All file formats', 'Usage guide'],
        sellWhen: ['Need logo for multiple uses (website, signage, social, print)', 'Want flexibility for different layouts', 'Professional brand presentation'],
        relatedServices: ['logo-design', 'brand-guidelines', 'social-brand-kit'],
        tags: ['logo', 'variations', 'branding', 'flexible']
    },
    {
        id: 'brand-guidelines',
        name: 'Brand Guidelines Document',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 600,
        priceType: 'one-time',
        shortDescription: 'Colors, fonts, usage rules (no logo design).',
        fullDescription: 'Professional brand guidelines document defining your visual identity. Essential for consistent branding across all materials.',
        includes: ['Color palette with hex/RGB codes', 'Typography specifications', 'Logo usage rules', 'Do\'s and don\'ts', 'PDF brand guide'],
        sellWhen: ['Have a logo but no consistent branding', 'Team needs branding standards', 'Hiring designers/agencies who need guidelines', 'Want professional brand consistency'],
        relatedServices: ['logo-design', 'logo-variations', 'social-brand-kit'],
        tags: ['branding', 'guidelines', 'standards', 'consistency']
    },
    {
        id: 'social-brand-kit',
        name: 'Social Media Brand Kit',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 500,
        priceType: 'one-time',
        shortDescription: 'Profile pics, covers, templates for all platforms.',
        fullDescription: 'Complete social media branding package with sized assets for all major platforms. Ready to upload and use immediately.',
        includes: ['Profile pictures (all platforms)', 'Cover/header images', 'Story templates', 'Post templates', 'Platform-specific sizing'],
        sellWhen: ['Launching social media presence', 'Social profiles look unprofessional', 'Need branded templates for consistent posts', 'Want ready-to-use social assets'],
        relatedServices: ['logo-design', 'brand-guidelines', 'social-media-basic'],
        tags: ['social media', 'branding', 'templates', 'profiles']
    },
    {
        id: 'email-signature',
        name: 'Email Signature Design',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 150,
        priceType: 'one-time',
        shortDescription: 'Professional HTML email signature.',
        fullDescription: 'Custom-designed HTML email signature with your branding, contact info, and social links. Works in Gmail, Outlook, and Apple Mail.',
        includes: ['HTML email signature', 'Logo \u0026 branding', 'Contact info \u0026 social links', 'Mobile-responsive', 'Installation instructions'],
        sellWhen: ['Want professional email appearance', 'Every email is a branding opportunity', 'Team needs consistent signatures', 'Current signatures look unprofessional'],
        relatedServices: ['logo-design', 'brand-guidelines'],
        tags: ['email', 'signature', 'professional', 'branding']
    },
    {
        id: 'letterhead-invoice',
        name: 'Letterhead \u0026 Invoice Template',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 300,
        priceType: 'one-time',
        shortDescription: 'Branded business documents.',
        fullDescription: 'Professional letterhead and invoice templates with your branding. Editable in Word, Google Docs, or PDF format.',
        includes: ['Letterhead template', 'Invoice template', 'Editable file formats', 'Print-ready PDFs', 'Usage instructions'],
        sellWhen: ['Need professional business documents', 'Invoices look unprofessional', 'Want branded correspondence', 'B2B clients expect professional docs'],
        relatedServices: ['logo-design', 'brand-guidelines'],
        tags: ['letterhead', 'invoice', 'documents', 'professional']
    },
    {
        id: 'vehicle-wrap',
        name: 'Vehicle Wrap Design',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 800,
        priceType: 'one-time',
        shortDescription: 'Design for trucks/vans (roofing, contractors).',
        fullDescription: 'Full vehicle wrap design for trucks, vans, or trailers. Includes print-ready files for professional installation. Perfect for contractors, roofers, and service businesses.',
        includes: ['Full vehicle wrap design', 'Print-ready vector files', '3D mockup preview', 'Installation guide', 'Sizing for your vehicle'],
        sellWhen: ['Service business with truck fleet', 'Want mobile advertising', 'Compete with other contractors', 'Turn vehicles into billboards'],
        relatedServices: ['logo-design', 'signage-design'],
        tags: ['vehicle wrap', 'truck', 'advertising', 'contractors']
    },
    {
        id: 'signage-design',
        name: 'Signage Design',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 400,
        priceType: 'one-time',
        shortDescription: 'Storefront, banners, yard signs.',
        fullDescription: 'Professional signage design for storefronts, banners, yard signs, or trade show displays. Print-ready files for any sign shop.',
        includes: ['Custom signage design', 'Print-ready files', 'Multiple size options', 'Indoor \u0026 outdoor versions', 'Sign shop specifications'],
        sellWhen: ['Opening new location', 'Need storefront sign', 'Trade shows/events', 'Contractors need yard signs', 'Want professional signage'],
        relatedServices: ['logo-design', 'vehicle-wrap', 'banner-design'],
        tags: ['signage', 'storefront', 'banners', 'yard signs']
    },
    {
        id: 'menu-catalog',
        name: 'Menu/Catalog Design',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 600,
        priceType: 'one-time',
        shortDescription: 'For dispensaries, restaurants, product catalogs.',
        fullDescription: 'Professional menu or catalog design for dispensaries, restaurants, or product-based businesses. Print and digital versions included.',
        includes: ['Custom layout design', 'Product/item formatting', 'Print-ready PDF', 'Digital/web version', 'Editable template for updates'],
        sellWhen: ['Cannabis dispensary needs menu', 'Restaurant needs professional menu', 'Product catalog for wholesale', 'Current menu looks cheap'],
        relatedServices: ['logo-design', 'brand-guidelines', 'packaging-design'],
        tags: ['menu', 'catalog', 'dispensary', 'restaurant']
    },
    {
        id: 'packaging-design',
        name: 'Packaging Design',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 700,
        priceType: 'one-time',
        shortDescription: 'Product packaging (cannabis, medspa, retail).',
        fullDescription: 'Custom packaging design for cannabis products, medspa skincare, or retail goods. Includes dielines and print specifications.',
        includes: ['Package design concept', 'Label design', 'Print-ready files with dielines', '3D mockups', 'Compliance formatting (if required)'],
        sellWhen: ['Launching product line', 'Cannabis packaging needs', 'Medspa skincare products', 'Want shelf-ready professional packaging'],
        relatedServices: ['logo-design', 'menu-catalog', 'brand-guidelines'],
        tags: ['packaging', 'cannabis', 'medspa', 'products']
    },
    {
        id: 'merchandise-design',
        name: 'Merchandise Design',
        category: 'one-time',
        subcategory: 'Brand & Design',
        price: 350,
        priceType: 'one-time',
        shortDescription: 'T-shirts, hats, swag design.',
        fullDescription: 'Custom merchandise design for branded apparel and swag. Print-ready files for t-shirts, hats, hoodies, and promotional items.',
        includes: ['Apparel design concept', 'Print-ready vector files', 'Multiple colorways', 'Sizing specifications', 'Mockup previews'],
        sellWhen: ['Want branded merchandise', 'Team uniforms needed', 'Event giveaways/swag', 'Selling branded apparel', 'Cannabis/lifestyle brand merchandise'],
        relatedServices: ['logo-design', 'social-brand-kit'],
        tags: ['merchandise', 'apparel', 't-shirts', 'swag']
    },
];

// Search helper function
export function searchServices(query: string): Service[] {
    const lowerQuery = query.toLowerCase();
    return SERVICES.filter(service =>
        service.name.toLowerCase().includes(lowerQuery) ||
        service.shortDescription.toLowerCase().includes(lowerQuery) ||
        service.tags.some(tag => tag.includes(lowerQuery)) ||
        service.sellWhen.some(phrase => phrase.toLowerCase().includes(lowerQuery))
    );
}

// Filter by category
export function filterByCategory(category: string): Service[] {
    if (category === 'all') return SERVICES;
    return SERVICES.filter(s => s.category === category);
}

// Filter by subcategory
export function filterBySubcategory(subcategory: string): Service[] {
    if (subcategory === 'all') return SERVICES;
    return SERVICES.filter(s => s.subcategory === subcategory);
}

// Get service by ID
export function getServiceById(id: string): Service | undefined {
    return SERVICES.find(s => s.id === id);
}

// Get related services
export function getRelatedServices(service: Service): Service[] {
    return service.relatedServices
        .map(id => getServiceById(id))
        .filter((s): s is Service => s !== undefined);
}

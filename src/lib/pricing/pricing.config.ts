// THESE ARE YOUR FLOORS - DO NOT LOWER
// Prices reflect senior-level Next.js + Firebase + AI development

export const BASE_PACKAGES = {
    none: {
        price: 0,
        label: 'Creative Only',
        description: 'Video editing, ads, content creation - no website build or management',
        features: ['Video Editing & Production', 'Ad Creative Services', 'Content Creation Only', 'No Website Build', 'No Site Management']
    },
    foundation: {
        price: 1500,
        label: 'Foundation',
        description: 'Custom site, Firebase hosting, forms, analytics, base SEO',
        features: ['Custom Next.js Website', 'Firebase Hosting & Analytics', 'Contact Forms & Lead Capture', 'Basic SEO Setup', 'Mobile Responsive Design']
    },
    growth: {
        price: 2800,
        label: 'Growth',
        description: 'CRM setup, pipelines, lead tracking, dashboards, basic integrations',
        features: ['Everything in Foundation', 'Custom CRM Setup', 'Sales Pipelines', 'Lead Tracking Dashboard', 'Calendar Integration']
    },
    automation: {
        price: 4500,
        label: 'Automation',
        description: 'Email/SMS flows, follow-ups, abandoned cart, re-engagement, segmentation',
        features: ['Everything in Growth', 'Email Marketing Flows', 'SMS Notifications', 'Abandoned Cart Recovery', 'Customer Segmentation']
    },
    'ai-stack': {
        price: 7000,
        label: 'AI Stack',
        description: 'AI chat, AI caller, lead classification, auto-booking, AI sales/support',
        features: ['Everything in Automation', 'AI Customer Service Chatbot', 'AI Sales Caller', 'Auto-booking Assistant', 'Smart Lead Classification']
    },
} as const;

export const ADDONS = {
    // E-commerce
    ecommerce: {
        none: { price: 0, label: 'No E-commerce' },
        basic: { price: 800, label: 'Basic Store (up to 25 products)' },
        standard: { price: 1400, label: 'Standard Store (26-100 products)' },
        enterprise: { price: 2500, label: 'Enterprise Store (100+ products)' },
    },
    paymentGateway: { price: 400, label: 'Payment Gateway Integration' },
    shipping: { price: 600, label: 'Shipping/Inventory System' },

    // UI/UX
    uiux: {
        template: { price: 0, label: 'Template-based' },
        semi: { price: 1000, label: 'Semi-custom Design' },
        full: { price: 2500, label: 'Full Custom UX' },
    },
    brandIdentity: { price: 3000, label: 'Brand Identity Package' },

    // AI Features
    aiChatbot: { price: 1200, label: 'AI Chatbot' },
    aiCaller: { price: 1800, label: 'AI Caller (Setup)' },
    leadScoring: { price: 800, label: 'Lead Scoring AI' },
    autoBooking: { price: 1000, label: 'Auto-booking System' },
    customAiWorkflow: { price: 2500, label: 'Custom AI Workflow' },

    // SEO & Marketing
    seo: {
        none: { price: 0, label: 'No SEO Setup' },
        basic: { price: 400, label: 'Basic SEO Setup' },
        local: { price: 800, label: 'Local SEO Package' },
        advanced: { price: 1500, label: 'Advanced SEO' },
    },
    googleAds: { price: 600, label: 'Google Ads Setup' },
    metaAds: { price: 600, label: 'Meta Ads Setup' },
    tiktokAds: { price: 600, label: 'TikTok Ads Setup' },

    // Content
    content: {
        none: { price: 0, label: 'No Content Package' },
        basic: { price: 500, label: 'Basic Copywriting (5 pages)' },
        full: { price: 1200, label: 'Full Content Package (10+ pages)' },
    },
    productDescriptions: { price: 400, label: 'Product Descriptions (per 25)' },
    blogSetup: { price: 800, label: 'Blog Setup + 4 Posts' },

    // Funnels & Landing Pages
    landingPage: { price: 600, label: 'Single Landing Page' },
    salesFunnel: { price: 1500, label: 'Sales Funnel (3-5 pages)' },
    webinarFunnel: { price: 1200, label: 'Webinar/Event Funnel' },
    leadMagnetFunnel: { price: 800, label: 'Lead Magnet Funnel' },

    // Integrations & Migration
    customIntegration: { price: 500, label: 'Custom Integration (per service)' },
    complexWorkflow: { price: 1200, label: 'Complex Workflow Integration' },
    customApi: { price: 800, label: 'Custom API Integration' },
    crmMigration: { price: 600, label: 'CRM Data Migration' },
    websiteMigration: { price: 800, label: 'Website Migration' },
    emailMigration: { price: 300, label: 'Email List Migration' },

    // Platform Setup
    membershipSite: { price: 2000, label: 'Membership Site Setup' },
    coursePlatform: { price: 1800, label: 'Course Platform Setup' },
    bookingSystem: { price: 600, label: 'Booking System Setup' },
    reviewPlatform: { price: 400, label: 'Review Platform Setup' },
    multiLanguage: { price: 800, label: 'Multi-language Setup' },

    // Technical
    speedOptimization: { price: 500, label: 'Speed Optimization' },
    securityHardening: { price: 400, label: 'Security Hardening' },
    accessibility: { price: 600, label: 'Accessibility Compliance' },
    domainSetup: { price: 200, label: 'Domain & Email Setup' },
    legalPages: { price: 300, label: 'Legal Pages (Privacy/Terms)' },

    // Training & Support
    trainingSession: { price: 300, label: 'Client Training Session (2 hrs)' },
    videoDocumentation: { price: 500, label: 'Video Documentation' },
    fullOnboarding: { price: 800, label: 'Full Onboarding Package' },

    // Graphic Design & Branding
    logoDesign: { price: 800, label: 'Logo Design' },
    logoVariations: { price: 1200, label: 'Logo + Variations' },
    brandGuidelines: { price: 600, label: 'Brand Guidelines Document' },
    socialBrandKit: { price: 500, label: 'Social Media Brand Kit' },
    emailSignature: { price: 150, label: 'Email Signature Design' },
    letterheadInvoice: { price: 300, label: 'Letterhead & Invoice Template' },
    vehicleWrap: { price: 800, label: 'Vehicle Wrap Design' },
    signageDesign: { price: 400, label: 'Signage Design' },
    menuCatalog: { price: 600, label: 'Menu/Catalog Design' },
    packagingDesign: { price: 700, label: 'Packaging Design' },
    merchandiseDesign: { price: 350, label: 'Merchandise Design' },
} as const;

// Monthly recurring fees - NON-NEGOTIABLE where applicable
export const MONTHLY = {
    // Infrastructure (Required per package)
    hosting: { price: 150, label: 'Hosting & Maintenance', condition: 'All packages except Creative Only' },
    crm: { price: 300, label: 'CRM Management', condition: 'Growth package or higher' },
    automation: { price: 450, label: 'Automation Management', condition: 'Automation package or higher' },

    // AI Management - Individual
    aiChat: { price: 350, label: 'AI Chat Management', condition: 'If AI Chat selected' },
    aiCaller: { price: 500, label: 'AI Caller (usage + management)', condition: 'If AI Caller selected' },
    leadScoring: { price: 250, label: 'Lead Scoring Management', condition: 'If Lead Scoring selected' },
    autoBooking: { price: 200, label: 'Auto-booking Management', condition: 'If Auto-booking selected' },

    // AI Management - Bundles
    aiStackManagement: { price: 750, label: 'AI Stack Management', condition: 'AI Stack base package (automatic)' },
    aiBundle: { price: 950, label: 'AI Management Bundle', condition: '3+ AI add-ons (optional)' },

    // Ads & SEO
    adsManagement: { price: 700, label: 'Ads Management', condition: 'If any Ads setup selected' },
    seoRetainer: { price: 600, label: 'SEO Retainer', condition: 'If Advanced SEO selected' },

    // Marketing Management
    emailMarketing: { price: 400, label: 'Email Marketing Management', condition: 'If email flows active' },
    smsManagement: { price: 300, label: 'SMS Campaign Management', condition: 'If SMS active' },
    retargeting: { price: 350, label: 'Retargeting Management', condition: 'If retargeting ads running' },
    affiliateManagement: { price: 450, label: 'Affiliate Program Management', condition: 'If affiliate system active' },

    // Community & Reputation
    communityManagement: { price: 500, label: 'Community Management', condition: 'Responding to DMs/comments' },
    reputationManagement: { price: 400, label: 'Reputation Management', condition: 'Review monitoring & responses' },
    influencerOutreach: { price: 600, label: 'Influencer Outreach', condition: 'Ongoing influencer partnerships' },

    // Analytics & Optimization
    analyticsReporting: { price: 300, label: 'Analytics & Reporting', condition: 'Monthly reports + insights' },
    abTesting: { price: 400, label: 'A/B Testing Management', condition: 'Ongoing split tests' },
    cro: { price: 500, label: 'CRO (Conversion Optimization)', condition: 'Ongoing conversion work' },

    // Maintenance & Support
    websiteUpdates: { price: 250, label: 'Website Updates Retainer', condition: 'Small monthly changes' },
    prioritySupport: { price: 200, label: 'Priority Support', condition: 'Same-day response' },
    backupSecurity: { price: 150, label: 'Backup & Security Monitoring', condition: 'Ongoing protection' },
    performanceMonitoring: { price: 200, label: 'Performance Monitoring', condition: 'Uptime + speed tracking' },
} as const;

// Creative Services - Monthly Retainers
export const CREATIVE_SERVICES = {
    // Social Media Content
    socialMedia: {
        none: { price: 0, label: 'No Social Media', deliverables: '' },
        basic: { price: 800, label: 'Basic Social', deliverables: '8 posts + captions' },
        standard: { price: 1500, label: 'Standard Social', deliverables: '12 posts + 4 stories + captions' },
        premium: { price: 2400, label: 'Premium Social', deliverables: '16 posts + 8 stories + content calendar' },
    },

    // Blog & Content Writing
    blogWriting: {
        none: { price: 0, label: 'No Blog Writing', deliverables: '' },
        basic: { price: 400, label: 'Basic Blog', deliverables: '2 SEO-optimized posts/mo' },
        standard: { price: 750, label: 'Standard Blog', deliverables: '4 SEO-optimized posts/mo' },
        premium: { price: 1400, label: 'Premium Blog', deliverables: '8 SEO-optimized posts + distribution' },
    },

    // Video Production
    videoProduction: {
        none: { price: 0, label: 'No Video Production', deliverables: '' },
        basic: { price: 900, label: 'Basic Video', deliverables: '2 short-form videos (Reels/TikTok)' },
        standard: { price: 1600, label: 'Standard Video', deliverables: '4 videos + editing' },
        premium: { price: 3200, label: 'Premium Video', deliverables: '8 videos + motion graphics' },
    },
    extraVideo: { price: 350, label: 'Extra Video', deliverables: 'Additional video beyond package' },

    // Ad Creative
    adCreative: {
        none: { price: 0, label: 'No Ad Creative', deliverables: '' },
        staticOnly: { price: 700, label: 'Static Only', deliverables: '4 ad variations + copy' },
        staticVideo: { price: 1400, label: 'Static + Video', deliverables: '4 static + 2 video ads' },
        fullSuite: { price: 2500, label: 'Full Suite', deliverables: '8 static + 4 video + A/B variations' },
    },

    // Graphic Design Retainer
    graphicDesign: {
        none: { price: 0, label: 'No Design Retainer', deliverables: '' },
        basic: { price: 500, label: 'Basic Design', deliverables: '5 design requests/mo' },
        pro: { price: 1000, label: 'Pro Design', deliverables: '12 design requests/mo' },
    },

    // Email & Newsletter
    email: {
        none: { price: 0, label: 'No Email Design', deliverables: '' },
        templates: { price: 400, label: 'Email Template Design', deliverables: '4 email templates' },
        newsletter: { price: 600, label: 'Newsletter Design', deliverables: '4 newsletters + graphics' },
        campaign: { price: 900, label: 'Email Campaign Design', deliverables: '8 emails + sequences' },
    },

    // YouTube & Podcast
    youtubeThumbnails: { price: 300, label: 'YouTube Thumbnails', deliverables: '8 thumbnails/mo' },
    youtubeEditing: { price: 500, label: 'YouTube Video Editing', deliverables: 'Per long-form video (10+ min)' },
    podcastEditing: { price: 400, label: 'Podcast Editing', deliverables: '4 episodes/mo' },
    podcastAssets: { price: 350, label: 'Podcast Cover + Assets', deliverables: 'One-time' },

    // Platform-Specific
    linkedinCarousels: { price: 600, label: 'LinkedIn Carousels', deliverables: '8 carousels/mo' },
    pinterestGraphics: { price: 500, label: 'Pinterest Graphics', deliverables: '16 pins/mo' },
    storyHighlights: { price: 200, label: 'Story Highlight Covers', deliverables: 'One-time (10 covers)' },

    // Print & Documents
    businessCard: { price: 250, label: 'Business Card Design', deliverables: 'One-time' },
    brochure: { price: 450, label: 'Brochure Design', deliverables: 'One-time' },
    flyer: { price: 200, label: 'Flyer Design', deliverables: 'Per flyer' },
    presentation: { price: 600, label: 'Presentation Design', deliverables: 'Up to 20 slides' },
    ebook: { price: 800, label: 'eBook/Whitepaper Design', deliverables: 'Up to 20 pages' },
    caseStudy: { price: 500, label: 'Case Study Design', deliverables: 'Per case study' },
    infographic: { price: 350, label: 'Infographic', deliverables: 'Per infographic' },

    // Other Creative
    ugcStyle: { price: 500, label: 'UGC-Style Videos', deliverables: '2 videos/mo' },
    productPhotography: { price: 450, label: 'Product Photography', deliverables: 'Per session' },
    droneVideo: { price: 550, label: 'Drone/Location Video', deliverables: 'Per session' },
    animation: { price: 350, label: 'Animation (30 sec)', deliverables: 'Per video' },
    copywritingAddon: { price: 250, label: 'Copywriting Add-on', deliverables: 'Monthly' },

    // Bundle
    brandContentBundle: { price: 3500, label: 'Brand Content Bundle', deliverables: 'Social + Video + Ads combined' },
} as const;

// Pre-configured Bundles
export const BUNDLES = {
    starter: { price: 1800, label: 'Starter Marketing', includes: 'Social Basic + Blog Basic + Design Basic' },
    growth: { price: 3500, label: 'Growth Marketing', includes: 'Social Standard + Video Basic + Ads Static + Design Pro' },
    fullService: { price: 5500, label: 'Full Service', includes: 'Social Premium + Video Standard + Ads Full + Blog Standard' },
    enterprise: { price: 8000, label: 'Enterprise', includes: 'Custom - everything included' },
} as const;

export const INDUSTRIES = [
    'Cannabis',
    'Med Spa',
    'Roofing',
    'E-commerce',
    'Construction',
    'Other'
] as const;

export type BasePackageKey = keyof typeof BASE_PACKAGES;
export type EcommerceOption = keyof typeof ADDONS.ecommerce;
export type UiuxOption = keyof typeof ADDONS.uiux;
export type SeoOption = keyof typeof ADDONS.seo;
export type ContentOption = keyof typeof ADDONS.content;
export type SocialMediaOption = keyof typeof CREATIVE_SERVICES.socialMedia;
export type VideoProductionOption = keyof typeof CREATIVE_SERVICES.videoProduction;
export type AdCreativeOption = keyof typeof CREATIVE_SERVICES.adCreative;
export type GraphicDesignOption = keyof typeof CREATIVE_SERVICES.graphicDesign;
export type BlogWritingOption = keyof typeof CREATIVE_SERVICES.blogWriting;
export type EmailOption = keyof typeof CREATIVE_SERVICES.email;
export type Industry = typeof INDUSTRIES[number];


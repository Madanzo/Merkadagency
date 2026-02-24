import type {
    BasePackageKey,
    EcommerceOption,
    UiuxOption,
    SeoOption,
    ContentOption,
    SocialMediaOption,
    VideoProductionOption,
    AdCreativeOption,
    GraphicDesignOption,
    BlogWritingOption,
    EmailOption,
    Industry
} from './pricing.config';

// Type for preset state that allows partial addons
export interface PresetState {
    basePackage?: BasePackageKey;
    addons?: Partial<AddonState>;
    monthlyInfra?: Partial<MonthlyInfraState>;
    projectInfo?: ProjectInfo;
}

export interface AddonState {
    // E-commerce
    ecommerce: EcommerceOption;
    paymentGateway: boolean;
    shipping: boolean;

    // UI/UX
    uiux: UiuxOption;
    brandIdentity: boolean;

    // AI Features
    aiChatbot: boolean;
    aiCaller: boolean;
    leadScoring: boolean;
    autoBooking: boolean;
    customAiWorkflow: boolean;

    // SEO & Marketing
    seo: SeoOption;
    googleAds: boolean;
    metaAds: boolean;
    tiktokAds: boolean;

    // Content
    content: ContentOption;
    productDescriptions: boolean;
    blogSetup: boolean;

    // Funnels & Landing Pages
    landingPage: boolean;
    salesFunnel: boolean;
    webinarFunnel: boolean;
    leadMagnetFunnel: boolean;

    // Integrations & Migration
    customIntegration: number;
    customIntegrationDesc: string;
    complexWorkflow: boolean;
    customApi: boolean;
    crmMigration: boolean;
    websiteMigration: boolean;
    emailMigration: boolean;

    // Platform Setup
    membershipSite: boolean;
    coursePlatform: boolean;
    bookingSystem: boolean;
    reviewPlatform: boolean;
    multiLanguage: boolean;

    // Technical
    speedOptimization: boolean;
    securityHardening: boolean;
    accessibility: boolean;
    domainSetup: boolean;
    legalPages: boolean;

    // Training & Support
    trainingSession: boolean;
    videoDocumentation: boolean;
    fullOnboarding: boolean;

    // Brand & Design
    logoDesign: boolean;
    logoVariations: boolean;
    brandGuidelines: boolean;
    socialBrandKit: boolean;
    emailSignature: boolean;
    letterheadInvoice: boolean;
    vehicleWrap: boolean;
    signageDesign: boolean;
    menuCatalog: boolean;
    packagingDesign: boolean;
    merchandiseDesign: boolean;

    // Creative Services
    socialMedia: SocialMediaOption;
    blogWriting: BlogWritingOption;
    videoProduction: VideoProductionOption;
    extraVideo: boolean;
    adCreative: AdCreativeOption;
    graphicDesign: GraphicDesignOption;
    email: EmailOption;
    youtubeThumbnails: boolean;
    youtubeEditingCount: number;
    podcastEditing: boolean;
    podcastAssets: boolean;
    linkedinCarousels: boolean;
    pinterestGraphics: boolean;
    storyHighlights: boolean;
    businessCard: boolean;
    brochure: boolean;
    flyerCount: number;
    presentation: boolean;
    ebook: boolean;
    caseStudyCount: number;
    infographicCount: number;
    ugcStyle: boolean;
    productPhotography: boolean;
    droneVideo: boolean;
    animation: boolean;
    copywritingAddon: boolean;
    brandContentBundle: boolean;
}

export interface MonthlyInfraState {
    // Marketing Management
    emailMarketing: boolean;
    smsManagement: boolean;
    retargeting: boolean;
    affiliateManagement: boolean;

    // Community & Reputation
    communityManagement: boolean;
    reputationManagement: boolean;
    influencerOutreach: boolean;

    // Analytics & Optimization
    analyticsReporting: boolean;
    abTesting: boolean;
    cro: boolean;

    // Maintenance & Support
    websiteUpdates: boolean;
    prioritySupport: boolean;
    backupSecurity: boolean;
    performanceMonitoring: boolean;

    // AI Bundle Toggle (for 3+ AI add-ons)
    useAiBundle: boolean;
}

export interface ProjectInfo {
    // Basic Project Info
    name: string;
    industry: Industry | '';
    timeline: string;
    notes: string;

    // Contact Info
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    businessWebsite: string;

    // Quote Details
    quoteValidUntil: string;
    paymentTerms: PaymentTerms;

    // Optional Fields
    projectStartDate: string;
    monthlyBudgetRange: BudgetRange;
    referralSource: string;
}

export type PaymentTerms = '50-50' | '100-upfront' | '30-60-10' | 'net-30' | 'custom' | '';
export type BudgetRange = '' | 'under-1k' | '1k-3k' | '3k-5k' | '5k-10k' | '10k-25k' | '25k-plus';

export interface CalculatorState {
    basePackage: BasePackageKey;
    addons: AddonState;
    monthlyInfra: MonthlyInfraState;
    projectInfo: ProjectInfo;
    discount: {
        type: 'percentage' | 'fixed';
        value: number;
    };
    monthlyDiscount: {
        type: 'percentage' | 'fixed';
        value: number;
    };
    adSpend: number;
}

export interface QuoteSummary {
    basePackage: {
        key: BasePackageKey;
        label: string;
        price: number;
        description?: string;
    };
    addons: Array<{
        key: string;
        label: string;
        price: number;
        description?: string;
    }>;
    oneTimeTotal: number;
    monthly: Array<{
        key: string;
        label: string;
        price: number;
        description?: string;
    }>;
    monthlyTotal: number;
    discount: {
        type: 'percentage' | 'fixed';
        value: number;
        amount: number;
    };
    monthlyDiscount: {
        type: 'percentage' | 'fixed';
        value: number;
        amount: number;
    };
    finalOneTimeTotal: number;
    finalMonthlyTotal: number;
    adSpend: number;
    grandMonthlyTotal: number;
}

export const initialAddonState: AddonState = {
    // E-commerce
    ecommerce: 'none',
    paymentGateway: false,
    shipping: false,

    // UI/UX
    uiux: 'template',
    brandIdentity: false,

    // AI Features
    aiChatbot: false,
    aiCaller: false,
    leadScoring: false,
    autoBooking: false,
    customAiWorkflow: false,

    // SEO & Marketing
    seo: 'none',
    googleAds: false,
    metaAds: false,
    tiktokAds: false,

    // Content
    content: 'none',
    productDescriptions: false,
    blogSetup: false,

    // Funnels & Landing Pages
    landingPage: false,
    salesFunnel: false,
    webinarFunnel: false,
    leadMagnetFunnel: false,

    // Integrations & Migration
    customIntegration: 0,
    customIntegrationDesc: '',
    complexWorkflow: false,
    customApi: false,
    crmMigration: false,
    websiteMigration: false,
    emailMigration: false,

    // Platform Setup
    membershipSite: false,
    coursePlatform: false,
    bookingSystem: false,
    reviewPlatform: false,
    multiLanguage: false,

    // Technical
    speedOptimization: false,
    securityHardening: false,
    accessibility: false,
    domainSetup: false,
    legalPages: false,

    // Training & Support
    trainingSession: false,
    videoDocumentation: false,
    fullOnboarding: false,

    // Brand & Design
    logoDesign: false,
    logoVariations: false,
    brandGuidelines: false,
    socialBrandKit: false,
    emailSignature: false,
    letterheadInvoice: false,
    vehicleWrap: false,
    signageDesign: false,
    menuCatalog: false,
    packagingDesign: false,
    merchandiseDesign: false,

    // Creative Services
    socialMedia: 'none',
    blogWriting: 'none',
    videoProduction: 'none',
    extraVideo: false,
    adCreative: 'none',
    graphicDesign: 'none',
    email: 'none',
    youtubeThumbnails: false,
    youtubeEditingCount: 0,
    podcastEditing: false,
    podcastAssets: false,
    linkedinCarousels: false,
    pinterestGraphics: false,
    storyHighlights: false,
    businessCard: false,
    brochure: false,
    flyerCount: 0,
    presentation: false,
    ebook: false,
    caseStudyCount: 0,
    infographicCount: 0,
    ugcStyle: false,
    productPhotography: false,
    droneVideo: false,
    animation: false,
    copywritingAddon: false,
    brandContentBundle: false,
};

export const initialMonthlyInfraState: MonthlyInfraState = {
    // Marketing Management
    emailMarketing: false,
    smsManagement: false,
    retargeting: false,
    affiliateManagement: false,

    // Community & Reputation
    communityManagement: false,
    reputationManagement: false,
    influencerOutreach: false,

    // Analytics & Optimization
    analyticsReporting: false,
    abTesting: false,
    cro: false,

    // Maintenance & Support
    websiteUpdates: false,
    prioritySupport: false,
    backupSecurity: false,
    performanceMonitoring: false,

    // AI Bundle Toggle
    useAiBundle: false,
};

export const initialProjectInfo: ProjectInfo = {
    // Basic Project Info
    name: '',
    industry: '',
    timeline: '',
    notes: '',

    // Contact Info
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    businessWebsite: '',

    // Quote Details
    quoteValidUntil: '',
    paymentTerms: '',

    // Optional Fields
    projectStartDate: '',
    monthlyBudgetRange: '',
    referralSource: '',
};

export const initialCalculatorState: CalculatorState = {
    basePackage: 'foundation',
    addons: initialAddonState,
    monthlyInfra: initialMonthlyInfraState,
    projectInfo: initialProjectInfo,
    discount: {
        type: 'percentage',
        value: 0,
    },
    monthlyDiscount: {
        type: 'percentage',
        value: 0,
    },
    adSpend: 0,
};

export type CalculatorAction =
    | { type: 'SET_BASE_PACKAGE'; payload: BasePackageKey }
    | { type: 'SET_ADDON'; payload: { key: keyof AddonState; value: unknown } }
    | { type: 'SET_MONTHLY_INFRA'; payload: { key: keyof MonthlyInfraState; value: boolean } }
    | { type: 'SET_PROJECT_INFO'; payload: Partial<ProjectInfo> }
    | { type: 'SET_DISCOUNT'; payload: { type?: 'percentage' | 'fixed'; value?: number } }
    | { type: 'SET_MONTHLY_DISCOUNT'; payload: { type?: 'percentage' | 'fixed'; value?: number } }
    | { type: 'SET_AD_SPEND'; payload: number }
    | { type: 'APPLY_PRESET'; payload: PresetState }
    | { type: 'RESET' };


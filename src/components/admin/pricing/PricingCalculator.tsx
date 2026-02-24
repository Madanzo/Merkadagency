import { useReducer, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BASE_PACKAGES,
    ADDONS,
    MONTHLY,
    CREATIVE_SERVICES
} from '@/lib/pricing/pricing.config';
import {
    CalculatorState,
    CalculatorAction,
    QuoteSummary,
    initialCalculatorState,
    initialAddonState,
    initialMonthlyInfraState,
} from '@/lib/pricing/calculator.types';
import { PRESETS } from '@/lib/pricing/presets.config';
import { generateScopePDF, generateClipboardText } from '@/lib/pricing/generateScope';
import { createClient, searchClients } from '@/lib/clients';
import { saveQuote } from '@/lib/quotes';
import { BasePackageSelector } from './BasePackageSelector';
import { AddonSection } from './AddonSection';
import { SummaryPanel } from './SummaryPanel';
import { ProjectInfoForm } from './ProjectInfoForm';
import { QuickPresets } from './QuickPresets';

function calculatorReducer(
    state: CalculatorState,
    action: CalculatorAction
): CalculatorState {
    switch (action.type) {
        case 'SET_BASE_PACKAGE':
            return { ...state, basePackage: action.payload };
        case 'SET_ADDON':
            return {
                ...state,
                addons: { ...state.addons, [action.payload.key]: action.payload.value } as typeof state.addons,
            };
        case 'SET_MONTHLY_INFRA':
            return {
                ...state,
                monthlyInfra: { ...state.monthlyInfra, [action.payload.key]: action.payload.value },
            };
        case 'SET_PROJECT_INFO':
            return {
                ...state,
                projectInfo: { ...state.projectInfo, ...action.payload },
            };
        case 'SET_DISCOUNT':
            return {
                ...state,
                discount: { ...state.discount, ...action.payload },
            };
        case 'SET_MONTHLY_DISCOUNT':
            return {
                ...state,
                monthlyDiscount: { ...state.monthlyDiscount, ...action.payload },
            };
        case 'SET_AD_SPEND':
            return {
                ...state,
                adSpend: action.payload,
            };
        case 'APPLY_PRESET':
            return {
                ...state,
                basePackage: action.payload.basePackage ?? state.basePackage,
                addons: action.payload.addons
                    ? { ...initialAddonState, ...action.payload.addons }
                    : state.addons,
                monthlyInfra: action.payload.monthlyInfra
                    ? { ...initialMonthlyInfraState, ...action.payload.monthlyInfra }
                    : state.monthlyInfra,
                projectInfo: action.payload.projectInfo ?? state.projectInfo,
            };
        case 'RESET':
            return initialCalculatorState;
        default:
            return state;
    }
}

function calculateQuote(state: CalculatorState): QuoteSummary {
    const basePackage = BASE_PACKAGES[state.basePackage];
    const addons: QuoteSummary['addons'] = [];
    const monthly: QuoteSummary['monthly'] = [];

    // Only add hosting if not Creative Only
    if (state.basePackage !== 'none') {
        monthly.push({
            key: 'hosting',
            label: MONTHLY.hosting.label,
            price: MONTHLY.hosting.price,
        });
    }

    // CRM management for Growth+
    if (state.basePackage !== 'foundation' && state.basePackage !== 'none') {
        monthly.push({
            key: 'crm',
            label: MONTHLY.crm.label,
            price: MONTHLY.crm.price,
        });
    }

    // Automation management for Automation+
    if (state.basePackage === 'automation' || state.basePackage === 'ai-stack') {
        monthly.push({
            key: 'automation',
            label: MONTHLY.automation.label,
            price: MONTHLY.automation.price,
        });
    }

    // E-commerce
    const ecommerceOption = ADDONS.ecommerce[state.addons.ecommerce];
    if (ecommerceOption.price > 0) {
        addons.push({
            key: 'ecommerce',
            label: ecommerceOption.label,
            price: ecommerceOption.price,
        });
    }

    if (state.addons.paymentGateway) {
        addons.push({
            key: 'paymentGateway',
            label: ADDONS.paymentGateway.label,
            price: ADDONS.paymentGateway.price,
        });
    }

    if (state.addons.shipping) {
        addons.push({
            key: 'shipping',
            label: ADDONS.shipping.label,
            price: ADDONS.shipping.price,
        });
    }

    // UI/UX
    const uiuxOption = ADDONS.uiux[state.addons.uiux];
    if (uiuxOption.price > 0) {
        addons.push({
            key: 'uiux',
            label: uiuxOption.label,
            price: uiuxOption.price,
        });
    }

    if (state.addons.brandIdentity) {
        addons.push({
            key: 'brandIdentity',
            label: ADDONS.brandIdentity.label,
            price: ADDONS.brandIdentity.price,
        });
    }

    // AI Features - One-time add-ons
    if (state.addons.aiChatbot) {
        addons.push({
            key: 'aiChatbot',
            label: ADDONS.aiChatbot.label,
            price: ADDONS.aiChatbot.price,
        });
    }

    if (state.addons.aiCaller) {
        addons.push({
            key: 'aiCaller',
            label: ADDONS.aiCaller.label,
            price: ADDONS.aiCaller.price,
        });
    }

    if (state.addons.leadScoring) {
        addons.push({
            key: 'leadScoring',
            label: ADDONS.leadScoring.label,
            price: ADDONS.leadScoring.price,
        });
    }

    if (state.addons.autoBooking) {
        addons.push({
            key: 'autoBooking',
            label: ADDONS.autoBooking.label,
            price: ADDONS.autoBooking.price,
        });
    }

    if (state.addons.customAiWorkflow) {
        addons.push({
            key: 'customAiWorkflow',
            label: ADDONS.customAiWorkflow.label,
            price: ADDONS.customAiWorkflow.price,
        });
    }

    // AI Management Monthly Fees - Bundle Logic
    const aiAddonsCount = [
        state.addons.aiChatbot,
        state.addons.aiCaller,
        state.addons.leadScoring,
        state.addons.autoBooking,
    ].filter(Boolean).length;

    if (state.basePackage === 'ai-stack') {
        // RULE 1: AI Stack base package = automatic $750 bundle
        monthly.push({
            key: 'aiStackManagement',
            label: MONTHLY.aiStackManagement.label,
            price: MONTHLY.aiStackManagement.price,
            description: 'Includes AI Chat, Caller, Lead Scoring & Auto-booking management',
        });
    } else if (aiAddonsCount >= 3 && state.monthlyInfra.useAiBundle) {
        // RULE 2: 3+ AI add-ons AND user chose bundle = $950
        monthly.push({
            key: 'aiBundle',
            label: MONTHLY.aiBundle.label,
            price: MONTHLY.aiBundle.price,
            description: 'Bundled AI management (saves vs individual fees)',
        });
    } else {
        // RULE 3: Individual fees for each selected AI add-on
        if (state.addons.aiChatbot) {
            monthly.push({
                key: 'aiChat',
                label: MONTHLY.aiChat.label,
                price: MONTHLY.aiChat.price,
            });
        }
        if (state.addons.aiCaller) {
            monthly.push({
                key: 'aiCaller',
                label: MONTHLY.aiCaller.label,
                price: MONTHLY.aiCaller.price,
            });
        }
        if (state.addons.leadScoring) {
            monthly.push({
                key: 'leadScoring',
                label: MONTHLY.leadScoring.label,
                price: MONTHLY.leadScoring.price,
            });
        }
        if (state.addons.autoBooking) {
            monthly.push({
                key: 'autoBooking',
                label: MONTHLY.autoBooking.label,
                price: MONTHLY.autoBooking.price,
            });
        }
    }

    // SEO
    const seoOption = ADDONS.seo[state.addons.seo];
    if (seoOption.price > 0) {
        addons.push({
            key: 'seo',
            label: seoOption.label,
            price: seoOption.price,
        });

        // Advanced SEO includes retainer
        if (state.addons.seo === 'advanced') {
            monthly.push({
                key: 'seoRetainer',
                label: MONTHLY.seoRetainer.label,
                price: MONTHLY.seoRetainer.price,
            });
        }
    }

    // Ads (including TikTok)
    const hasAnyAds = state.addons.googleAds || state.addons.metaAds || state.addons.tiktokAds;
    if (hasAnyAds) {
        if (state.addons.googleAds) {
            addons.push({
                key: 'googleAds',
                label: ADDONS.googleAds.label,
                price: ADDONS.googleAds.price,
            });
        }
        if (state.addons.metaAds) {
            addons.push({
                key: 'metaAds',
                label: ADDONS.metaAds.label,
                price: ADDONS.metaAds.price,
            });
        }
        if (state.addons.tiktokAds) {
            addons.push({
                key: 'tiktokAds',
                label: ADDONS.tiktokAds.label,
                price: ADDONS.tiktokAds.price,
            });
        }
        monthly.push({
            key: 'adsManagement',
            label: MONTHLY.adsManagement.label,
            price: MONTHLY.adsManagement.price,
        });
    }

    // Content
    const contentOption = ADDONS.content[state.addons.content];
    if (contentOption.price > 0) {
        addons.push({
            key: 'content',
            label: contentOption.label,
            price: contentOption.price,
        });
    }

    if (state.addons.productDescriptions) {
        addons.push({
            key: 'productDescriptions',
            label: ADDONS.productDescriptions.label,
            price: ADDONS.productDescriptions.price,
        });
    }

    if (state.addons.blogSetup) {
        addons.push({
            key: 'blogSetup',
            label: ADDONS.blogSetup.label,
            price: ADDONS.blogSetup.price,
        });
    }

    // ===== FUNNELS & LANDING PAGES =====
    if (state.addons.landingPage) {
        addons.push({ key: 'landingPage', label: ADDONS.landingPage.label, price: ADDONS.landingPage.price });
    }
    if (state.addons.salesFunnel) {
        addons.push({ key: 'salesFunnel', label: ADDONS.salesFunnel.label, price: ADDONS.salesFunnel.price });
    }
    if (state.addons.webinarFunnel) {
        addons.push({ key: 'webinarFunnel', label: ADDONS.webinarFunnel.label, price: ADDONS.webinarFunnel.price });
    }
    if (state.addons.leadMagnetFunnel) {
        addons.push({ key: 'leadMagnetFunnel', label: ADDONS.leadMagnetFunnel.label, price: ADDONS.leadMagnetFunnel.price });
    }

    // ===== INTEGRATIONS & MIGRATION =====
    if (state.addons.customIntegration > 0) {
        addons.push({
            key: 'customIntegration',
            label: ADDONS.customIntegration.label + (state.addons.customIntegration > 1 ? ` (x${state.addons.customIntegration})` : ''),
            price: ADDONS.customIntegration.price * state.addons.customIntegration,
            description: state.addons.customIntegrationDesc || undefined,
        });
    }
    if (state.addons.complexWorkflow) {
        addons.push({ key: 'complexWorkflow', label: ADDONS.complexWorkflow.label, price: ADDONS.complexWorkflow.price });
    }
    if (state.addons.customApi) {
        addons.push({ key: 'customApi', label: ADDONS.customApi.label, price: ADDONS.customApi.price });
    }
    if (state.addons.crmMigration) {
        addons.push({ key: 'crmMigration', label: ADDONS.crmMigration.label, price: ADDONS.crmMigration.price });
    }
    if (state.addons.websiteMigration) {
        addons.push({ key: 'websiteMigration', label: ADDONS.websiteMigration.label, price: ADDONS.websiteMigration.price });
    }
    if (state.addons.emailMigration) {
        addons.push({ key: 'emailMigration', label: ADDONS.emailMigration.label, price: ADDONS.emailMigration.price });
    }

    // ===== PLATFORM SETUP =====
    if (state.addons.membershipSite) {
        addons.push({ key: 'membershipSite', label: ADDONS.membershipSite.label, price: ADDONS.membershipSite.price });
    }
    if (state.addons.coursePlatform) {
        addons.push({ key: 'coursePlatform', label: ADDONS.coursePlatform.label, price: ADDONS.coursePlatform.price });
    }
    if (state.addons.bookingSystem) {
        addons.push({ key: 'bookingSystem', label: ADDONS.bookingSystem.label, price: ADDONS.bookingSystem.price });
    }
    if (state.addons.reviewPlatform) {
        addons.push({ key: 'reviewPlatform', label: ADDONS.reviewPlatform.label, price: ADDONS.reviewPlatform.price });
    }
    if (state.addons.multiLanguage) {
        addons.push({ key: 'multiLanguage', label: ADDONS.multiLanguage.label, price: ADDONS.multiLanguage.price });
    }

    // ===== TECHNICAL =====
    if (state.addons.speedOptimization) {
        addons.push({ key: 'speedOptimization', label: ADDONS.speedOptimization.label, price: ADDONS.speedOptimization.price });
    }
    if (state.addons.securityHardening) {
        addons.push({ key: 'securityHardening', label: ADDONS.securityHardening.label, price: ADDONS.securityHardening.price });
    }
    if (state.addons.accessibility) {
        addons.push({ key: 'accessibility', label: ADDONS.accessibility.label, price: ADDONS.accessibility.price });
    }
    if (state.addons.domainSetup) {
        addons.push({ key: 'domainSetup', label: ADDONS.domainSetup.label, price: ADDONS.domainSetup.price });
    }
    if (state.addons.legalPages) {
        addons.push({ key: 'legalPages', label: ADDONS.legalPages.label, price: ADDONS.legalPages.price });
    }

    // ===== TRAINING & SUPPORT =====
    if (state.addons.trainingSession) {
        addons.push({ key: 'trainingSession', label: ADDONS.trainingSession.label, price: ADDONS.trainingSession.price });
    }
    if (state.addons.videoDocumentation) {
        addons.push({ key: 'videoDocumentation', label: ADDONS.videoDocumentation.label, price: ADDONS.videoDocumentation.price });
    }
    if (state.addons.fullOnboarding) {
        addons.push({ key: 'fullOnboarding', label: ADDONS.fullOnboarding.label, price: ADDONS.fullOnboarding.price });
    }

    // ===== OPTIONAL MONTHLY INFRASTRUCTURE =====
    // Marketing Management
    if (state.monthlyInfra.emailMarketing) {
        monthly.push({ key: 'emailMarketing', label: MONTHLY.emailMarketing.label, price: MONTHLY.emailMarketing.price });
    }
    if (state.monthlyInfra.smsManagement) {
        monthly.push({ key: 'smsManagement', label: MONTHLY.smsManagement.label, price: MONTHLY.smsManagement.price });
    }
    if (state.monthlyInfra.retargeting) {
        monthly.push({ key: 'retargeting', label: MONTHLY.retargeting.label, price: MONTHLY.retargeting.price });
    }
    if (state.monthlyInfra.affiliateManagement) {
        monthly.push({ key: 'affiliateManagement', label: MONTHLY.affiliateManagement.label, price: MONTHLY.affiliateManagement.price });
    }

    // Community & Reputation
    if (state.monthlyInfra.communityManagement) {
        monthly.push({ key: 'communityManagement', label: MONTHLY.communityManagement.label, price: MONTHLY.communityManagement.price });
    }
    if (state.monthlyInfra.reputationManagement) {
        monthly.push({ key: 'reputationManagement', label: MONTHLY.reputationManagement.label, price: MONTHLY.reputationManagement.price });
    }
    if (state.monthlyInfra.influencerOutreach) {
        monthly.push({ key: 'influencerOutreach', label: MONTHLY.influencerOutreach.label, price: MONTHLY.influencerOutreach.price });
    }

    // Analytics & Optimization
    if (state.monthlyInfra.analyticsReporting) {
        monthly.push({ key: 'analyticsReporting', label: MONTHLY.analyticsReporting.label, price: MONTHLY.analyticsReporting.price });
    }
    if (state.monthlyInfra.abTesting) {
        monthly.push({ key: 'abTesting', label: MONTHLY.abTesting.label, price: MONTHLY.abTesting.price });
    }
    if (state.monthlyInfra.cro) {
        monthly.push({ key: 'cro', label: MONTHLY.cro.label, price: MONTHLY.cro.price });
    }

    // Maintenance & Support
    if (state.monthlyInfra.websiteUpdates) {
        monthly.push({ key: 'websiteUpdates', label: MONTHLY.websiteUpdates.label, price: MONTHLY.websiteUpdates.price });
    }
    if (state.monthlyInfra.prioritySupport) {
        monthly.push({ key: 'prioritySupport', label: MONTHLY.prioritySupport.label, price: MONTHLY.prioritySupport.price });
    }
    if (state.monthlyInfra.backupSecurity) {
        monthly.push({ key: 'backupSecurity', label: MONTHLY.backupSecurity.label, price: MONTHLY.backupSecurity.price });
    }
    if (state.monthlyInfra.performanceMonitoring) {
        monthly.push({ key: 'performanceMonitoring', label: MONTHLY.performanceMonitoring.label, price: MONTHLY.performanceMonitoring.price });
    }

    // ===== CREATIVE SERVICES (Monthly) =====

    // Social Media
    const socialMediaOption = CREATIVE_SERVICES.socialMedia[state.addons.socialMedia];
    if (socialMediaOption.price > 0) {
        monthly.push({
            key: 'socialMedia',
            label: socialMediaOption.label,
            price: socialMediaOption.price,
            description: socialMediaOption.deliverables,
        });
    }

    // Video Production
    const videoOption = CREATIVE_SERVICES.videoProduction[state.addons.videoProduction];
    if (videoOption.price > 0) {
        monthly.push({
            key: 'videoProduction',
            label: videoOption.label,
            price: videoOption.price,
            description: videoOption.deliverables,
        });
    }

    if (state.addons.extraVideo) {
        addons.push({
            key: 'extraVideo',
            label: CREATIVE_SERVICES.extraVideo.label,
            price: CREATIVE_SERVICES.extraVideo.price,
            description: CREATIVE_SERVICES.extraVideo.deliverables,
        });
    }

    // Ad Creative
    const adCreativeOption = CREATIVE_SERVICES.adCreative[state.addons.adCreative];
    if (adCreativeOption.price > 0) {
        monthly.push({
            key: 'adCreative',
            label: adCreativeOption.label,
            price: adCreativeOption.price,
            description: adCreativeOption.deliverables,
        });
    }

    // Graphic Design
    const graphicDesignOption = CREATIVE_SERVICES.graphicDesign[state.addons.graphicDesign];
    if (graphicDesignOption.price > 0) {
        monthly.push({
            key: 'graphicDesign',
            label: graphicDesignOption.label,
            price: graphicDesignOption.price,
            description: graphicDesignOption.deliverables,
        });
    }

    // Blog & Content Writing
    const blogWritingOption = CREATIVE_SERVICES.blogWriting[state.addons.blogWriting];
    if (blogWritingOption.price > 0) {
        monthly.push({
            key: 'blogWriting',
            label: blogWritingOption.label,
            price: blogWritingOption.price,
            description: blogWritingOption.deliverables,
        });
    }

    // Other Creative (monthly retainers)
    if (state.addons.ugcStyle) {
        monthly.push({
            key: 'ugcStyle',
            label: CREATIVE_SERVICES.ugcStyle.label,
            price: CREATIVE_SERVICES.ugcStyle.price,
            description: CREATIVE_SERVICES.ugcStyle.deliverables,
        });
    }

    if (state.addons.productPhotography) {
        addons.push({
            key: 'productPhotography',
            label: CREATIVE_SERVICES.productPhotography.label,
            price: CREATIVE_SERVICES.productPhotography.price,
            description: CREATIVE_SERVICES.productPhotography.deliverables,
        });
    }

    if (state.addons.droneVideo) {
        addons.push({
            key: 'droneVideo',
            label: CREATIVE_SERVICES.droneVideo.label,
            price: CREATIVE_SERVICES.droneVideo.price,
            description: CREATIVE_SERVICES.droneVideo.deliverables,
        });
    }

    if (state.addons.animation) {
        addons.push({
            key: 'animation',
            label: CREATIVE_SERVICES.animation.label,
            price: CREATIVE_SERVICES.animation.price,
            description: CREATIVE_SERVICES.animation.deliverables,
        });
    }

    if (state.addons.copywritingAddon) {
        monthly.push({
            key: 'copywritingAddon',
            label: CREATIVE_SERVICES.copywritingAddon.label,
            price: CREATIVE_SERVICES.copywritingAddon.price,
            description: CREATIVE_SERVICES.copywritingAddon.deliverables,
        });
    }

    // Bundle
    if (state.addons.brandContentBundle) {
        monthly.push({
            key: 'brandContentBundle',
            label: CREATIVE_SERVICES.brandContentBundle.label,
            price: CREATIVE_SERVICES.brandContentBundle.price,
            description: CREATIVE_SERVICES.brandContentBundle.deliverables,
        });
    }

    // Email & Newsletter
    const emailOption = CREATIVE_SERVICES.email[state.addons.email];
    if (emailOption.price > 0) {
        monthly.push({
            key: 'email',
            label: emailOption.label,
            price: emailOption.price,
            description: emailOption.deliverables,
        });
    }

    // YouTube & Podcast
    if (state.addons.youtubeThumbnails) {
        monthly.push({ key: 'youtubeThumbnails', label: CREATIVE_SERVICES.youtubeThumbnails.label, price: CREATIVE_SERVICES.youtubeThumbnails.price, description: CREATIVE_SERVICES.youtubeThumbnails.deliverables });
    }
    if (state.addons.youtubeEditingCount > 0) {
        const editPrice = CREATIVE_SERVICES.youtubeEditing.price * state.addons.youtubeEditingCount;
        monthly.push({ key: 'youtubeEditing', label: `${CREATIVE_SERVICES.youtubeEditing.label} (×${state.addons.youtubeEditingCount})`, price: editPrice, description: CREATIVE_SERVICES.youtubeEditing.deliverables });
    }
    if (state.addons.podcastEditing) {
        monthly.push({ key: 'podcastEditing', label: CREATIVE_SERVICES.podcastEditing.label, price: CREATIVE_SERVICES.podcastEditing.price, description: CREATIVE_SERVICES.podcastEditing.deliverables });
    }
    if (state.addons.podcastAssets) {
        addons.push({ key: 'podcastAssets', label: CREATIVE_SERVICES.podcastAssets.label, price: CREATIVE_SERVICES.podcastAssets.price, description: CREATIVE_SERVICES.podcastAssets.deliverables });
    }

    // Platform-Specific
    if (state.addons.linkedinCarousels) {
        monthly.push({ key: 'linkedinCarousels', label: CREATIVE_SERVICES.linkedinCarousels.label, price: CREATIVE_SERVICES.linkedinCarousels.price, description: CREATIVE_SERVICES.linkedinCarousels.deliverables });
    }
    if (state.addons.pinterestGraphics) {
        monthly.push({ key: 'pinterestGraphics', label: CREATIVE_SERVICES.pinterestGraphics.label, price: CREATIVE_SERVICES.pinterestGraphics.price, description: CREATIVE_SERVICES.pinterestGraphics.deliverables });
    }
    if (state.addons.storyHighlights) {
        addons.push({ key: 'storyHighlights', label: CREATIVE_SERVICES.storyHighlights.label, price: CREATIVE_SERVICES.storyHighlights.price, description: CREATIVE_SERVICES.storyHighlights.deliverables });
    }

    // Print & Documents
    if (state.addons.businessCard) {
        addons.push({ key: 'businessCard', label: CREATIVE_SERVICES.businessCard.label, price: CREATIVE_SERVICES.businessCard.price, description: CREATIVE_SERVICES.businessCard.deliverables });
    }
    if (state.addons.brochure) {
        addons.push({ key: 'brochure', label: CREATIVE_SERVICES.brochure.label, price: CREATIVE_SERVICES.brochure.price, description: CREATIVE_SERVICES.brochure.deliverables });
    }
    if (state.addons.flyerCount > 0) {
        const flyerPrice = CREATIVE_SERVICES.flyer.price * state.addons.flyerCount;
        addons.push({ key: 'flyer', label: `${CREATIVE_SERVICES.flyer.label} (×${state.addons.flyerCount})`, price: flyerPrice, description: CREATIVE_SERVICES.flyer.deliverables });
    }
    if (state.addons.presentation) {
        addons.push({ key: 'presentation', label: CREATIVE_SERVICES.presentation.label, price: CREATIVE_SERVICES.presentation.price, description: CREATIVE_SERVICES.presentation.deliverables });
    }
    if (state.addons.ebook) {
        addons.push({ key: 'ebook', label: CREATIVE_SERVICES.ebook.label, price: CREATIVE_SERVICES.ebook.price, description: CREATIVE_SERVICES.ebook.deliverables });
    }
    if (state.addons.caseStudyCount > 0) {
        const csPrice = CREATIVE_SERVICES.caseStudy.price * state.addons.caseStudyCount;
        addons.push({ key: 'caseStudy', label: `${CREATIVE_SERVICES.caseStudy.label} (×${state.addons.caseStudyCount})`, price: csPrice, description: CREATIVE_SERVICES.caseStudy.deliverables });
    }
    if (state.addons.infographicCount > 0) {
        const igPrice = CREATIVE_SERVICES.infographic.price * state.addons.infographicCount;
        addons.push({ key: 'infographic', label: `${CREATIVE_SERVICES.infographic.label} (×${state.addons.infographicCount})`, price: igPrice, description: CREATIVE_SERVICES.infographic.deliverables });
    }

    // ===== BRAND & DESIGN (One-Time Add-ons) =====
    if (state.addons.logoDesign) {
        addons.push({ key: 'logoDesign', label: ADDONS.logoDesign.label, price: ADDONS.logoDesign.price });
    }
    if (state.addons.logoVariations) {
        addons.push({ key: 'logoVariations', label: ADDONS.logoVariations.label, price: ADDONS.logoVariations.price });
    }
    if (state.addons.brandGuidelines) {
        addons.push({ key: 'brandGuidelines', label: ADDONS.brandGuidelines.label, price: ADDONS.brandGuidelines.price });
    }
    if (state.addons.socialBrandKit) {
        addons.push({ key: 'socialBrandKit', label: ADDONS.socialBrandKit.label, price: ADDONS.socialBrandKit.price });
    }
    if (state.addons.emailSignature) {
        addons.push({ key: 'emailSignature', label: ADDONS.emailSignature.label, price: ADDONS.emailSignature.price });
    }
    if (state.addons.letterheadInvoice) {
        addons.push({ key: 'letterheadInvoice', label: ADDONS.letterheadInvoice.label, price: ADDONS.letterheadInvoice.price });
    }
    if (state.addons.vehicleWrap) {
        addons.push({ key: 'vehicleWrap', label: ADDONS.vehicleWrap.label, price: ADDONS.vehicleWrap.price });
    }
    if (state.addons.signageDesign) {
        addons.push({ key: 'signageDesign', label: ADDONS.signageDesign.label, price: ADDONS.signageDesign.price });
    }
    if (state.addons.menuCatalog) {
        addons.push({ key: 'menuCatalog', label: ADDONS.menuCatalog.label, price: ADDONS.menuCatalog.price });
    }
    if (state.addons.packagingDesign) {
        addons.push({ key: 'packagingDesign', label: ADDONS.packagingDesign.label, price: ADDONS.packagingDesign.price });
    }
    if (state.addons.merchandiseDesign) {
        addons.push({ key: 'merchandiseDesign', label: ADDONS.merchandiseDesign.label, price: ADDONS.merchandiseDesign.price });
    }

    const oneTimeTotal = basePackage.price + addons.reduce((sum, a) => sum + a.price, 0);
    const monthlyTotal = monthly.reduce((sum, m) => sum + m.price, 0);

    // Calculate one-time discount
    let discountAmount = 0;
    if (state.discount.value > 0) {
        if (state.discount.type === 'percentage') {
            discountAmount = Math.round(oneTimeTotal * (state.discount.value / 100));
        } else {
            discountAmount = state.discount.value;
        }
    }
    const finalOneTimeTotal = Math.max(0, oneTimeTotal - discountAmount);

    // Calculate monthly discount
    let monthlyDiscountAmount = 0;
    if (state.monthlyDiscount.value > 0) {
        if (state.monthlyDiscount.type === 'percentage') {
            monthlyDiscountAmount = Math.round(monthlyTotal * (state.monthlyDiscount.value / 100));
        } else {
            monthlyDiscountAmount = state.monthlyDiscount.value;
        }
    }
    const finalMonthlyTotal = Math.max(0, monthlyTotal - monthlyDiscountAmount);

    return {
        basePackage: {
            key: state.basePackage,
            label: basePackage.label,
            price: basePackage.price,
            description: basePackage.description,
        },
        addons,
        oneTimeTotal,
        monthly,
        monthlyTotal,
        discount: {
            type: state.discount.type,
            value: state.discount.value,
            amount: discountAmount,
        },
        monthlyDiscount: {
            type: state.monthlyDiscount.type,
            value: state.monthlyDiscount.value,
            amount: monthlyDiscountAmount,
        },
        finalOneTimeTotal,
        finalMonthlyTotal,
        adSpend: state.adSpend,
        grandMonthlyTotal: finalMonthlyTotal + state.adSpend,
    };
}

export interface PricingCalculatorProps {
    initialClient?: {
        id?: string;
        name: string;
        business?: string;
        email: string;
        phone?: string;
        website?: string;
    };
    onClose?: () => void;
}

export function PricingCalculator({ initialClient, onClose }: PricingCalculatorProps = {}) {
    // Initialize with client data if provided
    const [state, dispatch] = useReducer(calculatorReducer, {
        ...initialCalculatorState,
        projectInfo: {
            ...initialCalculatorState.projectInfo,
            contactName: initialClient?.name || '',
            name: initialClient?.business || '',
            contactEmail: initialClient?.email || '',
            contactPhone: initialClient?.phone || '',
            businessWebsite: initialClient?.website || '',
        }
    });
    const [isSaving, setIsSaving] = useState(false);

    const quote = useMemo(() => calculateQuote(state), [state]);

    const handleApplyPreset = (presetId: string) => {
        const preset = PRESETS.find(p => p.id === presetId);
        if (preset) {
            dispatch({ type: 'APPLY_PRESET', payload: preset.state });
            toast.success(`Applied "${preset.name}" preset`);
        }
    };

    const handleGeneratePDF = async () => {
        try {
            await generateScopePDF(quote, state.projectInfo);
            toast.success('PDF scope document generated!');
        } catch (error) {
            console.error('PDF generation error:', error);
            toast.error('Failed to generate PDF');
        }
    };

    const handleCopyToClipboard = async () => {
        try {
            const text = generateClipboardText(quote, state.projectInfo);
            await navigator.clipboard.writeText(text);
            toast.success('Quote copied to clipboard!');
        } catch (error) {
            console.error('Clipboard error:', error);
            toast.error('Failed to copy to clipboard');
        }
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
        toast.info('Calculator reset');
    };

    const handleSaveQuote = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            const info = state.projectInfo;

            // Require at minimum a name or business
            if (!info.contactName && !info.name) {
                toast.error('Please fill in the Project Name or Contact Name before saving.');
                setIsSaving(false);
                return;
            }

            // Use initialClient ID if provided, otherwise search/create
            let clientId: string | null = initialClient?.id || null;

            if (!clientId && info.contactEmail) {
                const existing = await searchClients(info.contactEmail);
                if (existing.length > 0) {
                    clientId = existing[0].id;
                }
            }

            if (!clientId) {
                // Create new client from project info
                clientId = await createClient({
                    name: info.contactName || info.name || 'Unnamed Client',
                    business: info.name || '',
                    email: info.contactEmail || '',
                    phone: info.contactPhone || '',
                    industry: info.industry || '',
                    website: info.businessWebsite || '',
                    notes: info.notes || '',
                });
            }

            // Save the quote
            const quoteId = await saveQuote(clientId, quote, info, 'draft');

            toast.success(`Quote saved successfully!`, {
                duration: 5000,
            });
            if (onClose) onClose();
        } catch (error) {
            console.error('Save quote error:', error);
            toast.error('Failed to save quote. Make sure you are logged in.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Quick Presets */}
            <QuickPresets
                presets={PRESETS}
                onApply={handleApplyPreset}
            />

            {/* Main Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Selectors */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Base Package Selection */}
                    <Card className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-merkad-purple text-white text-sm flex items-center justify-center">1</span>
                                Select Base Package
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BasePackageSelector
                                selected={state.basePackage}
                                onChange={(pkg) => dispatch({ type: 'SET_BASE_PACKAGE', payload: pkg })}
                            />
                        </CardContent>
                    </Card>

                    {/* Add-ons */}
                    <Card className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-merkad-purple text-white text-sm flex items-center justify-center">2</span>
                                Add-ons & Enhancements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddonSection
                                addons={state.addons}
                                onChange={(key, value) =>
                                    dispatch({ type: 'SET_ADDON', payload: { key, value } })
                                }
                            />
                        </CardContent>
                    </Card>

                    {/* Project Info */}
                    <Card className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-merkad-purple text-white text-sm flex items-center justify-center">3</span>
                                Project Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProjectInfoForm
                                projectInfo={state.projectInfo}
                                onChange={(info) => dispatch({ type: 'SET_PROJECT_INFO', payload: info })}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="xl:col-span-1">
                    <div className="sticky top-6">
                        <SummaryPanel
                            quote={quote}
                            discountType={state.discount.type}
                            discountValue={state.discount.value}
                            monthlyDiscountType={state.monthlyDiscount.type}
                            monthlyDiscountValue={state.monthlyDiscount.value}
                            adSpend={state.adSpend}
                            onDiscountTypeChange={(type) => dispatch({ type: 'SET_DISCOUNT', payload: { type } })}
                            onDiscountValueChange={(value) => dispatch({ type: 'SET_DISCOUNT', payload: { value } })}
                            onMonthlyDiscountTypeChange={(type) => dispatch({ type: 'SET_MONTHLY_DISCOUNT', payload: { type } })}
                            onMonthlyDiscountValueChange={(value) => dispatch({ type: 'SET_MONTHLY_DISCOUNT', payload: { value } })}
                            onAdSpendChange={(value) => dispatch({ type: 'SET_AD_SPEND', payload: value })}
                            onGeneratePDF={handleGeneratePDF}
                            onSaveQuote={handleSaveQuote}
                            onCopyToClipboard={handleCopyToClipboard}
                            onReset={handleReset}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

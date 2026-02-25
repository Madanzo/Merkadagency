import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ADDONS, CREATIVE_SERVICES } from '@/lib/pricing/pricing.config';
import type { AddonState } from '@/lib/pricing/calculator.types';
import { ShoppingCart, Palette, Bot, Search, FileText, Instagram, Video, Megaphone, PenTool, Package, Target, Plug, Layout, Wrench, GraduationCap } from 'lucide-react';

interface AddonSectionProps {
    addons: AddonState;
    onChange: (key: keyof AddonState, value: unknown) => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

interface AddonCheckboxProps {
    id: string;
    label: string;
    price: number;
    checked: boolean;
    onChange: (checked: boolean) => void;
    suffix?: string;
}

function AddonCheckbox({ id, label, price, checked, onChange, suffix = '' }: AddonCheckboxProps) {
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-merkad-bg-elevated transition-colors">
            <div className="flex items-center gap-3">
                <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={onChange}
                    className="border-merkad-border data-[state=checked]:bg-merkad-purple data-[state=checked]:border-merkad-purple"
                />
                <Label
                    htmlFor={id}
                    className="text-sm text-merkad-text-secondary cursor-pointer hover:text-white transition-colors"
                >
                    {label}
                </Label>
            </div>
            <span className="text-sm font-medium text-merkad-purple-light">
                +{formatCurrency(price)}{suffix}
            </span>
        </div>
    );
}

interface AddonQuantityProps {
    id: string;
    label: string;
    price: number;
    count: number;
    onChange: (count: number) => void;
    suffix?: string;
}

function AddonQuantity({ id, label, price, count, onChange, suffix = '' }: AddonQuantityProps) {
    const isChecked = count > 0;

    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-merkad-bg-elevated transition-colors">
            <div className="flex items-center gap-3">
                <Checkbox
                    id={id}
                    checked={isChecked}
                    onCheckedChange={(checked) => onChange(checked ? 1 : 0)}
                    className="border-merkad-border data-[state=checked]:bg-merkad-purple data-[state=checked]:border-merkad-purple"
                />
                <Label
                    htmlFor={id}
                    className="text-sm text-merkad-text-secondary cursor-pointer hover:text-white transition-colors"
                >
                    {label}
                </Label>

                {isChecked && (
                    <div className="flex items-center ml-2 border border-merkad-border rounded bg-merkad-bg-tertiary">
                        <button
                            type="button"
                            className="px-2 py-0.5 text-merkad-text-muted hover:text-white"
                            onClick={() => onChange(Math.max(0, count - 1))}
                        >
                            -
                        </button>
                        <span className="text-xs px-2 min-w-[20px] text-center text-white">{count}</span>
                        <button
                            type="button"
                            className="px-2 py-0.5 text-merkad-text-muted hover:text-white"
                            onClick={() => onChange(count + 1)}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
            {isChecked && count > 1 ? (
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-merkad-purple-light">
                        +{formatCurrency(price * count)}{suffix}
                    </span>
                    <span className="text-[10px] text-merkad-text-muted">
                        {count} x {formatCurrency(price)}
                    </span>
                </div>
            ) : (
                <span className={`text-sm font-medium ${isChecked ? 'text-merkad-purple-light' : 'text-merkad-text-muted'}`}>
                    +{formatCurrency(price)}{suffix}
                </span>
            )}
        </div>
    );
}

interface AddonGroupProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function AddonGroup({ title, icon, children }: AddonGroupProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-medium">
                {icon}
                <span>{title}</span>
            </div>
            <div className="space-y-1 pl-1">
                {children}
            </div>
        </div>
    );
}

export function AddonSection({ addons, onChange }: AddonSectionProps) {
    return (
        <div className="space-y-8">
            {/* Development Add-ons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* E-commerce */}
                <AddonGroup title="E-commerce" icon={<ShoppingCart className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Store Size</Label>
                        <Select
                            value={addons.ecommerce}
                            onValueChange={(value) => onChange('ecommerce', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(ADDONS.ecommerce).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        {option.label} {option.price > 0 && `(+${formatCurrency(option.price)})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AddonCheckbox
                        id="paymentGateway"
                        label={ADDONS.paymentGateway.label}
                        price={ADDONS.paymentGateway.price}
                        checked={addons.paymentGateway}
                        onChange={(checked) => onChange('paymentGateway', checked)}
                    />
                    <AddonCheckbox
                        id="shipping"
                        label={ADDONS.shipping.label}
                        price={ADDONS.shipping.price}
                        checked={addons.shipping}
                        onChange={(checked) => onChange('shipping', checked)}
                    />
                </AddonGroup>

                {/* UI/UX */}
                <AddonGroup title="UI/UX Customization" icon={<Palette className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Design Level</Label>
                        <Select
                            value={addons.uiux}
                            onValueChange={(value) => onChange('uiux', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(ADDONS.uiux).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        {option.label} {option.price > 0 && `(+${formatCurrency(option.price)})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AddonCheckbox
                        id="brandIdentity"
                        label={ADDONS.brandIdentity.label}
                        price={ADDONS.brandIdentity.price}
                        checked={addons.brandIdentity}
                        onChange={(checked) => onChange('brandIdentity', checked)}
                    />
                </AddonGroup>

                {/* AI Features */}
                <AddonGroup title="AI Features" icon={<Bot className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="aiChatbot"
                        label={ADDONS.aiChatbot.label}
                        price={ADDONS.aiChatbot.price}
                        checked={addons.aiChatbot}
                        onChange={(checked) => onChange('aiChatbot', checked)}
                    />
                    <AddonCheckbox
                        id="aiCaller"
                        label={ADDONS.aiCaller.label}
                        price={ADDONS.aiCaller.price}
                        checked={addons.aiCaller}
                        onChange={(checked) => onChange('aiCaller', checked)}
                    />
                    <AddonCheckbox
                        id="leadScoring"
                        label={ADDONS.leadScoring.label}
                        price={ADDONS.leadScoring.price}
                        checked={addons.leadScoring}
                        onChange={(checked) => onChange('leadScoring', checked)}
                    />
                    <AddonCheckbox
                        id="autoBooking"
                        label={ADDONS.autoBooking.label}
                        price={ADDONS.autoBooking.price}
                        checked={addons.autoBooking}
                        onChange={(checked) => onChange('autoBooking', checked)}
                    />
                    <AddonCheckbox
                        id="customAiWorkflow"
                        label={ADDONS.customAiWorkflow.label}
                        price={ADDONS.customAiWorkflow.price}
                        checked={addons.customAiWorkflow}
                        onChange={(checked) => onChange('customAiWorkflow', checked)}
                    />
                </AddonGroup>

                {/* SEO & Marketing */}
                <AddonGroup title="SEO & Marketing" icon={<Search className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">SEO Package</Label>
                        <Select
                            value={addons.seo}
                            onValueChange={(value) => onChange('seo', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(ADDONS.seo).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        {option.label} {option.price > 0 && `(+${formatCurrency(option.price)})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AddonCheckbox
                        id="googleAds"
                        label={ADDONS.googleAds.label}
                        price={ADDONS.googleAds.price}
                        checked={addons.googleAds}
                        onChange={(checked) => onChange('googleAds', checked)}
                    />
                    <AddonCheckbox
                        id="metaAds"
                        label={ADDONS.metaAds.label}
                        price={ADDONS.metaAds.price}
                        checked={addons.metaAds}
                        onChange={(checked) => onChange('metaAds', checked)}
                    />
                    <AddonCheckbox
                        id="tiktokAds"
                        label={ADDONS.tiktokAds.label}
                        price={ADDONS.tiktokAds.price}
                        checked={addons.tiktokAds}
                        onChange={(checked) => onChange('tiktokAds', checked)}
                    />
                </AddonGroup>

                {/* Content */}
                <AddonGroup title="Content" icon={<FileText className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Content Package</Label>
                        <Select
                            value={addons.content}
                            onValueChange={(value) => onChange('content', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(ADDONS.content).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        {option.label} {option.price > 0 && `(+${formatCurrency(option.price)})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AddonCheckbox
                        id="productDescriptions"
                        label={ADDONS.productDescriptions.label}
                        price={ADDONS.productDescriptions.price}
                        checked={addons.productDescriptions}
                        onChange={(checked) => onChange('productDescriptions', checked)}
                    />
                    <AddonCheckbox
                        id="blogSetup"
                        label={ADDONS.blogSetup.label}
                        price={ADDONS.blogSetup.price}
                        checked={addons.blogSetup}
                        onChange={(checked) => onChange('blogSetup', checked)}
                    />
                </AddonGroup>

                {/* Funnels & Landing Pages */}
                <AddonGroup title="Funnels & Landing Pages" icon={<Target className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="landingPage"
                        label={ADDONS.landingPage.label}
                        price={ADDONS.landingPage.price}
                        checked={addons.landingPage}
                        onChange={(checked) => onChange('landingPage', checked)}
                    />
                    <AddonCheckbox
                        id="salesFunnel"
                        label={ADDONS.salesFunnel.label}
                        price={ADDONS.salesFunnel.price}
                        checked={addons.salesFunnel}
                        onChange={(checked) => onChange('salesFunnel', checked)}
                    />
                    <AddonCheckbox
                        id="webinarFunnel"
                        label={ADDONS.webinarFunnel.label}
                        price={ADDONS.webinarFunnel.price}
                        checked={addons.webinarFunnel}
                        onChange={(checked) => onChange('webinarFunnel', checked)}
                    />
                    <AddonCheckbox
                        id="leadMagnetFunnel"
                        label={ADDONS.leadMagnetFunnel.label}
                        price={ADDONS.leadMagnetFunnel.price}
                        checked={addons.leadMagnetFunnel}
                        onChange={(checked) => onChange('leadMagnetFunnel', checked)}
                    />
                </AddonGroup>

                {/* Integrations & Migration */}
                <AddonGroup title="Integrations & Migration" icon={<Plug className="w-5 h-5 text-merkad-purple" />}>
                    <AddonQuantity
                        id="customIntegration"
                        label={ADDONS.customIntegration.label}
                        price={ADDONS.customIntegration.price}
                        count={addons.customIntegration || 0}
                        onChange={(count) => onChange('customIntegration', count)}
                    />
                    {addons.customIntegration > 0 && (
                        <div className="ml-8 mb-2 space-y-2">
                            {Array.from({ length: addons.customIntegration }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="relative shrink-0 w-24">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-merkad-text-muted">$</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={(addons.customIntegrationPrices as number[])?.[i] ?? 500}
                                            onChange={(e) => {
                                                const prices = Array.isArray(addons.customIntegrationPrices)
                                                    ? [...addons.customIntegrationPrices]
                                                    : [];
                                                while (prices.length <= i) prices.push(500);
                                                prices[i] = Number(e.target.value) || 0;
                                                onChange('customIntegrationPrices', prices);
                                            }}
                                            className="w-full pl-6 pr-2 py-1.5 text-sm rounded-md bg-merkad-bg-tertiary border border-merkad-border text-white focus:border-merkad-purple focus:outline-none"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={`Integration ${i + 1} name (e.g., Shopify + QuickBooks sync)`}
                                        value={(addons.customIntegrationDesc as string[])?.[i] || ''}
                                        onChange={(e) => {
                                            const descs = Array.isArray(addons.customIntegrationDesc)
                                                ? [...addons.customIntegrationDesc]
                                                : [];
                                            while (descs.length <= i) descs.push('');
                                            descs[i] = e.target.value;
                                            onChange('customIntegrationDesc', descs);
                                        }}
                                        className="flex-1 px-3 py-1.5 text-sm rounded-md bg-merkad-bg-tertiary border border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <AddonCheckbox
                        id="complexWorkflow"
                        label={ADDONS.complexWorkflow.label}
                        price={ADDONS.complexWorkflow.price}
                        checked={addons.complexWorkflow}
                        onChange={(checked) => onChange('complexWorkflow', checked)}
                    />
                    <AddonCheckbox
                        id="customApi"
                        label={ADDONS.customApi.label}
                        price={ADDONS.customApi.price}
                        checked={addons.customApi}
                        onChange={(checked) => onChange('customApi', checked)}
                    />
                    <AddonCheckbox
                        id="crmMigration"
                        label={ADDONS.crmMigration.label}
                        price={ADDONS.crmMigration.price}
                        checked={addons.crmMigration}
                        onChange={(checked) => onChange('crmMigration', checked)}
                    />
                    <AddonCheckbox
                        id="websiteMigration"
                        label={ADDONS.websiteMigration.label}
                        price={ADDONS.websiteMigration.price}
                        checked={addons.websiteMigration}
                        onChange={(checked) => onChange('websiteMigration', checked)}
                    />
                    <AddonCheckbox
                        id="emailMigration"
                        label={ADDONS.emailMigration.label}
                        price={ADDONS.emailMigration.price}
                        checked={addons.emailMigration}
                        onChange={(checked) => onChange('emailMigration', checked)}
                    />
                </AddonGroup>

                {/* Platform Setup */}
                <AddonGroup title="Platform Setup" icon={<Layout className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="membershipSite"
                        label={ADDONS.membershipSite.label}
                        price={ADDONS.membershipSite.price}
                        checked={addons.membershipSite}
                        onChange={(checked) => onChange('membershipSite', checked)}
                    />
                    <AddonCheckbox
                        id="coursePlatform"
                        label={ADDONS.coursePlatform.label}
                        price={ADDONS.coursePlatform.price}
                        checked={addons.coursePlatform}
                        onChange={(checked) => onChange('coursePlatform', checked)}
                    />
                    <AddonCheckbox
                        id="bookingSystem"
                        label={ADDONS.bookingSystem.label}
                        price={ADDONS.bookingSystem.price}
                        checked={addons.bookingSystem}
                        onChange={(checked) => onChange('bookingSystem', checked)}
                    />
                    <AddonCheckbox
                        id="reviewPlatform"
                        label={ADDONS.reviewPlatform.label}
                        price={ADDONS.reviewPlatform.price}
                        checked={addons.reviewPlatform}
                        onChange={(checked) => onChange('reviewPlatform', checked)}
                    />
                    <AddonCheckbox
                        id="multiLanguage"
                        label={ADDONS.multiLanguage.label}
                        price={ADDONS.multiLanguage.price}
                        checked={addons.multiLanguage}
                        onChange={(checked) => onChange('multiLanguage', checked)}
                    />
                </AddonGroup>

                {/* Technical */}
                <AddonGroup title="Technical" icon={<Wrench className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="speedOptimization"
                        label={ADDONS.speedOptimization.label}
                        price={ADDONS.speedOptimization.price}
                        checked={addons.speedOptimization}
                        onChange={(checked) => onChange('speedOptimization', checked)}
                    />
                    <AddonCheckbox
                        id="securityHardening"
                        label={ADDONS.securityHardening.label}
                        price={ADDONS.securityHardening.price}
                        checked={addons.securityHardening}
                        onChange={(checked) => onChange('securityHardening', checked)}
                    />
                    <AddonCheckbox
                        id="accessibility"
                        label={ADDONS.accessibility.label}
                        price={ADDONS.accessibility.price}
                        checked={addons.accessibility}
                        onChange={(checked) => onChange('accessibility', checked)}
                    />
                    <AddonCheckbox
                        id="domainSetup"
                        label={ADDONS.domainSetup.label}
                        price={ADDONS.domainSetup.price}
                        checked={addons.domainSetup}
                        onChange={(checked) => onChange('domainSetup', checked)}
                    />
                    <AddonCheckbox
                        id="domainPayment"
                        label={ADDONS.domainPayment.label}
                        price={addons.domainPayment || 0}
                        checked={addons.domainPayment > 0}
                        onChange={(checked) => onChange('domainPayment', checked ? 20 : 0)}
                    />
                    {addons.domainPayment > 0 && (
                        <div className="ml-8 mb-2 flex items-center gap-2">
                            <span className="text-sm text-merkad-text-muted">$</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="Enter price"
                                value={addons.domainPayment}
                                onChange={(e) => onChange('domainPayment', parseFloat(e.target.value) || 0)}
                                className="w-[120px] px-3 py-1.5 text-sm rounded-md bg-merkad-bg-tertiary border border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple focus:outline-none"
                            />
                        </div>
                    )}
                    <AddonCheckbox
                        id="legalPages"
                        label={ADDONS.legalPages.label}
                        price={ADDONS.legalPages.price}
                        checked={addons.legalPages}
                        onChange={(checked) => onChange('legalPages', checked)}
                    />
                </AddonGroup>

                {/* Training & Support */}
                <AddonGroup title="Training & Support" icon={<GraduationCap className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="trainingSession"
                        label={ADDONS.trainingSession.label}
                        price={ADDONS.trainingSession.price}
                        checked={addons.trainingSession}
                        onChange={(checked) => onChange('trainingSession', checked)}
                    />
                    <AddonCheckbox
                        id="videoDocumentation"
                        label={ADDONS.videoDocumentation.label}
                        price={ADDONS.videoDocumentation.price}
                        checked={addons.videoDocumentation}
                        onChange={(checked) => onChange('videoDocumentation', checked)}
                    />
                    <AddonCheckbox
                        id="fullOnboarding"
                        label={ADDONS.fullOnboarding.label}
                        price={ADDONS.fullOnboarding.price}
                        checked={addons.fullOnboarding}
                        onChange={(checked) => onChange('fullOnboarding', checked)}
                    />
                </AddonGroup>

                {/* Brand & Design */}
                <AddonGroup title="Brand & Design" icon={<Palette className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="logoDesign"
                        label={ADDONS.logoDesign.label}
                        price={ADDONS.logoDesign.price}
                        checked={addons.logoDesign}
                        onChange={(checked) => onChange('logoDesign', checked)}
                    />
                    <AddonCheckbox
                        id="logoVariations"
                        label={ADDONS.logoVariations.label}
                        price={ADDONS.logoVariations.price}
                        checked={addons.logoVariations}
                        onChange={(checked) => onChange('logoVariations', checked)}
                    />
                    <AddonCheckbox
                        id="brandGuidelines"
                        label={ADDONS.brandGuidelines.label}
                        price={ADDONS.brandGuidelines.price}
                        checked={addons.brandGuidelines}
                        onChange={(checked) => onChange('brandGuidelines', checked)}
                    />
                    <AddonCheckbox
                        id="socialBrandKit"
                        label={ADDONS.socialBrandKit.label}
                        price={ADDONS.socialBrandKit.price}
                        checked={addons.socialBrandKit}
                        onChange={(checked) => onChange('socialBrandKit', checked)}
                    />
                    <AddonCheckbox
                        id="emailSignature"
                        label={ADDONS.emailSignature.label}
                        price={ADDONS.emailSignature.price}
                        checked={addons.emailSignature}
                        onChange={(checked) => onChange('emailSignature', checked)}
                    />
                    <AddonCheckbox
                        id="letterheadInvoice"
                        label={ADDONS.letterheadInvoice.label}
                        price={ADDONS.letterheadInvoice.price}
                        checked={addons.letterheadInvoice}
                        onChange={(checked) => onChange('letterheadInvoice', checked)}
                    />
                    <AddonCheckbox
                        id="vehicleWrap"
                        label={ADDONS.vehicleWrap.label}
                        price={ADDONS.vehicleWrap.price}
                        checked={addons.vehicleWrap}
                        onChange={(checked) => onChange('vehicleWrap', checked)}
                    />
                    <AddonCheckbox
                        id="signageDesign"
                        label={ADDONS.signageDesign.label}
                        price={ADDONS.signageDesign.price}
                        checked={addons.signageDesign}
                        onChange={(checked) => onChange('signageDesign', checked)}
                    />
                    <AddonCheckbox
                        id="menuCatalog"
                        label={ADDONS.menuCatalog.label}
                        price={ADDONS.menuCatalog.price}
                        checked={addons.menuCatalog}
                        onChange={(checked) => onChange('menuCatalog', checked)}
                    />
                    <AddonCheckbox
                        id="packagingDesign"
                        label={ADDONS.packagingDesign.label}
                        price={ADDONS.packagingDesign.price}
                        checked={addons.packagingDesign}
                        onChange={(checked) => onChange('packagingDesign', checked)}
                    />
                    <AddonCheckbox
                        id="merchandiseDesign"
                        label={ADDONS.merchandiseDesign.label}
                        price={ADDONS.merchandiseDesign.price}
                        checked={addons.merchandiseDesign}
                        onChange={(checked) => onChange('merchandiseDesign', checked)}
                    />
                </AddonGroup>
            </div>

            {/* Creative Services Divider */}
            <div className="relative py-4">
                <Separator className="bg-merkad-purple/30" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-merkad-bg-secondary px-4 text-sm font-medium text-merkad-purple-light">
                    Creative Services (Monthly Retainers)
                </span>
            </div>

            {/* Creative Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Social Media Content */}
                <AddonGroup title="Social Media Content" icon={<Instagram className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Package</Label>
                        <Select
                            value={addons.socialMedia}
                            onValueChange={(value) => onChange('socialMedia', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(CREATIVE_SERVICES.socialMedia).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        <div className="flex flex-col">
                                            <span>{option.label} {option.price > 0 && `(${formatCurrency(option.price)}/mo)`}</span>
                                            {option.deliverables && <span className="text-xs text-merkad-text-muted">{option.deliverables}</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AddonGroup>

                {/* Blog & Content Writing */}
                <AddonGroup title="Blog & Content Writing" icon={<FileText className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Package</Label>
                        <Select
                            value={addons.blogWriting}
                            onValueChange={(value) => onChange('blogWriting', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(CREATIVE_SERVICES.blogWriting).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        <div className="flex flex-col">
                                            <span>{option.label} {option.price > 0 && `(${formatCurrency(option.price)}/mo)`}</span>
                                            {option.deliverables && <span className="text-xs text-merkad-text-muted">{option.deliverables}</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AddonGroup>

                {/* Video Production */}
                <AddonGroup title="Video Production" icon={<Video className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Package</Label>
                        <Select
                            value={addons.videoProduction}
                            onValueChange={(value) => onChange('videoProduction', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(CREATIVE_SERVICES.videoProduction).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        <div className="flex flex-col">
                                            <span>{option.label} {option.price > 0 && `(${formatCurrency(option.price)}/mo)`}</span>
                                            {option.deliverables && <span className="text-xs text-merkad-text-muted">{option.deliverables}</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <AddonCheckbox
                        id="extraVideo"
                        label={CREATIVE_SERVICES.extraVideo.label}
                        price={CREATIVE_SERVICES.extraVideo.price}
                        checked={addons.extraVideo}
                        onChange={(checked) => onChange('extraVideo', checked)}
                        suffix="/ea"
                    />
                </AddonGroup>

                {/* Ad Creative */}
                <AddonGroup title="Ad Creative" icon={<Megaphone className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Package</Label>
                        <Select
                            value={addons.adCreative}
                            onValueChange={(value) => onChange('adCreative', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(CREATIVE_SERVICES.adCreative).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        <div className="flex flex-col">
                                            <span>{option.label} {option.price > 0 && `(${formatCurrency(option.price)}/mo)`}</span>
                                            {option.deliverables && <span className="text-xs text-merkad-text-muted">{option.deliverables}</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AddonGroup>

                {/* Graphic Design */}
                <AddonGroup title="Graphic Design Retainer" icon={<PenTool className="w-5 h-5 text-merkad-purple" />}>
                    <div className="mb-3">
                        <Label className="text-sm text-merkad-text-muted mb-2 block">Package</Label>
                        <Select
                            value={addons.graphicDesign}
                            onValueChange={(value) => onChange('graphicDesign', value)}
                        >
                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                {Object.entries(CREATIVE_SERVICES.graphicDesign).map(([key, option]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                    >
                                        <div className="flex flex-col">
                                            <span>{option.label} {option.price > 0 && `(${formatCurrency(option.price)}/mo)`}</span>
                                            {option.deliverables && <span className="text-xs text-merkad-text-muted">{option.deliverables}</span>}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </AddonGroup>

                {/* Other Creative */}
                <AddonGroup title="Other Creative" icon={<Palette className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="ugcStyle"
                        label={CREATIVE_SERVICES.ugcStyle.label}
                        price={CREATIVE_SERVICES.ugcStyle.price}
                        checked={addons.ugcStyle}
                        onChange={(checked) => onChange('ugcStyle', checked)}
                        suffix="/mo"
                    />
                    <AddonCheckbox
                        id="productPhotography"
                        label={CREATIVE_SERVICES.productPhotography.label}
                        price={CREATIVE_SERVICES.productPhotography.price}
                        checked={addons.productPhotography}
                        onChange={(checked) => onChange('productPhotography', checked)}
                        suffix="/session"
                    />
                    <AddonCheckbox
                        id="droneVideo"
                        label={CREATIVE_SERVICES.droneVideo.label}
                        price={CREATIVE_SERVICES.droneVideo.price}
                        checked={addons.droneVideo}
                        onChange={(checked) => onChange('droneVideo', checked)}
                        suffix="/session"
                    />
                    <AddonCheckbox
                        id="animation"
                        label={CREATIVE_SERVICES.animation.label}
                        price={CREATIVE_SERVICES.animation.price}
                        checked={addons.animation}
                        onChange={(checked) => onChange('animation', checked)}
                        suffix="/ea"
                    />
                    <AddonCheckbox
                        id="copywritingAddon"
                        label={CREATIVE_SERVICES.copywritingAddon.label}
                        price={CREATIVE_SERVICES.copywritingAddon.price}
                        checked={addons.copywritingAddon}
                        onChange={(checked) => onChange('copywritingAddon', checked)}
                        suffix="/mo"
                    />
                </AddonGroup>

                {/* Bundle */}
                <AddonGroup title="Bundle Deal" icon={<Package className="w-5 h-5 text-merkad-purple" />}>
                    <AddonCheckbox
                        id="brandContentBundle"
                        label={CREATIVE_SERVICES.brandContentBundle.label}
                        price={CREATIVE_SERVICES.brandContentBundle.price}
                        checked={addons.brandContentBundle}
                        onChange={(checked) => onChange('brandContentBundle', checked)}
                        suffix="/mo"
                    />
                    <p className="text-xs text-merkad-text-muted pl-10 -mt-1">
                        {CREATIVE_SERVICES.brandContentBundle.deliverables}
                    </p>
                </AddonGroup>
            </div>
        </div>
    );
}

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { INDUSTRIES } from '@/lib/pricing/pricing.config';
import type { ProjectInfo, PaymentTerms, BudgetRange } from '@/lib/pricing/calculator.types';
import { Separator } from '@/components/ui/separator';

interface ProjectInfoFormProps {
    projectInfo: ProjectInfo;
    onChange: (info: Partial<ProjectInfo>) => void;
}

const PAYMENT_TERMS_OPTIONS: { value: PaymentTerms; label: string }[] = [
    { value: '50-50', label: '50% to start, 50% on delivery' },
    { value: '100-upfront', label: '100% upfront' },
    { value: '30-60-10', label: '30% / 60% / 10%' },
    { value: 'net-30', label: 'Net 30' },
    { value: 'custom', label: 'Custom terms' },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
    { value: 'under-1k', label: 'Under $1,000' },
    { value: '1k-3k', label: '$1,000 - $3,000' },
    { value: '3k-5k', label: '$3,000 - $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-plus', label: '$25,000+' },
];

export function ProjectInfoForm({ projectInfo, onChange }: ProjectInfoFormProps) {
    // Default quote validity to 14 days from now if empty
    const getDefaultValidDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="space-y-6">
            {/* Basic Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Name */}
                <div className="space-y-2">
                    <Label htmlFor="projectName" className="text-merkad-text-secondary">
                        Project/Client Name *
                    </Label>
                    <Input
                        id="projectName"
                        placeholder="e.g., Green Valley Dispensary"
                        value={projectInfo.name}
                        onChange={(e) => onChange({ name: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                    <Label htmlFor="industry" className="text-merkad-text-secondary">
                        Industry *
                    </Label>
                    <Select
                        value={projectInfo.industry}
                        onValueChange={(value) => onChange({ industry: value as typeof projectInfo.industry })}
                    >
                        <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                            <SelectValue placeholder="Select industry..." />
                        </SelectTrigger>
                        <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                            {INDUSTRIES.map((industry) => (
                                <SelectItem
                                    key={industry}
                                    value={industry}
                                    className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                >
                                    {industry}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Contact Info Section */}
            <div className="relative py-2">
                <Separator className="bg-merkad-border" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-merkad-bg-secondary px-2 text-xs font-medium text-merkad-text-muted">
                    Contact Information
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Name */}
                <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-merkad-text-secondary">
                        Contact Name
                    </Label>
                    <Input
                        id="contactName"
                        placeholder="e.g., John Smith"
                        value={projectInfo.contactName}
                        onChange={(e) => onChange({ contactName: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-merkad-text-secondary">
                        Contact Email
                    </Label>
                    <Input
                        id="contactEmail"
                        type="email"
                        placeholder="e.g., john@example.com"
                        value={projectInfo.contactEmail}
                        onChange={(e) => onChange({ contactEmail: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-merkad-text-secondary">
                        Contact Phone
                    </Label>
                    <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="e.g., (555) 123-4567"
                        value={projectInfo.contactPhone}
                        onChange={(e) => onChange({ contactPhone: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>

                {/* Business Website */}
                <div className="space-y-2">
                    <Label htmlFor="businessWebsite" className="text-merkad-text-secondary">
                        Current Business Website
                    </Label>
                    <Input
                        id="businessWebsite"
                        type="url"
                        placeholder="e.g., https://example.com"
                        value={projectInfo.businessWebsite}
                        onChange={(e) => onChange({ businessWebsite: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>
            </div>

            {/* Quote Details Section */}
            <div className="relative py-2">
                <Separator className="bg-merkad-border" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-merkad-bg-secondary px-2 text-xs font-medium text-merkad-text-muted">
                    Quote Details
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Timeline */}
                <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-merkad-text-secondary">
                        Estimated Timeline
                    </Label>
                    <Input
                        id="timeline"
                        placeholder="e.g., 4-6 weeks"
                        value={projectInfo.timeline}
                        onChange={(e) => onChange({ timeline: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>

                {/* Quote Valid Until */}
                <div className="space-y-2">
                    <Label htmlFor="quoteValidUntil" className="text-merkad-text-secondary">
                        Quote Valid Until
                    </Label>
                    <Input
                        id="quoteValidUntil"
                        type="date"
                        value={projectInfo.quoteValidUntil || getDefaultValidDate()}
                        onChange={(e) => onChange({ quoteValidUntil: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>

                {/* Payment Terms */}
                <div className="space-y-2">
                    <Label htmlFor="paymentTerms" className="text-merkad-text-secondary">
                        Payment Terms
                    </Label>
                    <Select
                        value={projectInfo.paymentTerms}
                        onValueChange={(value) => onChange({ paymentTerms: value as PaymentTerms })}
                    >
                        <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                            <SelectValue placeholder="Select terms..." />
                        </SelectTrigger>
                        <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                            {PAYMENT_TERMS_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Optional Fields Section */}
            <div className="relative py-2">
                <Separator className="bg-merkad-border" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-merkad-bg-secondary px-2 text-xs font-medium text-merkad-text-muted">
                    Optional
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Project Start Date */}
                <div className="space-y-2">
                    <Label htmlFor="projectStartDate" className="text-merkad-text-secondary">
                        Project Start Date
                    </Label>
                    <Input
                        id="projectStartDate"
                        type="date"
                        value={projectInfo.projectStartDate}
                        onChange={(e) => onChange({ projectStartDate: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>

                {/* Monthly Budget Range */}
                <div className="space-y-2">
                    <Label htmlFor="monthlyBudget" className="text-merkad-text-secondary">
                        Monthly Budget Range
                    </Label>
                    <Select
                        value={projectInfo.monthlyBudgetRange}
                        onValueChange={(value) => onChange({ monthlyBudgetRange: value as BudgetRange })}
                    >
                        <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                            <SelectValue placeholder="Select range..." />
                        </SelectTrigger>
                        <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                            {BUDGET_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Referral Source */}
                <div className="space-y-2">
                    <Label htmlFor="referralSource" className="text-merkad-text-secondary">
                        Referral Source
                    </Label>
                    <Input
                        id="referralSource"
                        placeholder="e.g., Google, Referral, Instagram"
                        value={projectInfo.referralSource}
                        onChange={(e) => onChange({ referralSource: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                    />
                </div>
            </div>

            {/* Notes - Full width */}
            <div className="space-y-2">
                <Label htmlFor="notes" className="text-merkad-text-secondary">
                    Notes
                </Label>
                <Textarea
                    id="notes"
                    placeholder="Additional project details, special requirements, or notes..."
                    value={projectInfo.notes}
                    onChange={(e) => onChange({ notes: e.target.value })}
                    rows={3}
                    className="bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple resize-none"
                />
            </div>
        </div>
    );
}

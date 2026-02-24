import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileDown, Copy, RotateCcw, Save, DollarSign, CalendarClock, Percent, Tag, Megaphone } from 'lucide-react';
import type { QuoteSummary } from '@/lib/pricing/calculator.types';

interface SummaryPanelProps {
    quote: QuoteSummary;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    monthlyDiscountType: 'percentage' | 'fixed';
    monthlyDiscountValue: number;
    adSpend: number;
    onDiscountTypeChange: (type: 'percentage' | 'fixed') => void;
    onDiscountValueChange: (value: number) => void;
    onMonthlyDiscountTypeChange: (type: 'percentage' | 'fixed') => void;
    onMonthlyDiscountValueChange: (value: number) => void;
    onAdSpendChange: (value: number) => void;
    onGeneratePDF: () => void;
    onSaveQuote: () => void;
    onCopyToClipboard: () => void;
    onReset: () => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

export function SummaryPanel({
    quote,
    discountType,
    discountValue,
    monthlyDiscountType,
    monthlyDiscountValue,
    adSpend,
    onDiscountTypeChange,
    onDiscountValueChange,
    onMonthlyDiscountTypeChange,
    onMonthlyDiscountValueChange,
    onAdSpendChange,
    onGeneratePDF,
    onSaveQuote,
    onCopyToClipboard,
    onReset
}: SummaryPanelProps) {
    return (
        <Card className="bg-merkad-bg-secondary border-merkad-purple/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
            <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-merkad-purple" />
                    YOUR QUOTE
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Base Package */}
                <div className="flex items-center justify-between py-2 px-3 bg-merkad-bg-tertiary rounded-lg">
                    <div>
                        <span className="text-xs text-merkad-text-muted uppercase tracking-wide">Base</span>
                        <p className="text-white font-medium">{quote.basePackage.label}</p>
                    </div>
                    <span className="text-lg font-bold text-white">
                        {formatCurrency(quote.basePackage.price)}
                    </span>
                </div>

                {/* Add-ons */}
                {quote.addons.length > 0 && (
                    <div className="space-y-2">
                        <span className="text-xs text-merkad-text-muted uppercase tracking-wide px-1">Add-ons</span>
                        <div className="space-y-1">
                            {quote.addons.map((addon) => (
                                <div
                                    key={addon.key}
                                    className="flex items-center justify-between py-1.5 px-3 text-sm"
                                >
                                    <span className="text-merkad-text-secondary">• {addon.label}</span>
                                    <span className="text-merkad-purple-light font-medium">
                                        {formatCurrency(addon.price)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between py-2 px-3 bg-merkad-bg-tertiary/50 rounded-lg">
                    <span className="text-merkad-text-secondary font-medium">Subtotal</span>
                    <span className="text-lg font-semibold text-white">
                        {formatCurrency(quote.oneTimeTotal)}
                    </span>
                </div>

                {/* Discount Input */}
                <div className="space-y-2 p-3 bg-merkad-bg-tertiary rounded-lg border border-dashed border-merkad-border">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-white font-medium">Apply Discount</span>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={discountType}
                            onValueChange={(v) => onDiscountTypeChange(v as 'percentage' | 'fixed')}
                        >
                            <SelectTrigger className="w-32 bg-merkad-bg-elevated border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                <SelectItem value="percentage" className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20">
                                    <div className="flex items-center gap-1">
                                        <Percent className="w-3 h-3" />
                                        Percent
                                    </div>
                                </SelectItem>
                                <SelectItem value="fixed" className="text-white hover:bg-merkad-purple/20 focus:bg-merkad-purple/20">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        Fixed
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                min={0}
                                max={discountType === 'percentage' ? 100 : undefined}
                                value={discountValue || ''}
                                onChange={(e) => onDiscountValueChange(Number(e.target.value) || 0)}
                                placeholder={discountType === 'percentage' ? '10' : '500'}
                                className="bg-merkad-bg-elevated border-merkad-border text-white pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-merkad-text-muted text-sm">
                                {discountType === 'percentage' ? '%' : '$'}
                            </span>
                        </div>
                    </div>
                    {quote.discount.amount > 0 && (
                        <div className="flex items-center justify-between pt-2 text-sm">
                            <span className="text-amber-500">Discount applied:</span>
                            <span className="text-amber-500 font-medium">-{formatCurrency(quote.discount.amount)}</span>
                        </div>
                    )}
                </div>

                <Separator className="bg-merkad-border" />

                {/* One-time Total */}
                <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-merkad-purple/20 to-merkad-purple/10 rounded-xl border border-merkad-purple/30">
                    <div>
                        <span className="text-white font-semibold">ONE-TIME TOTAL</span>
                        {quote.discount.amount > 0 && (
                            <p className="text-xs text-merkad-text-muted line-through">{formatCurrency(quote.oneTimeTotal)}</p>
                        )}
                    </div>
                    <span className="text-2xl font-bold text-white">
                        {formatCurrency(quote.finalOneTimeTotal)}
                    </span>
                </div>

                <Separator className="bg-merkad-border" />

                {/* Monthly Recurring */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                        <CalendarClock className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-merkad-text-muted uppercase tracking-wide">Monthly Recurring</span>
                    </div>
                    <div className="space-y-1">
                        {quote.monthly.map((item) => (
                            <div
                                key={item.key}
                                className="flex items-center justify-between py-1.5 px-3 text-sm"
                            >
                                <span className="text-merkad-text-secondary">• {item.label}</span>
                                <span className="text-green-400 font-medium">
                                    {formatCurrency(item.price)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Subtotal */}
                <div className="flex items-center justify-between py-2 px-3 bg-merkad-bg-tertiary/50 rounded-lg">
                    <span className="text-merkad-text-secondary text-sm">Services Subtotal</span>
                    <span className="text-sm text-green-400">
                        {formatCurrency(quote.monthlyTotal)}<span className="text-xs font-normal">/mo</span>
                    </span>
                </div>

                {/* Monthly Discount */}
                <div className="space-y-2 p-3 bg-merkad-bg-tertiary rounded-lg border border-dashed border-green-500/30">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white font-medium">Monthly Discount</span>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={monthlyDiscountType}
                            onValueChange={(v) => onMonthlyDiscountTypeChange(v as 'percentage' | 'fixed')}
                        >
                            <SelectTrigger className="w-32 bg-merkad-bg-elevated border-merkad-border text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-merkad-bg-elevated border-merkad-border">
                                <SelectItem value="percentage" className="text-white hover:bg-green-500/20 focus:bg-green-500/20">
                                    <div className="flex items-center gap-1">
                                        <Percent className="w-3 h-3" />
                                        Percent
                                    </div>
                                </SelectItem>
                                <SelectItem value="fixed" className="text-white hover:bg-green-500/20 focus:bg-green-500/20">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        Fixed
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                min={0}
                                max={monthlyDiscountType === 'percentage' ? 100 : undefined}
                                value={monthlyDiscountValue || ''}
                                onChange={(e) => onMonthlyDiscountValueChange(Number(e.target.value) || 0)}
                                placeholder={monthlyDiscountType === 'percentage' ? '10' : '100'}
                                className="bg-merkad-bg-elevated border-merkad-border text-white pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-merkad-text-muted text-sm">
                                {monthlyDiscountType === 'percentage' ? '%' : '$'}
                            </span>
                        </div>
                    </div>
                    {quote.monthlyDiscount.amount > 0 && (
                        <div className="flex items-center justify-between pt-2 text-sm">
                            <span className="text-green-400">Discount applied:</span>
                            <span className="text-green-400 font-medium">-{formatCurrency(quote.monthlyDiscount.amount)}/mo</span>
                        </div>
                    )}
                </div>

                {/* Services Total (after discount) */}
                <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg">
                    <div>
                        <span className="text-merkad-text-secondary text-sm">Services Total</span>
                        {quote.monthlyDiscount.amount > 0 && (
                            <p className="text-xs text-merkad-text-muted line-through">{formatCurrency(quote.monthlyTotal)}/mo</p>
                        )}
                    </div>
                    <span className="text-lg font-semibold text-green-400">
                        {formatCurrency(quote.finalMonthlyTotal)}<span className="text-xs font-normal">/mo</span>
                    </span>
                </div>

                {/* Ad Spend Input */}
                <div className="space-y-2 p-3 bg-merkad-bg-tertiary rounded-lg border border-dashed border-blue-500/30">
                    <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white font-medium">Monthly Ad Spend</span>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-merkad-text-muted">$</span>
                        <Input
                            type="number"
                            min={0}
                            value={adSpend || ''}
                            onChange={(e) => onAdSpendChange(Number(e.target.value) || 0)}
                            placeholder="1000"
                            className="bg-merkad-bg-elevated border-merkad-border text-white pl-7"
                        />
                    </div>
                    <p className="text-xs text-merkad-text-muted">Client media budget (paid to platforms)</p>
                </div>

                {/* Grand Monthly Total */}
                <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-xl border border-green-500/30">
                    <div>
                        <span className="text-white font-semibold">MONTHLY TOTAL</span>
                        {(adSpend > 0 || quote.monthlyDiscount.amount > 0) && (
                            <p className="text-xs text-merkad-text-muted">Services + Ad Spend</p>
                        )}
                    </div>
                    <span className="text-2xl font-bold text-green-400">
                        {formatCurrency(quote.grandMonthlyTotal)}<span className="text-sm font-normal">/mo</span>
                    </span>
                </div>

                <Separator className="bg-merkad-border" />

                {/* Actions */}
                <div className="space-y-2 pt-2">
                    <Button
                        onClick={onGeneratePDF}
                        className="w-full bg-merkad-purple hover:bg-merkad-purple-light text-white"
                    >
                        <FileDown className="w-4 h-4 mr-2" />
                        Generate Scope PDF
                    </Button>
                    <Button
                        onClick={onSaveQuote}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Quote to CRM
                    </Button>
                    <Button
                        onClick={onCopyToClipboard}
                        variant="outline"
                        className="w-full border-merkad-border text-white hover:bg-merkad-bg-tertiary"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                    </Button>
                    <Button
                        onClick={onReset}
                        variant="ghost"
                        className="w-full text-merkad-text-muted hover:text-white hover:bg-merkad-bg-tertiary"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Calculator
                    </Button>
                </div>

                {/* Terms reminder */}
                <div className="text-center pt-2">
                    <p className="text-xs text-merkad-text-muted">
                        Terms: 50% to start • 50% on delivery
                    </p>
                    <p className="text-xs text-merkad-text-muted">
                        Quote valid for 14 days
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

import type { Service } from '@/lib/services/service.types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/services/service.types';
import { getRelatedServices } from '@/lib/services/services.data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, X, DollarSign, Package, Lightbulb, Link2 } from 'lucide-react';

interface ServiceModalProps {
    service: Service;
    onClose: () => void;
    onAddToQuote: () => void;
    onSelectRelated: (service: Service) => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

export function ServiceModal({ service, onClose, onAddToQuote, onSelectRelated }: ServiceModalProps) {
    const categoryColor = CATEGORY_COLORS[service.category];
    const categoryLabel = CATEGORY_LABELS[service.category];
    const relatedServices = getRelatedServices(service);

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="bg-merkad-bg-elevated border-merkad-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-white mb-2">
                                {service.name}
                            </DialogTitle>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded ${categoryColor.bg} ${categoryColor.text}`}>
                                    {categoryLabel}
                                </span>
                                {service.subcategory && (
                                    <span className="text-xs text-merkad-text-muted">
                                        {service.subcategory}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-merkad-text-muted hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogHeader>

                {/* Pricing Section */}
                <div className="bg-merkad-bg-tertiary rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-merkad-purple" />
                        <span className="font-medium">Pricing</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                            {service.price === 0 ? 'Free' : formatCurrency(service.price)}
                        </span>
                        {service.priceNote && (
                            <span className="text-sm text-merkad-text-muted">{service.priceNote}</span>
                        )}
                    </div>
                    {service.monthlyFee && (
                        <div className="mt-2 text-sm text-blue-400">
                            + {formatCurrency(service.monthlyFee.price)}/mo — {service.monthlyFee.name}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <p className="text-merkad-text-secondary">{service.fullDescription}</p>
                </div>

                <Separator className="bg-merkad-border my-4" />

                {/* What's Included */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-green-400" />
                        <span className="font-medium">What's Included</span>
                    </div>
                    <ul className="space-y-2">
                        {service.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-merkad-text-secondary">
                                <span className="text-green-400 mt-0.5">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <Separator className="bg-merkad-border my-4" />

                {/* Sell When */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                        <span className="font-medium">Sell When Client Says</span>
                    </div>
                    <ul className="space-y-2">
                        {service.sellWhen.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-merkad-text-secondary">
                                <span className="text-amber-400 mt-0.5">"</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <>
                        <Separator className="bg-merkad-border my-4" />
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Link2 className="w-5 h-5 text-merkad-purple" />
                                <span className="font-medium">Related Services</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {relatedServices.map((related) => (
                                    <button
                                        key={related.id}
                                        onClick={() => onSelectRelated(related)}
                                        className="text-sm px-3 py-1.5 rounded-lg bg-merkad-bg-tertiary border border-merkad-border hover:border-merkad-purple text-merkad-text-secondary hover:text-white transition-colors"
                                    >
                                        {related.name}
                                        <span className="ml-1 text-merkad-purple-light">
                                            ({formatCurrency(related.price)})
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Action Button */}
                <div className="mt-6">
                    <Button
                        onClick={onAddToQuote}
                        className="w-full bg-merkad-purple hover:bg-merkad-purple-hover text-white py-3"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add to Quote
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

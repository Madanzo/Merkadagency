import type { Service } from '@/lib/services/service.types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/services/service.types';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';

interface ServiceCardProps {
    service: Service;
    onViewDetails: () => void;
    onAddToQuote: () => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

export function ServiceCard({ service, onViewDetails, onAddToQuote }: ServiceCardProps) {
    const categoryColor = CATEGORY_COLORS[service.category];
    const categoryLabel = CATEGORY_LABELS[service.category];

    return (
        <div className="group bg-merkad-bg-card border border-merkad-border rounded-xl p-5 hover:border-merkad-purple transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-merkad-purple-light transition-colors">
                    {service.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded ${categoryColor.bg} ${categoryColor.text}`}>
                    {categoryLabel}
                </span>
            </div>

            {/* Price */}
            <div className="mb-3">
                <span className="text-2xl font-bold text-white">
                    {service.price === 0 ? 'Free' : formatCurrency(service.price)}
                </span>
                {service.priceNote && (
                    <span className="text-sm text-merkad-text-muted ml-1">
                        {service.priceNote}
                    </span>
                )}
                {service.priceType === 'monthly' && (
                    <span className="text-sm text-merkad-text-muted">/mo</span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-merkad-text-secondary mb-4 line-clamp-2">
                {service.shortDescription}
            </p>

            {/* Monthly Fee Indicator */}
            {service.monthlyFee && (
                <div className="text-xs text-blue-400 mb-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    +{formatCurrency(service.monthlyFee.price)}/mo management
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onViewDetails}
                    className="flex-1 border-merkad-border text-merkad-text-secondary hover:text-white hover:border-merkad-purple"
                >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                </Button>
                <Button
                    size="sm"
                    onClick={onAddToQuote}
                    className="flex-1 bg-merkad-purple hover:bg-merkad-purple-hover text-white"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Quote
                </Button>
            </div>
        </div>
    );
}

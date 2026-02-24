import { Check } from 'lucide-react';
import { BASE_PACKAGES, type BasePackageKey } from '@/lib/pricing/pricing.config';

interface BasePackageSelectorProps {
    selected: BasePackageKey;
    onChange: (pkg: BasePackageKey) => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

export function BasePackageSelector({ selected, onChange }: BasePackageSelectorProps) {
    const packages = Object.entries(BASE_PACKAGES) as [BasePackageKey, typeof BASE_PACKAGES[BasePackageKey]][];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map(([key, pkg]) => {
                const isSelected = selected === key;

                return (
                    <button
                        key={key}
                        onClick={() => onChange(key)}
                        className={`
              relative p-5 rounded-xl border-2 text-left transition-all duration-200
              ${isSelected
                                ? 'border-merkad-purple bg-merkad-purple/10 shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                                : 'border-merkad-border bg-merkad-bg-tertiary hover:border-merkad-purple/50 hover:bg-merkad-bg-elevated'
                            }
            `}
                    >
                        {/* Selection indicator */}
                        <div className={`
              absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center
              ${isSelected
                                ? 'bg-merkad-purple text-white'
                                : 'border-2 border-merkad-border'
                            }
            `}>
                            {isSelected && <Check className="w-4 h-4" />}
                        </div>

                        {/* Package name */}
                        <h3 className={`font-display font-bold text-lg mb-1 ${isSelected ? 'text-merkad-purple-light' : 'text-white'}`}>
                            {pkg.label}
                        </h3>

                        {/* Price */}
                        <div className="text-2xl font-bold text-white mb-3">
                            {formatCurrency(pkg.price)}
                        </div>

                        {/* Description */}
                        {/* Features List */}
                        <div className="space-y-2 mb-2">
                            {pkg.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <div className={`mt-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-merkad-purple-light' : 'bg-merkad-text-secondary'}`} />
                                    <span className={`text-sm ${isSelected ? 'text-white' : 'text-merkad-text-secondary'}`}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Description (Old - kept for context but muted) */}
                        <p className="text-xs text-merkad-text-muted mt-4 border-t border-white/5 pt-2">
                            {pkg.description}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}

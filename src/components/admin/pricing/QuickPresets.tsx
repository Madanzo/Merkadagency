import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { Preset } from '@/lib/pricing/presets.config';

interface QuickPresetsProps {
    presets: Preset[];
    onApply: (presetId: string) => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

export function QuickPresets({ presets, onApply }: QuickPresetsProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-merkad-purple" />
                <span className="font-medium">Quick Presets</span>
                <span className="text-xs text-merkad-text-muted">— One-click configurations for common projects</span>
            </div>

            <div className="flex flex-wrap gap-3">
                {presets.map((preset) => (
                    <Button
                        key={preset.id}
                        variant="outline"
                        onClick={() => onApply(preset.id)}
                        className="
              border-merkad-border bg-merkad-bg-tertiary 
              hover:border-merkad-purple/50 hover:bg-merkad-purple/10
              text-white h-auto py-3 px-4
              flex flex-col items-start
            "
                    >
                        <span className="font-semibold">{preset.name}</span>
                        <span className="text-xs text-merkad-text-muted mt-0.5">{preset.description}</span>
                        <div className="flex gap-3 mt-2 text-xs">
                            <span className="text-merkad-purple-light font-medium">
                                {formatCurrency(preset.oneTimeTotal)}
                            </span>
                            <span className="text-green-400">
                                +{formatCurrency(preset.monthlyTotal)}/mo
                            </span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}

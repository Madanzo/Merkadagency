import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: 'up' | 'down';
    trendValue?: string;
    className?: string;
}

/**
 * StatCard - Display metrics with optional trend indicator
 */
export function StatCard({ label, value, trend, trendValue, className = '' }: StatCardProps) {
    return (
        <Card className={`bg-merkad-bg-secondary border-merkad-border ${className}`}>
            <CardContent className="p-6">
                <div className="font-mono text-xs text-merkad-text-muted uppercase tracking-wider">
                    {label}
                </div>
                <div className="text-3xl font-mono font-bold text-white mt-2">
                    {value}
                </div>
                {trend && trendValue && (
                    <div className={`flex items-center gap-1 mt-2 text-sm font-mono ${trend === 'up' ? 'text-merkad-green' : 'text-red-500'
                        }`}>
                        {trend === 'up' ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{trendValue}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

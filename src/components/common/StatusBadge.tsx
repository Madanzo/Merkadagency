import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed-won' | 'closed-lost';

interface StatusBadgeProps {
    status: LeadStatus;
    className?: string;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
    new: {
        label: 'New',
        className: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
    },
    contacted: {
        label: 'Contacted',
        className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
    },
    qualified: {
        label: 'Qualified',
        className: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
    },
    'closed-won': {
        label: 'Closed Won',
        className: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
    },
    'closed-lost': {
        label: 'Closed Lost',
        className: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
    },
};

/**
 * StatusBadge - Colored badge for lead status
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status || 'Unknown',
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30',
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-mono text-xs uppercase tracking-wider",
                config.className,
                className
            )}
        >
            {config.label}
        </Badge>
    );
}

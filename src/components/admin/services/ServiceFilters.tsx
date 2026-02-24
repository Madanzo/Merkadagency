import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ServiceCategory, ServiceSubcategory } from '@/lib/services/service.types';

interface ServiceFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    category: ServiceCategory | 'all';
    onCategoryChange: (category: ServiceCategory | 'all') => void;
    subcategory: ServiceSubcategory | 'all';
    onSubcategoryChange: (subcategory: ServiceSubcategory | 'all') => void;
    totalCount: number;
    filteredCount: number;
}

const CATEGORIES: { value: ServiceCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'base', label: 'Base Packages' },
    { value: 'one-time', label: 'One-Time' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'creative', label: 'Creative' },
    { value: 'bundle', label: 'Bundles' },
];

const SUBCATEGORIES: { value: ServiceSubcategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Subcategories' },
    { value: 'AI Features', label: 'AI Features' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Brand & Design', label: 'Brand & Design' },
    { value: 'UI/UX', label: 'UI/UX' },
    { value: 'SEO & Marketing', label: 'SEO & Marketing' },
    { value: 'Content', label: 'Content' },
    { value: 'Funnels', label: 'Funnels' },
    { value: 'Integrations', label: 'Integrations' },
    { value: 'Platform', label: 'Platform' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Training', label: 'Training' },
];

export function ServiceFilters({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    subcategory,
    onSubcategoryChange,
    totalCount,
    filteredCount,
}: ServiceFiltersProps) {
    const showSubcategories = category === 'one-time' || category === 'all';

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-merkad-text-muted" />
                <Input
                    placeholder="Search services, features, or trigger phrases..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-merkad-bg-tertiary border-merkad-border text-white placeholder:text-merkad-text-muted focus:border-merkad-purple"
                />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat.value}
                        variant={category === cat.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onCategoryChange(cat.value)}
                        className={
                            category === cat.value
                                ? 'bg-merkad-purple hover:bg-merkad-purple-hover text-white'
                                : 'border-merkad-border text-merkad-text-secondary hover:text-white hover:border-merkad-purple bg-transparent'
                        }
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>

            {/* Subcategory Filters (only for one-time or all) */}
            {showSubcategories && (
                <div className="flex flex-wrap gap-2">
                    {SUBCATEGORIES.map((sub) => (
                        <Button
                            key={sub.value}
                            variant={subcategory === sub.value ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onSubcategoryChange(sub.value)}
                            className={
                                subcategory === sub.value
                                    ? 'bg-merkad-purple/20 text-merkad-purple-light border border-merkad-purple'
                                    : 'text-merkad-text-muted hover:text-white hover:bg-merkad-bg-tertiary'
                            }
                        >
                            {sub.label}
                        </Button>
                    ))}
                </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-merkad-text-muted">
                Showing {filteredCount} of {totalCount} services
            </div>
        </div>
    );
}

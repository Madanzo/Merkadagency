import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library } from 'lucide-react';
import { ServiceCard, ServiceModal, ServiceFilters } from '@/components/admin/services';
import { SERVICES, searchServices } from '@/lib/services/services.data';
import type { Service, ServiceCategory, ServiceSubcategory } from '@/lib/services/service.types';

export default function ServiceLibrary() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<ServiceCategory | 'all'>('all');
    const [subcategory, setSubcategory] = useState<ServiceSubcategory | 'all'>('all');
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Filter and search services
    const filteredServices = useMemo(() => {
        let results = SERVICES;

        // Apply search
        if (search.trim()) {
            results = searchServices(search);
        }

        // Apply category filter
        if (category !== 'all') {
            results = results.filter((s) => s.category === category);
        }

        // Apply subcategory filter
        if (subcategory !== 'all') {
            results = results.filter((s) => s.subcategory === subcategory);
        }

        return results;
    }, [search, category, subcategory]);

    // Handle add to quote - navigate to calculator with service ID
    const handleAddToQuote = (serviceId: string) => {
        navigate(`/admin/pricing?add=${serviceId}`);
    };

    // Handle selecting a related service from the modal
    const handleSelectRelated = (service: Service) => {
        setSelectedService(service);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-merkad-purple/20">
                    <Library className="w-6 h-6 text-merkad-purple" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Service Library</h1>
                    <p className="text-sm text-merkad-text-muted">
                        Find services, understand what's included, and see when to sell
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-merkad-bg-secondary rounded-xl p-4 border border-merkad-border">
                <ServiceFilters
                    search={search}
                    onSearchChange={setSearch}
                    category={category}
                    onCategoryChange={setCategory}
                    subcategory={subcategory}
                    onSubcategoryChange={setSubcategory}
                    totalCount={SERVICES.length}
                    filteredCount={filteredServices.length}
                />
            </div>

            {/* Service Grid */}
            {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-merkad-text-muted">
                        No services found matching your search.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onViewDetails={() => setSelectedService(service)}
                            onAddToQuote={() => handleAddToQuote(service.id)}
                        />
                    ))}
                </div>
            )}

            {/* Service Detail Modal */}
            {selectedService && (
                <ServiceModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                    onAddToQuote={() => {
                        handleAddToQuote(selectedService.id);
                        setSelectedService(null);
                    }}
                    onSelectRelated={handleSelectRelated}
                />
            )}
        </div>
    );
}

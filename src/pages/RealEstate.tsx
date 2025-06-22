
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useProperties, useFeaturedProperties, PropertyFilters as FiltersType } from '@/hooks/useProperties';
import { Property } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import PropertyMapView from '@/components/PropertyMapView';
import { useNavigate } from 'react-router-dom';

// Import new components
import RealEstateHero from '@/components/real-estate/RealEstateHero';
import PropertySearchBar from '@/components/real-estate/PropertySearchBar';
import PropertyTypeCards from '@/components/real-estate/PropertyTypeCards';
import PopularAreas from '@/components/real-estate/PopularAreas';
import RealEstateAdvancedSearch from '@/components/real-estate/RealEstateAdvancedSearch';

const RealEstate = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersType>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const { data: properties = [], isLoading } = useProperties(filters);
  const { data: featuredProperties = [] } = useFeaturedProperties();

  const handlePropertyInquiry = (property: Property) => {
    setSelectedProperty(property);
    setShowInquiryModal(true);
  };

  const handleViewDetails = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const handleAreaSelect = (area: string) => {
    setFilters({ ...filters, city: area });
  };

  const filteredProperties = properties.filter(property =>
    !searchQuery || 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdvancedFiltersChange = (advancedFilters: any) => {
    setFilters({ ...filters, ...advancedFilters });
    console.log('Applied advanced filters:', advancedFilters);
  };

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <RealEstateHero />

        {/* Advanced Search Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Property Search</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              {showAdvancedSearch ? 'Hide Advanced Search' : 'Advanced Search'}
            </Button>
          </div>
          
          {showAdvancedSearch && (
            <RealEstateAdvancedSearch 
              onFiltersChange={handleAdvancedFiltersChange}
              className="animate-fade-in"
            />
          )}

          <PropertySearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {showFilters && (
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters({})}
            />
          )}
        </section>

        {/* Featured Properties */}
        {featuredProperties.length > 0 && viewMode === 'grid' && (
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={handleViewDetails}
                  onInquire={handlePropertyInquiry}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Properties */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              All Properties {filteredProperties.length > 0 && `(${filteredProperties.length})`}
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Loading properties...</div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600 mb-4">No properties found matching your criteria</div>
              <Button onClick={() => { setFilters({}); setSearchQuery(''); }}>
                Clear Filters
              </Button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="h-[600px] rounded-lg overflow-hidden border">
              <PropertyMapView
                properties={filteredProperties}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={handleViewDetails}
                  onInquire={handlePropertyInquiry}
                />
              ))}
            </div>
          )}
        </section>

        {/* Property Types - Only show in grid mode */}
        {viewMode === 'grid' && <PropertyTypeCards />}

        {/* Popular Areas - Only show in grid mode */}
        {viewMode === 'grid' && <PopularAreas onAreaSelect={handleAreaSelect} />}

        {/* Coming Soon Notice - Only show in grid mode */}
        {viewMode === 'grid' && (
          <section className="text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Full Platform Coming Soon!</h2>
            <p className="text-lg mb-6 opacity-90">
              We're building the most comprehensive real estate platform in Kenya. Get early access!
            </p>
            <Button variant="secondary" size="lg" className="px-8 py-3">
              <Phone className="mr-2 h-5 w-5" />
              Get Early Access
            </Button>
          </section>
        )}

        {/* Property Inquiry Modal */}
        <PropertyInquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          property={selectedProperty}
        />
      </div>
    </MainLayout>
  );
};

export default RealEstate;

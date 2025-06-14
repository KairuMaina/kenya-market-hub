
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Home, MapPin, Phone, Map, Grid3X3 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useProperties, useFeaturedProperties, PropertyFilters as FiltersType } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import PropertyMapView from '@/components/PropertyMapView';
import { Property } from '@/hooks/useProperties';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RealEstate = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersType>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const { data: properties = [], isLoading } = useProperties(filters);
  const { data: featuredProperties = [] } = useFeaturedProperties();

  const propertyTypes = [
    {
      type: 'Apartments',
      icon: Building,
      count: '2,500+',
      priceRange: 'KSh 15K - 80K/month',
      description: 'Modern apartments in prime locations',
    },
    {
      type: 'Houses',
      icon: Home,
      count: '1,200+',
      priceRange: 'KSh 25K - 150K/month',
      description: 'Family homes with gardens and parking',
    },
    {
      type: 'Commercial',
      icon: Building,
      count: '800+',
      priceRange: 'KSh 30K - 200K/month',
      description: 'Office spaces and retail locations',
    },
  ];

  const popularAreas = [
    'Kilimani', 'Karen', 'Westlands', 'Parklands', 'Lavington', 'Kileleshwa'
  ];

  const handlePropertyInquiry = (property: Property) => {
    setSelectedProperty(property);
    setShowInquiryModal(true);
  };

  const handleViewDetails = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const filteredProperties = properties.filter(property =>
    !searchQuery || 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section with Background */}
        <section className="relative text-center py-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Soko Smart Properties
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Find your perfect home or investment property in Kenya's prime locations
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-3">
              <Building className="mr-2 h-5 w-5" />
              Browse Properties
            </Button>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by location or property name..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-l-none border-l"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

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
                onPropertySelect={setSelectedProperty}
                onViewDetails={handleViewDetails}
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
        {viewMode === 'grid' && (
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Property Types</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {propertyTypes.map((type, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
                      <type.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">{type.type}</CardTitle>
                    <CardDescription>{type.count} properties</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <p className="font-bold text-purple-600 mb-4">{type.priceRange}</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                      Browse {type.type}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Popular Areas - Only show in grid mode */}
        {viewMode === 'grid' && (
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Popular Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularAreas.map((area, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="p-4 h-auto"
                  onClick={() => setFilters({ ...filters, city: area })}
                >
                  <div className="text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <span className="font-medium">{area}</span>
                  </div>
                </Button>
              ))}
            </div>
          </section>
        )}

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

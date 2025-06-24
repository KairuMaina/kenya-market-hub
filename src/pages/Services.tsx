
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/shared/HeroSection';
import ServiceCard from '@/components/services/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import BookServiceModal from '@/components/services/BookServiceModal';
import ContactServiceModal from '@/components/services/ContactServiceModal';

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .eq('is_active', true)
        .eq('verification_status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const serviceTypes = ['all', 'service_provider', 'vendor', 'driver', 'property_owner'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.business_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || service.provider_type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleBookService = (service: any) => {
    setSelectedService(service);
    setIsBookModalOpen(true);
  };

  const handleContactService = (service: any) => {
    setSelectedService(service);
    setIsContactModalOpen(true);
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="Professional Services"
          subtitle="Quality services at your fingertips"
          description="Connect with verified service providers across Kenya"
          imageUrl="photo-1560472354-b33ff0c44a43"
          className="mb-8"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-500"
                />
              </div>
              <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Service Type Filter */}
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map(type => (
                <Badge
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  className={`cursor-pointer capitalize ${
                    selectedType === type 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                      : 'border-orange-200 hover:bg-orange-50'
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onContact={handleContactService}
                  onBook={handleBookService}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No services found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Modals */}
        <BookServiceModal
          isOpen={isBookModalOpen}
          onClose={() => {
            setIsBookModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />

        <ContactServiceModal
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />
      </div>
    </FrontendLayout>
  );
};

export default Services;

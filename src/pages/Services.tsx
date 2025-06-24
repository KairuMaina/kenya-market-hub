
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone,
  Wrench,
  Hammer,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceBookingModal from '@/components/services/ServiceBookingModal';
import { BookServiceButton, ContactProviderButton } from '@/components/ui/client-buttons';
import HeroSection from '@/components/shared/HeroSection';

interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string;
  provider_type: string;
  location_address: string;
  phone_number: string;
  email: string;
  verification_status: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon_name?: string;
}

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Fetch service categories
  const { data: categories } = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch service providers
  const { data: providers, isLoading } = useQuery({
    queryKey: ['service-providers'],
    queryFn: async () => {
      const { data: serviceProviders, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .eq('verification_status', 'approved')
        .eq('is_active', true)
        .order('business_name');
      
      if (error) throw error;
      if (!serviceProviders) return [];

      // Get profiles separately
      const userIds = serviceProviders.map(p => p.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      return serviceProviders.map(provider => ({
        ...provider,
        profiles: profiles?.find(p => p.id === provider.user_id) || null
      })) as ServiceProvider[];
    }
  });

  const getIconForCategory = (categoryName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'plumbing': Wrench,
      'electrical': Zap,
      'cleaning': Sparkles,
      'construction': Hammer,
      'security': Shield
    };
    
    // Default to Wrench if no specific icon found
    const lowerCaseName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerCaseName.includes(key)) {
        return icon;
      }
    }
    return Wrench;
  };

  const filteredProviders = providers?.filter(provider => {
    const matchesSearch = provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.business_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.provider_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || provider.provider_type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const handleBookService = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsBookingModalOpen(true);
  };

  const handleContactProvider = (provider: ServiceProvider) => {
    if (provider.phone_number) {
      window.open(`tel:${provider.phone_number}`, '_blank');
    } else if (provider.email) {
      window.open(`mailto:${provider.email}`, '_blank');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Image Backdrop */}
        <HeroSection
          title="Professional Services"
          subtitle="Verified Service Providers"
          description="Find trusted local service providers for all your needs."
          imageUrl="photo-1581244277943-fe4a9c777189"
          className="mb-0 rounded-b-3xl"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for services or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 text-sm border-orange-200 focus:border-orange-500 rounded-xl"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
                className={`rounded-full text-xs ${selectedCategory === null ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}
              >
                All Services
              </Button>
              {categories?.map((category) => {
                const IconComponent = getIconForCategory(category.name);
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.name)}
                    size="sm"
                    className={`rounded-full flex items-center gap-1 text-xs ${
                      selectedCategory === category.name 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                        : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <IconComponent className="h-3 w-3" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Service Providers Grid */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600">Loading service providers...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No service providers found
              </h3>
              <p className="text-sm text-gray-600">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filters' 
                  : 'No verified service providers available yet'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-orange-200 bg-white rounded-2xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={provider.profiles?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm">
                            {provider.business_name?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm text-gray-900">{provider.business_name}</CardTitle>
                          <p className="text-xs text-gray-600">
                            {provider.profiles?.full_name || 'Service Provider'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <CardDescription className="text-gray-700 line-clamp-2 text-xs">
                      {provider.business_description}
                    </CardDescription>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Wrench className="h-3 w-3 text-orange-500" />
                        <span className="capitalize">{provider.provider_type}</span>
                      </div>
                      
                      {provider.location_address && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3 text-orange-500" />
                          <span className="truncate">{provider.location_address}</span>
                        </div>
                      )}

                      {provider.phone_number && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="h-3 w-3 text-orange-500" />
                          <span>{provider.phone_number}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">4.8</span>
                        <span className="text-xs text-gray-500">(24)</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <ContactProviderButton
                          onClick={() => handleContactProvider(provider)}
                          size="sm"
                          className="text-xs px-2 py-1"
                        />
                        <BookServiceButton
                          onClick={() => handleBookService(provider)}
                          size="sm"
                          className="text-xs px-2 py-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Service Booking Modal */}
        {selectedProvider && (
          <ServiceBookingModal
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedProvider(null);
            }}
            provider={selectedProvider}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Services;

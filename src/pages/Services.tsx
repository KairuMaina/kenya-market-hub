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
  Clock, 
  Phone, 
  Mail,
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
  icon_name: string;
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
      return (data || []).map(cat => ({
        ...cat,
        icon_name: cat.icon_name || 'wrench'
      })) as ServiceCategory[];
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

  const getIconForCategory = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      wrench: Wrench,
      hammer: Hammer,
      sparkles: Sparkles,
      zap: Zap,
      shield: Shield
    };
    return iconMap[iconName] || Wrench;
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find trusted local service providers for all your needs. From plumbing to cleaning, 
            book verified professionals with ease.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for services or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All Services
            </Button>
            {categories?.map((category) => {
              const IconComponent = getIconForCategory(category.icon_name);
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="rounded-full flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Service Providers Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service providers...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No service providers found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters' 
                : 'No verified service providers available yet'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={provider.profiles?.avatar_url} />
                        <AvatarFallback>
                          {provider.business_name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{provider.business_name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {provider.profiles?.full_name || 'Service Provider'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-700 line-clamp-3">
                    {provider.business_description}
                  </CardDescription>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wrench className="h-4 w-4" />
                      <span className="capitalize">{provider.provider_type}</span>
                    </div>
                    
                    {provider.location_address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{provider.location_address}</span>
                      </div>
                    )}

                    {provider.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{provider.phone_number}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-sm text-gray-500">(24 reviews)</span>
                    </div>
                    
                    <Button
                      onClick={() => handleBookService(provider)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Book Service
                    </Button>
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
    </MainLayout>
  );
};

export default Services;

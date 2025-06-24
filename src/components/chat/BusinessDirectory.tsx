
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageCircle, Store, MapPin, Phone, Mail, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BusinessContactModal from './BusinessContactModal';

interface ServiceProvider {
  id: string;
  business_name: string;
  business_description: string;
  provider_type: string;
  location_address: string;
  phone_number: string;
  email: string;
  user_id: string;
  verification_status: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  } | null;
}

const BusinessDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; name: string } | null>(null);

  // Fetch approved service providers
  const { data: serviceProviders, isLoading } = useQuery({
    queryKey: ['approved-service-providers'],
    queryFn: async () => {
      const { data: providers, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .eq('verification_status', 'approved')
        .eq('is_active', true)
        .order('business_name');
      
      if (error) throw error;
      if (!providers) return [];

      // Get profiles separately
      const userIds = providers.map(p => p.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      return providers.map(provider => ({
        ...provider,
        profiles: profiles?.find(p => p.id === provider.user_id) || null
      })) as ServiceProvider[];
    }
  });

  const filteredBusinesses = serviceProviders?.filter(provider =>
    provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.business_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.provider_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="h-full">
        <Card className="h-full">
          <CardContent className="p-8 flex items-center justify-center h-full">
            <div className="text-center text-gray-500">Loading businesses...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Business Directory
          </CardTitle>
          <p className="text-sm text-gray-600">Connect with verified local service providers</p>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search businesses, services, or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-6">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Store className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium mb-2">
                  {searchTerm ? 'No businesses found' : 'No verified businesses yet'}
                </h3>
                <p className="text-sm">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Service providers will appear here once approved'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBusinesses.map((business) => (
                  <div key={business.id} className="flex items-start gap-4 p-4 border rounded-xl hover:shadow-md transition-all duration-200 hover:border-orange-200">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={business.profiles?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg truncate">{business.business_name}</h4>
                          <p className="text-sm text-gray-600 truncate">
                            By {business.profiles?.full_name || 'Service Provider'}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => setSelectedBusiness({ 
                            id: business.user_id, 
                            name: business.business_name || 'Business' 
                          })}
                          className="ml-3 bg-orange-500 hover:bg-orange-600 flex-shrink-0"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                      
                      {business.business_description && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {business.business_description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Verified
                        </Badge>
                        {business.provider_type && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {business.provider_type}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        {business.location_address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{business.location_address}</span>
                          </div>
                        )}
                        
                        {business.phone_number && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{business.phone_number}</span>
                          </div>
                        )}
                        
                        {business.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{business.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedBusiness && (
        <BusinessContactModal
          isOpen={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          businessName={selectedBusiness.name}
          businessId={selectedBusiness.id}
        />
      )}
    </div>
  );
};

export default BusinessDirectory;

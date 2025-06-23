
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Star, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useVerifiedServiceProviders } from '@/hooks/useVerifiedServices';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const ServicesMain = () => {
  const { data: serviceProviders, isLoading } = useVerifiedServiceProviders();
  const { toast } = useToast();

  const handleBookService = (provider: any) => {
    toast({
      title: 'Booking Initiated',
      description: `Booking service with ${provider.business_name || 'Service Provider'}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional Services</h1>
        <p className="text-gray-600">Connect with verified service providers across Kenya</p>
      </div>

      {serviceProviders && serviceProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <CardTitle className="text-lg">
                  {provider.business_name || 'Service Provider'}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {provider.business_description || 'Professional service provider'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>New Provider</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  {provider.location_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="line-clamp-1">{provider.location_address}</span>
                    </div>
                  )}
                  
                  {provider.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{provider.phone_number}</span>
                    </div>
                  )}
                  
                  {provider.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="line-clamp-1">{provider.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <Badge variant="outline" className="mb-3">
                    {provider.provider_type || 'General Services'}
                  </Badge>
                  
                  <Button 
                    onClick={() => handleBookService(provider)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Book Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Verified Service Providers Yet
          </h3>
          <p className="text-gray-500">
            Service providers will appear here once they are verified by our team.
          </p>
        </div>
      )}
    </div>
  );
};

const Services = () => {
  return (
    <FrontendLayout>
      <div className="min-h-screen bg-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Wrench className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Professional Services</h1>
              <p className="text-xl text-blue-100 mb-8">
                Find and book trusted service providers for all your needs
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route index element={<ServicesMain />} />
          </Routes>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Services;

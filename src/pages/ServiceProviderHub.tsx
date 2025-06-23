
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  Car, 
  Building, 
  Wrench,
  Stethoscope
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useNavigate } from 'react-router-dom';
import VendorApplicationModal from '@/components/VendorApplicationModal';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { useMedicalApplicationStatus, useMyMedicalProviderProfile } from '@/hooks/useMedical';

const ServiceProviderHub = () => {
  console.log('🏠 ServiceProviderHub component rendering...');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  
  // Check each service provider type
  const { data: vendorProfile } = useMyVendorProfile();
  const { data: driverProfile } = useServiceProviderProfile('driver');
  const { data: propertyOwnerProfile } = useServiceProviderProfile('property_owner');
  const { data: serviceProviderProfile } = useServiceProviderProfile('service_provider');
  const { data: medicalProviderProfile } = useMyMedicalProviderProfile();
  const { data: medicalApplication } = useMedicalApplicationStatus();

  console.log('📊 ServiceProviderHub data:', {
    vendorProfile,
    driverProfile,
    propertyOwnerProfile,
    serviceProviderProfile,
    medicalProviderProfile,
    medicalApplication
  });

  const medicalProfile = medicalProviderProfile
    ? { verification_status: 'approved' }
    : medicalApplication
    ? { verification_status: medicalApplication.status }
    : null;

  const serviceProviderTypes = [
    {
      id: 'vendor',
      title: 'Vendor Portal',
      description: 'Sell products online and manage your e-commerce business',
      icon: Store,
      color: 'from-orange-500 to-orange-600',
      dashboardUrl: '/vendor',
      profile: vendorProfile
    },
    {
      id: 'driver',
      title: 'Driver Portal',
      description: 'Provide transportation services and earn money driving',
      icon: Car,
      color: 'from-orange-500 to-orange-600',
      dashboardUrl: '/driver',
      profile: driverProfile
    },
    {
      id: 'property_owner',
      title: 'Property Owner Portal',
      description: 'List and manage your real estate properties',
      icon: Building,
      color: 'from-orange-500 to-orange-600',
      dashboardUrl: '/property-owner',
      profile: propertyOwnerProfile
    },
    {
      id: 'service_provider',
      title: 'Services Portal',
      description: 'Offer professional services and manage bookings',
      icon: Wrench,
      color: 'from-orange-500 to-orange-600',
      dashboardUrl: '/services-app',
      profile: serviceProviderProfile
    },
    {
      id: 'medical_provider',
      title: 'Medical Provider Portal',
      description: 'Offer medical services and connect with patients',
      icon: Stethoscope,
      color: 'from-orange-500 to-orange-600',
      dashboardUrl: '/medical-provider-dashboard',
      profile: medicalProfile,
    }
  ];

  const handleApply = (providerType: string) => {
    if (providerType === 'vendor') {
      setIsVendorModalOpen(true);
    } else {
      navigate(`/service-provider-registration?type=${providerType}`);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Service Provider Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of service providers across Kenya. Choose your service type below to get started 
              or access your existing dashboard.
            </p>
          </div>

          {/* Service Provider Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceProviderTypes.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                {...provider}
                onApply={handleApply}
              />
            ))}
          </div>

          {/* Help Section */}
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-orange-900 mb-3">
                Need Help Getting Started?
              </h3>
              <p className="text-orange-700 mb-6 max-w-2xl mx-auto">
                Our support team is here to help you through the application process and answer any questions you may have.
              </p>
              <Button 
                variant="outline" 
                size="lg"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <VendorApplicationModal 
        open={isVendorModalOpen} 
        onOpenChange={setIsVendorModalOpen} 
      />
    </MainLayout>
  );
};

export default ServiceProviderHub;

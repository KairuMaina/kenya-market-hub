import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Car, 
  Building, 
  Wrench,
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight,
  Plus,
  UserPlus,
  Stethoscope
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useNavigate } from 'react-router-dom';
import VendorApplicationModal from '@/components/VendorApplicationModal';

// Import medical hooks with error handling
let useMedicalApplicationStatus: any = () => ({ data: null });
let useMyMedicalProviderProfile: any = () => ({ data: null });

try {
  const medicalHooks = require('@/hooks/useMedical');
  useMedicalApplicationStatus = medicalHooks.useMedicalApplicationStatus;
  useMyMedicalProviderProfile = medicalHooks.useMyMedicalProviderProfile;
} catch (error) {
  console.error('Failed to import medical hooks:', error);
}

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
      color: 'from-blue-500 to-cyan-500',
      dashboardUrl: '/medical-provider-dashboard',
      profile: medicalProfile,
    }
  ];

  const getStatusBadge = (profile: any) => {
    if (!profile) {
      return <Badge variant="outline" className="text-gray-500">Not Applied</Badge>;
    }
    
    switch (profile.verification_status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500">Not Applied</Badge>;
    }
  };

  const canAccessDashboard = (profile: any) => {
    return profile && profile.verification_status === 'approved';
  };

  const handleApply = (providerType: string) => {
    if (providerType === 'vendor') {
      setIsVendorModalOpen(true);
    } else {
      navigate(`/service-provider-registration?type=${providerType}`);
    }
  };

  return (
    <MainLayout>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceProviderTypes.map((provider) => {
            const profile = provider.profile;
            const canAccess = canAccessDashboard(profile);
            
            return (
              <Card key={provider.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${provider.color} text-white`}>
                        <provider.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{provider.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {provider.description}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(profile)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile && profile.verification_status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        Your application is under review. We'll notify you once it's processed.
                      </p>
                    </div>
                  )}
                  
                  {profile && profile.verification_status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        Your application was rejected. Please contact support or apply again.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    {canAccess ? (
                      <Button
                        onClick={() => navigate(provider.dashboardUrl)}
                        className={`flex-1 bg-gradient-to-r ${provider.color} hover:opacity-90`}
                      >
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleApply(provider.id)}
                        variant="outline"
                        className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        {profile ? (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Reapply
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Apply Now
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">
              Need Help Getting Started?
            </h3>
            <p className="text-orange-700 mb-4">
              Our support team is here to help you through the application process.
            </p>
            <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
      <VendorApplicationModal open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen} />
    </MainLayout>
  );
};

export default ServiceProviderHub;

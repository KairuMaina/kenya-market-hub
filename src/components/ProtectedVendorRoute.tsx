
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedVendorRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
}

const ProtectedVendorRoute: React.FC<ProtectedVendorRouteProps> = ({ 
  children, 
  requireApproval = true 
}) => {
  const { user, loading } = useAuth();
  const { data: vendorProfile, isLoading: vendorLoading } = useMyVendorProfile();
  const { data: driverProfile, isLoading: driverLoading } = useServiceProviderProfile('driver');
  const { data: propertyProfile, isLoading: propertyLoading } = useServiceProviderProfile('property_owner');

  if (loading || vendorLoading || driverLoading || propertyLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const hasAnyProfile = vendorProfile || driverProfile || propertyProfile;
  const hasApprovedProfile = vendorProfile?.verification_status === 'approved' ||
                           driverProfile?.verification_status === 'approved' ||
                           propertyProfile?.verification_status === 'approved';

  if (!hasAnyProfile) {
    return <Navigate to="/vendor-dashboard" replace />;
  }

  if (requireApproval && !hasApprovedProfile) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Approval Required
            </h2>
            <p className="text-yellow-700">
              Your service provider profile is pending approval. This feature will be available 
              once your application is reviewed and approved by our team.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedVendorRoute;

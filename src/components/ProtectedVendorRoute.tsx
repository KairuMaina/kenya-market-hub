
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (loading || vendorLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!vendorProfile) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-orange-800 mb-2">
              Vendor Profile Required
            </h2>
            <p className="text-orange-700 mb-4">
              You need to create a vendor profile to access the vendor portal.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/vendor-dashboard')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Create Vendor Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/service-provider-hub')}
              >
                Back to Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireApproval && vendorProfile.verification_status !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Vendor Profile Approval Required
            </h2>
            <p className="text-yellow-700 mb-4">
              Your vendor profile is pending approval. The vendor portal will be available 
              once your application is reviewed and approved by our team.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/vendor-dashboard')}
              >
                View Application Status
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/service-provider-hub')}
              >
                Back to Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedVendorRoute;


import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProtectedPropertyOwnerRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
}

const ProtectedPropertyOwnerRoute: React.FC<ProtectedPropertyOwnerRouteProps> = ({ 
  children, 
  requireApproval = true 
}) => {
  const { user, loading } = useAuth();
  const { data: propertyProfile, isLoading: propertyLoading } = useServiceProviderProfile('property_owner');
  const navigate = useNavigate();

  if (loading || propertyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property management...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!propertyProfile) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Property Owner Profile Required
            </h2>
            <p className="text-green-700 mb-4">
              You need to create a property owner profile to access the property management application.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/vendor-dashboard')}
                className="bg-green-600 hover:bg-green-700"
              >
                Create Property Owner Profile
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

  if (requireApproval && propertyProfile.verification_status !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Property Owner Profile Approval Required
            </h2>
            <p className="text-yellow-700 mb-4">
              Your property owner profile is pending approval. The property management app will be available 
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

export default ProtectedPropertyOwnerRoute;

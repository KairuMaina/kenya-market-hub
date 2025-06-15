
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProtectedDriverRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
}

const ProtectedDriverRoute: React.FC<ProtectedDriverRouteProps> = ({ 
  children, 
  requireApproval = true 
}) => {
  const { user, loading } = useAuth();
  const { data: driverProfile, isLoading: driverLoading } = useServiceProviderProfile('driver');
  const navigate = useNavigate();

  if (loading || driverLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading driver app...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!driverProfile) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Driver Profile Required
            </h2>
            <p className="text-blue-700 mb-4">
              You need to create a driver profile to access the driver application.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/vendor-dashboard')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Driver Profile
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

  if (requireApproval && driverProfile.verification_status !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Driver Profile Approval Required
            </h2>
            <p className="text-yellow-700 mb-4">
              Your driver profile is pending approval. The driver app will be available 
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

export default ProtectedDriverRoute;

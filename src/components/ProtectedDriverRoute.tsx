
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

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
    return <Navigate to="/vendor-dashboard" replace />;
  }

  if (requireApproval && driverProfile.verification_status !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Driver Profile Approval Required
            </h2>
            <p className="text-yellow-700">
              Your driver profile is pending approval. The driver app will be available 
              once your application is reviewed and approved by our team.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedDriverRoute;

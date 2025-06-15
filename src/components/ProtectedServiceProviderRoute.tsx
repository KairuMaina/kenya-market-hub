
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedServiceProviderRouteProps {
  children: React.ReactNode;
}

const ProtectedServiceProviderRoute: React.FC<ProtectedServiceProviderRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading } = useServiceProviderProfile('service_provider');

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile || profile.verification_status !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Service Provider Access Required
            </h2>
            <p className="text-green-700 mb-4">
              You need to apply and be approved as a service provider to access this dashboard.
            </p>
            <Button onClick={() => window.location.href = '/service-provider-hub'}>
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedServiceProviderRoute;

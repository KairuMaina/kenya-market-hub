
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
          <p className="text-gray-600">Loading driver portal...</p>
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
            <div className="flex justify-center mb-4">
              <Car className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Driver Application Required
            </h2>
            <p className="text-blue-700 mb-6">
              To access the Driver Portal, you need to apply as a driver first. 
              Your application will be reviewed by our team before you can start driving.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/vendor-dashboard')}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Car className="h-4 w-4" />
                Apply as Driver
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/service-provider-hub')}
              >
                Back to Service Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireApproval && driverProfile.verification_status !== 'approved') {
    const getStatusInfo = () => {
      switch (driverProfile.verification_status) {
        case 'pending':
          return {
            icon: Clock,
            title: 'Application Under Review',
            message: 'Your driver application is currently being reviewed by our team. We will notify you once the review is complete.',
            color: 'yellow'
          };
        case 'rejected':
          return {
            icon: AlertCircle,
            title: 'Application Needs Attention',
            message: 'Your driver application requires some updates. Please check your application status for details.',
            color: 'red'
          };
        default:
          return {
            icon: Clock,
            title: 'Application Status Unknown',
            message: 'Please check your application status or contact support.',
            color: 'gray'
          };
      }
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    return (
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <Card className={`border-${statusInfo.color}-200 bg-${statusInfo.color}-50`}>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <StatusIcon className={`h-12 w-12 text-${statusInfo.color}-600`} />
            </div>
            <h2 className={`text-xl font-semibold text-${statusInfo.color}-800 mb-2`}>
              {statusInfo.title}
            </h2>
            <p className={`text-${statusInfo.color}-700 mb-6`}>
              {statusInfo.message}
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/vendor-dashboard')}
              >
                Check Application Status
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/service-provider-hub')}
              >
                Back to Service Hub
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

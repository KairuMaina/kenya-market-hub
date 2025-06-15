
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
            <div className="flex justify-center mb-4">
              <Building className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Property Owner Application Required
            </h2>
            <p className="text-green-700 mb-6">
              To access the Property Management Portal, you need to apply as a property owner first. 
              Your application will be reviewed by our team before you can start listing properties.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/vendor-dashboard')}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                Apply as Property Owner
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

  if (requireApproval && propertyProfile.verification_status !== 'approved') {
    const getStatusInfo = () => {
      switch (propertyProfile.verification_status) {
        case 'pending':
          return {
            icon: Clock,
            title: 'Application Under Review',
            message: 'Your property owner application is currently being reviewed by our team. We will notify you once the review is complete.',
            color: 'yellow'
          };
        case 'rejected':
          return {
            icon: AlertCircle,
            title: 'Application Needs Attention',
            message: 'Your property owner application requires some updates. Please check your application status for details.',
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

export default ProtectedPropertyOwnerRoute;

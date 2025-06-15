import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Store, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
            <div className="flex justify-center mb-4">
              <Store className="h-12 w-12 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-orange-800 mb-2">
              Vendor Application Required
            </h2>
            <p className="text-orange-700 mb-6">
              To access the Vendor Portal, you need to apply as a vendor first. 
              Your application will be reviewed by our team before you can start selling.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/service-provider-hub')}
                className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
              >
                <Store className="h-4 w-4" />
                Apply as Vendor
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

  if (requireApproval && vendorProfile.verification_status !== 'approved') {
    const getStatusInfo = () => {
      switch (vendorProfile.verification_status) {
        case 'pending':
          return {
            icon: Clock,
            title: 'Application Under Review',
            message: 'Your vendor application is currently being reviewed by our team. We will notify you once the review is complete.',
            color: 'yellow'
          };
        case 'rejected':
          return {
            icon: AlertCircle,
            title: 'Application Needs Attention',
            message: 'Your vendor application requires some updates. Please check your application status for details.',
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
                onClick={() => navigate('/service-provider-hub')}
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

export default ProtectedVendorRoute;

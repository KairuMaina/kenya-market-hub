
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, ArrowRight, Plus, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceProviderCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  dashboardUrl: string;
  profile: any;
  onApply: (providerType: string) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  color,
  dashboardUrl,
  profile,
  onApply
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (profile: any) => {
    if (!profile) {
      return <Badge variant="outline" className="text-gray-500 border-gray-300">Not Applied</Badge>;
    }
    
    switch (profile.verification_status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Not Applied</Badge>;
    }
  };

  const canAccessDashboard = (profile: any) => {
    return profile && profile.verification_status === 'approved';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${color} text-white shrink-0`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl leading-tight">{title}</CardTitle>
              <CardDescription className="mt-1 text-sm">
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="ml-2 shrink-0">
            {getStatusBadge(profile)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
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

        <div className="pt-2">
          {canAccessDashboard(profile) ? (
            <Button
              onClick={() => navigate(dashboardUrl)}
              className={`w-full bg-gradient-to-r ${color} hover:opacity-90 transition-opacity`}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => onApply(id)}
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
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
};

export default ServiceProviderCard;

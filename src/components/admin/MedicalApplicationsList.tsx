
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface MedicalApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  provider_type: string;
  license_number: string;
  documents: any;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  specialization?: {
    name: string;
  };
}

interface MedicalApplicationsListProps {
  applications: MedicalApplication[];
  onApprove: (applicationId: string) => void;
  onReject: (application: MedicalApplication) => void;
  isApproving: boolean;
  isRejecting: boolean;
  isLoading: boolean;
}

const MedicalApplicationsList: React.FC<MedicalApplicationsListProps> = ({
  applications,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Provider Applications</CardTitle>
          <CardDescription>Review and manage pending medical provider applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading applications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Provider Applications</CardTitle>
          <CardDescription>Review and manage pending medical provider applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pending applications found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Provider Applications</CardTitle>
        <CardDescription>Review and manage pending medical provider applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{application.full_name}</h3>
                    <p className="text-sm text-gray-600">{application.email}</p>
                    <p className="text-sm text-gray-600">{application.phone}</p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Provider Type:</span>
                    <p className="capitalize">{application.provider_type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">License Number:</span>
                    <p>{application.license_number}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Submitted:</span>
                    <p>{new Date(application.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {application.specialization && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Specialization:</span>
                    <p>{application.specialization.name}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => onApprove(application.id)}
                    disabled={isApproving || isRejecting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {isApproving ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => onReject(application)}
                    disabled={isApproving || isRejecting}
                    variant="destructive"
                    size="sm"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalApplicationsList;

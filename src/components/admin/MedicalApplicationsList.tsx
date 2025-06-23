
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, UserCheck, UserX, Phone, Mail, Calendar } from 'lucide-react';

interface MedicalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  provider_type: string;
  license_number: string;
  submitted_at: string;
}

interface MedicalApplicationsListProps {
  applications: MedicalApplication[];
  onReview: (application: MedicalApplication) => void;
  onApprove: (applicationId: string) => void;
  onReject: (application: MedicalApplication) => void;
  isApproving: boolean;
}

const MedicalApplicationsList: React.FC<MedicalApplicationsListProps> = ({
  applications,
  onReview,
  onApprove,
  onReject,
  isApproving
}) => {
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>Review and approve medical provider applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No pending applications found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Applications</CardTitle>
        <CardDescription>Review and approve medical provider applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-lg">{application.full_name}</h3>
                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                      {application.provider_type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-orange-500" />
                      <span className="truncate">{application.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-orange-500" />
                      <span>{application.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>{new Date(application.submitted_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">License:</span> {application.license_number}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onReview(application)}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onApprove(application.id)}
                    disabled={isApproving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => onReject(application)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Reject
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

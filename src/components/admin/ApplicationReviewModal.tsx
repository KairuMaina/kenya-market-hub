
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, UserX, X } from 'lucide-react';

interface MedicalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  provider_type: string;
  license_number: string;
}

interface ApplicationReviewModalProps {
  application: MedicalApplication | null;
  onClose: () => void;
  onApprove: (applicationId: string) => void;
  onReject: (applicationId: string, notes: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  application,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting
}) => {
  const [rejectionNotes, setRejectionNotes] = useState('');

  if (!application) return null;

  const handleReject = () => {
    onReject(application.id, rejectionNotes);
    setRejectionNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Review Application: {application.full_name}</CardTitle>
            <CardDescription>Medical Provider Application Details</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{application.full_name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Provider Type</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded capitalize">{application.provider_type}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{application.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{application.phone}</p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">License Number</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{application.license_number}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rejection Notes (if rejecting)</label>
            <Textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
              className="bg-red-600 hover:bg-red-700"
            >
              <UserX className="h-4 w-4 mr-2" />
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </Button>
            <Button 
              onClick={() => onApprove(application.id)}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationReviewModal;

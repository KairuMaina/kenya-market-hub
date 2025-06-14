
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, MapPin, FileText, Building, User } from 'lucide-react';

interface VendorApplicationModalProps {
  application: any;
  isOpen: boolean;
  onClose: () => void;
}

const VendorApplicationModal = ({ application, isOpen, onClose }: VendorApplicationModalProps) => {
  if (!application) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Vendor Application Details
          </DialogTitle>
          <DialogDescription>
            Review the vendor application for {application.business_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{application.business_name}</h3>
            <Badge variant={getStatusBadgeVariant(application.status)}>
              {application.status}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{application.business_email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm">{application.business_phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Submitted:</span>
                <span className="text-sm">{new Date(application.submitted_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {application.business_license && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">License:</span>
                  <span className="text-sm">{application.business_license}</span>
                </div>
              )}
              
              {application.tax_id && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Tax ID:</span>
                  <span className="text-sm">{application.tax_id}</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <span className="text-sm font-medium">Address:</span>
                <p className="text-sm text-gray-600">{application.business_address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <span className="text-sm font-medium">Description:</span>
                <p className="text-sm text-gray-600">{application.business_description}</p>
              </div>
            </div>
          </div>
          
          {application.admin_notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <span className="text-sm font-medium text-red-600">Admin Notes:</span>
                <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-md">
                  {application.admin_notes}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorApplicationModal;

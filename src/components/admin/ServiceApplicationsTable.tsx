
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye, Building, Mail, Phone, FileText } from 'lucide-react';

interface ServiceApplicationsTableProps {
  applications: any[];
  profiles: any[];
  getStatusBadgeVariant: (status: string) => string;
  getProviderOwner: (userId: string) => string;
  onApprove: (application: any) => void;
  onReject: (application: any) => void;
  onView: (application: any) => void;
  loading?: boolean;
}

const ServiceApplicationsTable: React.FC<ServiceApplicationsTableProps> = ({
  applications,
  profiles,
  getStatusBadgeVariant,
  getProviderOwner,
  onApprove,
  onReject,
  onView,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-sm sm:text-base">Loading service applications...</span>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-8">
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No service applications found</p>
        <p className="text-sm text-gray-400 mt-1">Service Hub applications will appear here for approval</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Applicant</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Business Details</TableHead>
            <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Service Type</TableHead>
            <TableHead className="text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application: any) => (
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell className="text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="font-medium">{getProviderOwner(application.user_id)}</div>
                  <div className="text-xs text-gray-500">ID: {application.id.slice(-8)}</div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    {application.business_name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 max-w-32 truncate">
                    {application.business_description ||application.service_type || "No description"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Mail className="h-3 w-3 text-gray-400" />
                    {application.business_email || "N/A"}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="h-3 w-3 text-gray-400" />
                    {application.business_phone || "N/A"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                <Badge variant="outline" className="text-xs">
                  {application.service_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(application.status) as any}
                  className="text-xs"
                >
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  {application.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1"
                        onClick={() => onApprove(application)}
                        title="Approve Service Application"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                        onClick={() => onReject(application)}
                        title="Reject Service Application"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                    onClick={() => onView(application)}
                    title="View Application Details"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceApplicationsTable;

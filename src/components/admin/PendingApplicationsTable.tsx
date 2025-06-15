import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";

interface PendingApplicationsTableProps {
  pendingApplications: any[];
  profiles: any[];
  getStatusBadgeVariant: (status: string) => string;
  getProviderOwner: (userId: string) => string;
  onApprove: (application: any) => void;
  onReject: (application: any) => void;
  onView: (application: any) => void;
  loading?: boolean;
}

const PendingApplicationsTable: React.FC<PendingApplicationsTableProps> = ({
  pendingApplications,
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
        <span className="ml-2 text-sm sm:text-base">Loading applications...</span>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto table-responsive">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Applicant</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Business</TableHead>
            <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Type</TableHead>
            <TableHead className="text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingApplications?.map((application: any) => (
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell className="text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="font-medium">{getProviderOwner(application.user_id)}</div>
                  <div className="text-xs text-gray-500">ID: {application.id.slice(-8)}</div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                <div className="space-y-1">
                  <div className="font-medium">{application.business_name || "N/A"}</div>
                  <div className="text-xs text-gray-500 max-w-32 truncate">
                    {application.business_description || "No description"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                <div className="space-y-1">
                  <div>{application.business_email || "N/A"}</div>
                  <div className="text-gray-500">{application.business_phone || "N/A"}</div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                <Badge variant="outline" className="text-xs">
                  {application.service_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    getStatusBadgeVariant(application.status) as
                      | "default"
                      | "secondary"
                      | "destructive"
                      | "outline"
                  }
                  className="text-xs"
                >
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  {application.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1"
                        onClick={() => onApprove(application)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                        onClick={() => onReject(application)}
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

export default PendingApplicationsTable;

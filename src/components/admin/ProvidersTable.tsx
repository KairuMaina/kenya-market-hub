import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";

interface ProvidersTableProps {
  providers: any[];
  profiles: any[];
  getStatusBadgeVariant: (status: string) => string;
  getProviderOwner: (userId: string) => string;
  onApprove: (provider: any) => void;
  onReject: (provider: any) => void;
  onView: (provider: any) => void;
  approveLoading?: boolean;
  rejectLoading?: boolean;
  loading?: boolean;
}

const ProvidersTable: React.FC<ProvidersTableProps> = ({
  providers,
  profiles,
  getStatusBadgeVariant,
  getProviderOwner,
  onApprove,
  onReject,
  onView,
  approveLoading,
  rejectLoading,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-sm sm:text-base">Loading providers...</span>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto table-responsive">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">Provider</TableHead>
            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Business</TableHead>
            <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Type</TableHead>
            <TableHead className="text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-xs sm:text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers?.map((provider: any) => (
            <TableRow key={provider.id} className="hover:bg-gray-50">
              <TableCell className="text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="font-medium">{getProviderOwner(provider.user_id)}</div>
                  <div className="text-xs text-gray-500">ID: {provider.id.slice(-8)}</div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                <div className="space-y-1">
                  <div className="font-medium">{provider.business_name || "N/A"}</div>
                  <div className="text-xs text-gray-500 max-w-32 truncate">{provider.business_description || "No description"}</div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                <div className="space-y-1">
                  <div>{provider.email || "N/A"}</div>
                  <div className="text-gray-500">{provider.phone_number || "N/A"}</div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                <Badge variant="outline" className="text-xs">
                  {provider.provider_type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {provider.is_active ? (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Inactive</Badge>
                  )}
                  <Badge
                    variant={
                      getStatusBadgeVariant(provider.verification_status) as
                        | "default"
                        | "secondary"
                        | "destructive"
                        | "outline"
                    }
                    className="text-xs"
                  >
                    {provider.verification_status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  {provider.verification_status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1"
                        onClick={() => onApprove(provider)}
                        disabled={approveLoading}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                        onClick={() => onReject(provider)}
                        disabled={rejectLoading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                    onClick={() => onView(provider)}
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

export default ProvidersTable;

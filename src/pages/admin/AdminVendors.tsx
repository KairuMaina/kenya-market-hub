
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminVendors, useApproveVendorApplication, useRejectVendorApplication, useUpdateVendorStatus } from '@/hooks/useAdminVendors';
import { Check, X, Search } from 'lucide-react';

const AdminVendors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: vendorsData, isLoading, error } = useAdminVendors();
  const approveVendorApplication = useApproveVendorApplication();
  const rejectVendorApplication = useRejectVendorApplication();
  const updateVendorStatus = useUpdateVendorStatus();

  const handleApprove = async (vendorId: string) => {
    try {
      await approveVendorApplication.mutateAsync(vendorId);
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  const handleReject = async (vendorId: string) => {
    try {
      await rejectVendorApplication.mutateAsync(vendorId);
    } catch (error) {
      console.error('Error rejecting vendor:', error);
    }
  };

  const filteredVendors = vendorsData?.vendors?.filter(vendor =>
    vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.business_email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded">
        Error loading vendors: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <p className="text-gray-600">Manage vendor applications and status</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vendors ({vendorsData?.total || 0})</CardTitle>
              <CardDescription>
                View and manage all vendor profiles and applications
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.length > 0 ? filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.business_name}</TableCell>
                    <TableCell>{vendor.business_email || 'N/A'}</TableCell>
                    <TableCell>{vendor.business_phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vendor.verification_status)}>
                        {vendor.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(vendor.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {vendor.verification_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(vendor.id)}
                              disabled={approveVendorApplication.isPending}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(vendor.id)}
                              disabled={rejectVendorApplication.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {vendor.verification_status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateVendorStatus.mutate({ vendorId: vendor.id, status: 'suspended' })}
                            disabled={updateVendorStatus.isPending}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            Suspend
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                      No vendors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {vendorsData && vendorsData.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * 10 + 1, vendorsData.total)} to{' '}
                {Math.min(currentPage * 10, vendorsData.total)} of {vendorsData.total} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {vendorsData.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === vendorsData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVendors;

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminVendors, useUpdateVendorStatus } from '@/hooks/useAdminVendors';
import { useVendorApproval } from '@/hooks/useApprovalActions/useVendorApproval';
import { Check, X, Search, Store, Users, Clock, CheckCircle } from 'lucide-react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

const AdminVendors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: vendorsData, isLoading, error } = useAdminVendors();
  const { approveApplication, rejectApplication } = useVendorApproval();
  const updateVendorStatus = useUpdateVendorStatus();

  const handleApprove = async (vendorId: string) => {
    try {
      await updateVendorStatus.mutateAsync({ vendorId, status: 'approved' });
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  const handleReject = async (vendorId: string) => {
    try {
      await updateVendorStatus.mutateAsync({ vendorId, status: 'rejected' });
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

  // Statistics for dashboard cards
  const stats = {
    total: vendorsData?.total || 0,
    approved: filteredVendors.filter(v => v.verification_status === 'approved').length,
    pending: filteredVendors.filter(v => v.verification_status === 'pending').length,
    rejected: filteredVendors.filter(v => v.verification_status === 'rejected').length
  };

  if (isLoading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading vendors...</p>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  if (error) {
    return (
      <ModernAdminLayout>
        <div className="text-red-500 bg-red-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Error Loading Vendors</h3>
          <p>{error.message}</p>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8" />
            Vendor Management
          </h1>
          <p className="text-orange-100 mt-2">Manage vendor applications and business partnerships</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All registered vendors</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Active vendors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Declined applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Vendors Table */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Vendors ({vendorsData?.total || 0})</CardTitle>
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
                    className="pl-9 w-64 bg-white border-gray-200 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableHead className="font-semibold">Business Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.length > 0 ? filteredVendors.map((vendor, index) => (
                    <TableRow 
                      key={vendor.id} 
                      className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
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
                                disabled={updateVendorStatus.isPending}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(vendor.id)}
                                disabled={updateVendorStatus.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
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
                              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 transition-all duration-200"
                            >
                              Suspend
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        {searchTerm ? 'No vendors found matching your search.' : 'No vendors found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {vendorsData && vendorsData.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
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
                    className="hover:bg-orange-50"
                  >
                    Previous
                  </Button>
                  <span className="text-sm px-3 py-1 bg-orange-100 rounded">
                    Page {currentPage} of {vendorsData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === vendorsData.totalPages}
                    className="hover:bg-orange-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminVendors;

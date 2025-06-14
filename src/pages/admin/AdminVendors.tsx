
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Store, Users, CheckCircle, Clock, Eye, Edit, UserCheck, Check, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useApprovalActions } from '@/hooks/useApprovalActions';

const AdminVendors = () => {
  const { approveVendor, rejectVendor } = useApprovalActions();

  // Fetch vendors
  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch profiles separately
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Profiles fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  // Fetch vendor applications
  const { data: vendorApplications } = useQuery({
    queryKey: ['admin-vendor-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) {
        console.error('Vendor applications fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'verified':
        return 'default';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getVendorOwner = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  const handleApprove = (vendorId: string) => {
    approveVendor.mutate({ vendorId });
  };

  const handleReject = (vendorId: string) => {
    rejectVendor.mutate({ vendorId });
  };

  // Calculate statistics
  const totalVendors = vendors?.length || 0;
  const activeVendors = vendors?.filter(vendor => vendor.is_active).length || 0;
  const verifiedVendors = vendors?.filter(vendor => vendor.verification_status === 'approved').length || 0;
  const pendingApplications = vendorApplications?.filter(app => app.status === 'pending').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6 sm:h-8 sm:w-8" />
              Vendor Management
            </h1>
            <p className="text-purple-100 mt-2 text-sm sm:text-base">Manage marketplace vendors and their businesses</p>
          </div>

          {/* Vendor Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Vendors</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{activeVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{verifiedVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{pendingApplications}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Vendors</CardTitle>
              <CardDescription className="text-sm">View and manage vendor accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {vendorsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading vendors...</span>
                </div>
              ) : (
                <div className="overflow-x-auto table-responsive">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Business</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Owner</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Commission</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors?.map((vendor) => (
                        <TableRow key={vendor.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">{vendor.business_name}</div>
                              <div className="text-xs text-gray-500 max-w-32 sm:max-w-48 truncate">
                                {vendor.business_description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            {getVendorOwner(vendor.user_id)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="space-y-1">
                              <div>{vendor.business_email}</div>
                              <div className="text-gray-500">{vendor.business_phone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {vendor.commission_rate}%
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {vendor.is_active ? (
                                <Badge variant="default" className="text-xs">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Inactive</Badge>
                              )}
                              <Badge variant={getStatusBadgeVariant(vendor.verification_status)} className="text-xs">
                                {vendor.verification_status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              {vendor.verification_status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1"
                                    onClick={() => handleApprove(vendor.id)}
                                    disabled={approveVendor.isPending}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                                    onClick={() => handleReject(vendor.id)}
                                    disabled={rejectVendor.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="secondary" size="sm" className="text-xs px-2 py-1">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminVendors;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Store, Users, CheckCircle, Clock, Eye, Edit, UserCheck } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminVendors = () => {
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

  // Calculate statistics
  const totalVendors = vendors?.length || 0;
  const activeVendors = vendors?.filter(vendor => vendor.is_active).length || 0;
  const verifiedVendors = vendors?.filter(vendor => vendor.verification_status === 'approved').length || 0;
  const pendingApplications = vendorApplications?.filter(app => app.status === 'pending').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Store className="h-8 w-8" />
              Vendor Management
            </h1>
            <p className="text-purple-100 mt-2">Manage marketplace vendors and their businesses</p>
          </div>

          {/* Vendor Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedVendors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingApplications}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Vendors</CardTitle>
              <CardDescription>View and manage vendor accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {vendorsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2">Loading vendors...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors?.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{vendor.business_name}</div>
                              <div className="text-sm text-gray-500 max-w-48 truncate">
                                {vendor.business_description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getVendorOwner(vendor.user_id)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{vendor.business_email}</div>
                              <div className="text-sm text-gray-500">{vendor.business_phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{vendor.commission_rate}%</TableCell>
                          <TableCell>
                            {vendor.is_active ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(vendor.verification_status)}>
                              {vendor.verification_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(vendor.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
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

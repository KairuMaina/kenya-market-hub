
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Eye, Edit, Plus, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminServiceProviders = () => {
  const { toast } = useToast();

  // Fetch service providers without joins initially
  const { data: serviceProviders, isLoading: providersLoading } = useQuery({
    queryKey: ['admin-service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Service providers fetch error:', error);
        throw error;
      }
      return data || [];
    }
  });

  // Fetch profiles separately to get user information
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles'],
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

  const getVerificationBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
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

  const getUserInfo = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-8 w-8" />
              Service Provider Management
            </h1>
            <p className="text-purple-100 mt-2">Manage service providers and their applications</p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Service Providers</CardTitle>
                  <CardDescription>View and manage all service provider profiles</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {providersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2">Loading service providers...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableHead className="font-semibold">Provider</TableHead>
                        <TableHead className="font-semibold">Business</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Active</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceProviders?.map((provider) => (
                        <TableRow 
                          key={provider.id} 
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                        >
                          <TableCell className="font-medium">{getUserInfo(provider.user_id)}</TableCell>
                          <TableCell>{provider.business_name || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{provider.provider_type}</Badge>
                          </TableCell>
                          <TableCell>{provider.phone_number || provider.email || 'N/A'}</TableCell>
                          <TableCell className="max-w-32 truncate">{provider.location_address || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={getVerificationBadgeVariant(provider.verification_status)}>
                              {provider.verification_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {provider.is_active ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600">
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

export default AdminServiceProviders;

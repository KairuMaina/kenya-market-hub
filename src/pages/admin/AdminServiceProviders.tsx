
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Eye, Edit, Plus, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminServiceProviders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch service providers
  const { data: serviceProviders, isLoading: serviceProvidersLoading } = useQuery({
    queryKey: ['admin-service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Update verification status
  const updateVerificationStatus = useMutation({
    mutationFn: async ({ providerId, status }: { providerId: string; status: string }) => {
      const { error } = await supabase
        .from('service_provider_profiles')
        .update({ verification_status: status })
        .eq('id', providerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      toast({ title: "Service provider status updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating status", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-8 w-8" />
              Service Provider Management
            </h1>
            <p className="text-purple-100 mt-2">Manage service providers and their verification status</p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Service Providers</CardTitle>
                  <CardDescription>View and manage all service provider profiles</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {serviceProvidersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2">Loading service providers...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableHead className="font-semibold">Business Name</TableHead>
                        <TableHead className="font-semibold">Provider</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Phone</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceProviders?.map((provider) => (
                        <TableRow 
                          key={provider.id} 
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <TableCell className="font-medium">{provider.business_name || 'N/A'}</TableCell>
                          <TableCell>
                            {provider.profiles?.full_name || provider.profiles?.email || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-indigo-100">
                              {provider.provider_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{provider.phone_number || 'N/A'}</TableCell>
                          <TableCell className="max-w-32 truncate">{provider.location_address || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(provider.verification_status)}>
                              {provider.verification_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {provider.verification_status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateVerificationStatus.mutate({ 
                                    providerId: provider.id, 
                                    status: 'approved' 
                                  })}
                                  disabled={updateVerificationStatus.isPending}
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateVerificationStatus.mutate({ 
                                    providerId: provider.id, 
                                    status: 'rejected' 
                                  })}
                                  disabled={updateVerificationStatus.isPending}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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

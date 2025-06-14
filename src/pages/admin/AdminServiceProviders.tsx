
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Eye, Edit, Plus, CheckCircle, XCircle, Check, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useApprovalActions } from '@/hooks/useApprovalActions';

const AdminServiceProviders = () => {
  const { toast } = useToast();
  const { approveServiceProvider, rejectServiceProvider } = useApprovalActions();

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

  const handleApprove = (providerId: string) => {
    approveServiceProvider.mutate({ providerId });
  };

  const handleReject = (providerId: string) => {
    rejectServiceProvider.mutate({ providerId });
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
              Service Provider Management
            </h1>
            <p className="text-purple-100 mt-2 text-sm sm:text-base">Manage service providers and their applications</p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Service Providers</CardTitle>
                  <CardDescription className="text-sm">View and manage all service provider profiles</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-xs sm:text-sm">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Add Provider
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {providersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading service providers...</span>
                </div>
              ) : (
                <div className="overflow-x-auto table-responsive">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableHead className="font-semibold text-xs sm:text-sm">Provider</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm hidden sm:table-cell">Business</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm hidden md:table-cell">Type</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm hidden lg:table-cell">Contact</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceProviders?.map((provider) => (
                        <TableRow 
                          key={provider.id} 
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                        >
                          <TableCell className="font-medium text-xs sm:text-sm">
                            {getUserInfo(provider.user_id)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            {provider.business_name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <Badge variant="outline" className="text-xs">{provider.provider_type}</Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {provider.phone_number || provider.email || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={getVerificationBadgeVariant(provider.verification_status)} className="text-xs">
                                {provider.verification_status}
                              </Badge>
                              {provider.is_active ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              {provider.verification_status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1"
                                    onClick={() => handleApprove(provider.id)}
                                    disabled={approveServiceProvider.isPending}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                                    onClick={() => handleReject(provider.id)}
                                    disabled={rejectServiceProvider.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xs px-2 py-1">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="secondary" size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-xs px-2 py-1">
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

export default AdminServiceProviders;

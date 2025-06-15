import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Users, CheckCircle, Clock, Eye, UserCheck, Check, X, MapPin, Star, Building, FileText, Mail, Phone } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useApprovalActions } from '@/hooks/useApprovalActions';
import { useToast } from '@/hooks/use-toast';

const AdminServiceProviders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // service_provider_profiles approval actions
  const { approveServiceProvider, rejectServiceProvider } = useApprovalActions();
  // local states for dialogs
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Pending service provider applications (from vendor_applications, service_type ≠ 'products')
  const { data: pendingApplications, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin-service-provider-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .neq('service_type', 'products')
        .in('status', ['pending', 'rejected']) // only pending or rejected applications
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Approved/live service provider profiles (from service_provider_profiles)
  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['admin-service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // profiles for owner names
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) return [];
      return data || [];
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const getProviderOwner = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  // ----- Approval and rejection for pending applications -----
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [applicationRejectionNotes, setApplicationRejectionNotes] = useState('');

  // Approve: create a row in service_provider_profiles and update application status to "approved"
  const handleApproveApplication = async (application: any) => {
    try {
      const { data: inserted, error: profileError } = await supabase
        .from('service_provider_profiles')
        .insert([{
          user_id: application.user_id,
          provider_type: application.service_type,
          business_name: application.business_name,
          business_description: application.business_description,
          phone_number: application.business_phone,
          email: application.business_email,
          location_address: application.business_address,
          verification_status: 'approved',
          is_active: true
        }]);
      if (profileError) throw profileError;

      // update the vendor_applications row to "approved"
      const { error: applicationError } = await supabase
        .from('vendor_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', application.id);
      if (applicationError) throw applicationError;

      toast({ title: 'Application Approved', description: 'Service provider profile created and application marked approved.' });
      setApplicationModalOpen(false);
      setSelectedApplication(null);
      queryClient.invalidateQueries({ queryKey: ['admin-service-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };
  // Reject: update application row to "rejected" and store notes
  const handleRejectApplication = async (application: any, notes: string) => {
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .update({
          status: 'rejected',
          admin_notes: notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', application.id);
      if (error) throw error;
      toast({ title: 'Application Rejected', description: 'Application was marked as rejected.' });
      setApplicationModalOpen(false);
      setSelectedApplication(null);
      setApplicationRejectionNotes('');
      queryClient.invalidateQueries({ queryKey: ['admin-service-provider-applications'] });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Approval/rejection for live profiles (old handlers)
  const handleApprove = (provider: any) => {
    setSelectedProvider(provider);
    setIsApprovalDialogOpen(true);
  };
  const handleReject = (provider: any) => {
    setSelectedProvider(provider);
    setIsRejectionDialogOpen(true);
  };
  const handleView = (provider: any) => {
    setSelectedProvider(provider);
    setIsViewModalOpen(true);
  };
  const confirmApproval = () => {
    if (selectedProvider) {
      approveServiceProvider.mutate({ providerId: selectedProvider.id });
      setIsApprovalDialogOpen(false);
      setSelectedProvider(null);
    }
  };
  const confirmRejection = () => {
    if (selectedProvider) {
      rejectServiceProvider.mutate({
        providerId: selectedProvider.id,
        notes: rejectionNotes
      });
      setIsRejectionDialogOpen(false);
      setSelectedProvider(null);
      setRejectionNotes('');
    }
  };

  // Calculate statistics
  const totalApplications = pendingApplications?.length || 0;
  const totalProviders = providers?.length || 0;
  const activeProviders = providers?.filter(provider => provider.is_active).length || 0;
  const verifiedProviders = providers?.filter(provider => provider.verification_status === 'approved').length || 0;
  const pendingProviders = providers?.filter(provider => provider.verification_status === 'pending').length || 0;

  // Find only truly pending (not rejected) applications
  const pendingOnlyApplications = pendingApplications?.filter(
    (app: any) => app.status === 'pending'
  ) ?? [];

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
              Service Provider Management
            </h1>
            <p className="text-indigo-100 mt-2 text-sm sm:text-base">Manage service providers, applications, and their approvals</p>
          </div>

          {/* -- NEW: Pending Applications Card/Section (Prominent) -- */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-yellow-300 mb-2">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 mb-2 text-yellow-700">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Service Provider Applications
            </h2>
            {pendingLoading ? (
              <div className="flex items-center gap-2 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                <span className="text-sm">Loading applications...</span>
              </div>
            ) : pendingOnlyApplications.length === 0 ? (
              <div className="text-sm text-gray-600 py-4">
                No pending service provider applications found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Applicant</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Business</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Type</TableHead>
                      <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOnlyApplications.map((application: any) => (
                      <TableRow key={application.id} className="hover:bg-yellow-50">
                        <TableCell className="text-xs sm:text-sm">
                          <div className="font-medium">{getProviderOwner(application.user_id)}</div>
                          <div className="text-xs text-gray-500">ID: {application.id.slice(-8)}</div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div className="font-medium">{application.business_name || 'N/A'}</div>
                          <div className="text-xs text-gray-500 max-w-32 truncate">
                            {application.business_description || 'No description'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <div className="space-y-1">
                            <div>{application.business_email || 'N/A'}</div>
                            <div className="text-gray-500">{application.business_phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {application.service_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1"
                              onClick={() => {
                                setSelectedApplication(application);
                                setApplicationModalOpen(true);
                              }}
                              aria-label="Approve"
                              title="Approve"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                              onClick={() => {
                                setSelectedApplication(application);
                                setApplicationModalOpen(true);
                              }}
                              aria-label="Reject"
                              title="Reject"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs px-2 py-1"
                              onClick={() => {
                                setSelectedApplication(application);
                                setApplicationModalOpen(true);
                              }}
                              aria-label="View"
                              title="View"
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
            )}
          </div>

          {/* Service Provider Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Applications</CardTitle>
                <Building className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalApplications}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Providers</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalProviders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{activeProviders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{verifiedProviders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{pendingProviders}</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Applications Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Pending Service Provider Applications</CardTitle>
              <CardDescription className="text-sm">Review, approve, or reject service provider applications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading applications...</span>
                </div>
              ) : (
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
                              <div className="font-medium">{application.business_name || 'N/A'}</div>
                              <div className="text-xs text-gray-500 max-w-32 truncate">
                                {application.business_description || 'No description'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="space-y-1">
                              <div>{application.business_email || 'N/A'}</div>
                              <div className="text-gray-500">{application.business_phone || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {application.service_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
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
                                    onClick={() => {
                                      setSelectedApplication(application);
                                      setApplicationModalOpen(true);
                                    }}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                                    onClick={() => {
                                      setSelectedApplication(application);
                                      setApplicationModalOpen(true);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2 py-1"
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setApplicationModalOpen(true);
                                }}
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
              )}
            </CardContent>
          </Card>

          {/* Application Modal for Approve/Reject/View */}
          <Dialog open={applicationModalOpen} onOpenChange={setApplicationModalOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Service Provider Application Details
                </DialogTitle>
                <DialogDescription>
                  Review the application for {selectedApplication?.business_name}
                </DialogDescription>
              </DialogHeader>
              {selectedApplication && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedApplication.business_name}</h3>
                    <Badge variant={getStatusBadgeVariant(selectedApplication.status)}>
                      {selectedApplication.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{selectedApplication.business_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm">{selectedApplication.business_phone}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedApplication.business_license && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">License:</span>
                          <span className="text-sm">{selectedApplication.business_license}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium">Address:</span>
                      <p className="text-sm text-gray-600">{selectedApplication.business_address}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm text-gray-600">{selectedApplication.business_description}</p>
                    </div>
                  </div>
                  {selectedApplication.admin_notes && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-red-600">Admin Notes:</span>
                      <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-md">
                        {selectedApplication.admin_notes}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-col sm:flex-row justify-between pt-4">
                    {selectedApplication.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          className="bg-green-500 text-white hover:bg-green-600"
                          onClick={() => handleApproveApplication(selectedApplication)}
                        >
                          Approve
                        </Button>
                        <div className="flex flex-col gap-2">
                          <Textarea
                            placeholder="Enter reason for rejection"
                            value={applicationRejectionNotes}
                            onChange={e => setApplicationRejectionNotes(e.target.value)}
                          />
                          <Button
                            variant="destructive"
                            onClick={() => handleRejectApplication(selectedApplication, applicationRejectionNotes)}
                          >
                            Reject
                          </Button>
                        </div>
                      </>
                    )}
                    <Button variant="outline" onClick={() => setApplicationModalOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Approved/Live Service Providers Table (existing) */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Service Providers</CardTitle>
              <CardDescription className="text-sm">View and manage approved provider accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {providersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading providers...</span>
                </div>
              ) : (
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
                      {providers?.map((provider) => (
                        <TableRow key={provider.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">{getProviderOwner(provider.user_id)}</div>
                              <div className="text-xs text-gray-500">ID: {provider.id.slice(-8)}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="font-medium">{provider.business_name || 'N/A'}</div>
                              <div className="text-xs text-gray-500 max-w-32 truncate">
                                {provider.business_description || 'No description'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="space-y-1">
                              <div>{provider.email || 'N/A'}</div>
                              <div className="text-gray-500">{provider.phone_number || 'N/A'}</div>
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
                              <Badge variant={getStatusBadgeVariant(provider.verification_status)} className="text-xs">
                                {provider.verification_status}
                              </Badge>
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
                                    onClick={() => handleApprove(provider)}
                                    disabled={approveServiceProvider.isPending}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                                    onClick={() => handleReject(provider)}
                                    disabled={rejectServiceProvider.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2 py-1"
                                onClick={() => handleView(provider)}
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
              )}
            </CardContent>
          </Card>

          {/* Approval Dialog for live providers */}
          <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Service Provider</DialogTitle>
                <DialogDescription>
                  Are you sure you want to approve {getProviderOwner(selectedProvider?.user_id)}?
                  This will verify their account and allow them to offer services.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmApproval} disabled={approveServiceProvider.isPending}>
                  {approveServiceProvider.isPending ? 'Approving...' : 'Approve'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Rejection Dialog for live providers */}
          <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Service Provider</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting {getProviderOwner(selectedProvider?.user_id)}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rejection-notes">Rejection Reason</Label>
                  <Textarea
                    id="rejection-notes"
                    placeholder="Enter the reason for rejection..."
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRejection}
                  disabled={rejectServiceProvider.isPending}
                >
                  {rejectServiceProvider.isPending ? 'Rejecting...' : 'Reject'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Provider Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Service Provider Details
                </DialogTitle>
                <DialogDescription>
                  View details for {getProviderOwner(selectedProvider?.user_id)}
                </DialogDescription>
              </DialogHeader>
              {selectedProvider && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Provider:</span>
                        <span className="text-sm">{getProviderOwner(selectedProvider.user_id)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Business:</span>
                        <span className="text-sm">{selectedProvider.business_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Type:</span>
                        <span className="text-sm">{selectedProvider.provider_type}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{selectedProvider.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm">{selectedProvider.phone_number || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm">{selectedProvider.location_address || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  {selectedProvider.business_description && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm text-gray-600">{selectedProvider.business_description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {selectedProvider.verification_status === 'approved' ? 'Approved' :
                          selectedProvider.verification_status === 'pending' ? 'Pending' : 'Rejected'}
                      </div>
                      <div className="text-sm text-gray-500">Verification Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {selectedProvider.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-sm text-gray-500">Account Status</div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminServiceProviders;

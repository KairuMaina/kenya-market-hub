
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  HeartPulse, 
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useAdminMedicalProviders, useMedicalProviderApplications } from '@/hooks/useAdminMedical';
import { useApprovalActions } from '@/hooks/useApprovalActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminMedical = () => {
  const { data: providers, isLoading: providersLoading, error: providersError } = useAdminMedicalProviders();
  const { data: applications, isLoading: applicationsLoading, error: applicationsError } = useMedicalProviderApplications();
  const { approveMedicalProviderApplication, rejectMedicalProviderApplication } = useApprovalActions();

  const handleApproveApplication = async (applicationId: string) => {
    await approveMedicalProviderApplication.mutateAsync({ applicationId });
  };

  const handleRejectApplication = async (applicationId: string) => {
    await rejectMedicalProviderApplication.mutateAsync({ applicationId });
  };

  if (providersError || applicationsError) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">Error loading medical data</p>
              <p className="text-sm text-gray-500">{providersError?.message || applicationsError?.message}</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <HeartPulse className="h-8 w-8" />
              Medical Management
            </h1>
            <p className="text-blue-100 mt-2">Manage medical providers and applications</p>
          </div>

          <Tabs defaultValue="providers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">Medical Providers</TabsTrigger>
              <TabsTrigger value="applications">
                Applications
                {applications && applications.length > 0 && (
                  <Badge className="ml-2 bg-red-500">{applications.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="providers">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Medical Providers</CardTitle>
                  <CardDescription>
                    View and manage all registered medical providers ({providers?.length || 0} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {providersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100">
                          <TableHead>Full Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Registered On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {providers?.map((provider) => (
                          <TableRow key={provider.id} className="hover:bg-blue-50">
                            <TableCell className="font-medium">{provider.full_name}</TableCell>
                            <TableCell>{provider.provider_type}</TableCell>
                            <TableCell>{(provider.specialization as any)?.name || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={provider.is_active ? 'default' : 'secondary'} className={provider.is_active ? 'bg-green-500 text-white' : ''}>
                                {provider.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>{provider.rating}</TableCell>
                            <TableCell>{new Date(provider.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Provider Applications</CardTitle>
                  <CardDescription>
                    Review and manage pending medical provider applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : applications && applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <Card key={app.id} className="border-2 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{app.full_name} ({app.provider_type})</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap">
                                  <span><strong>Email:</strong> {app.email}</span>
                                  <span><strong>Phone:</strong> {app.phone}</span>
                                  <span><strong>License:</strong> {app.license_number}</span>
                                  <span><strong>Specialization:</strong> {(app.specialization as any)?.name || 'N/A'}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Approve Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to approve this application?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleApproveApplication(app.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Approve
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to reject this application?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRejectApplication(app.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Reject
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <HeartPulse className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No pending provider applications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminMedical;

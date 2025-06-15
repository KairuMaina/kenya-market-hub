
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Search, 
  Edit, 
  Trash2, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useAdminVendors, useUpdateVendorStatus } from '@/hooks/useAdminVendors';
import { useVendorApplications, useApproveVendorApplication, useRejectVendorApplication } from '@/hooks/useVendors';
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

const AdminVendors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vendorsData, isLoading: vendorsLoading, error: vendorsError } = useAdminVendors(currentPage, 10, searchTerm);
  const { data: applications, isLoading: applicationsLoading } = useVendorApplications();
  const updateVendorStatus = useUpdateVendorStatus();
  const approveApplication = useApproveVendorApplication();
  const rejectApplication = useRejectVendorApplication();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      await approveApplication.mutateAsync(applicationId);
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await rejectApplication.mutateAsync({ applicationId });
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleStatusChange = async (vendorId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await updateVendorStatus.mutateAsync({ vendorId, status });
    } catch (error) {
      console.error('Error updating vendor status:', error);
    }
  };

  if (vendorsError) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">Error loading vendors data</p>
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
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Store className="h-8 w-8" />
              Vendor Management
            </h1>
            <p className="text-orange-100 mt-2">Manage all platform vendors and applications</p>
          </div>

          <Tabs defaultValue="vendors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vendors">Active Vendors</TabsTrigger>
              <TabsTrigger value="applications">
                Applications
                {applications && applications.length > 0 && (
                  <Badge className="ml-2 bg-red-500">{applications.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vendors">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Vendors</CardTitle>
                      <CardDescription>
                        View and manage all registered vendors ({vendorsData?.total || 0} total)
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search vendors..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Vendor
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {vendorsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100">
                              <TableHead className="font-semibold">Business Name</TableHead>
                              <TableHead className="font-semibold">Email</TableHead>
                              <TableHead className="font-semibold">Status</TableHead>
                              <TableHead className="font-semibold">Products</TableHead>
                              <TableHead className="font-semibold">Revenue</TableHead>
                              <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vendorsData?.vendors?.map((vendor) => (
                              <TableRow 
                                key={vendor.id} 
                                className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200"
                              >
                                <TableCell className="font-medium">{vendor.business_name}</TableCell>
                                <TableCell>{vendor.business_email || 'N/A'}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={vendor.verification_status === 'approved' ? 'default' : 
                                            vendor.verification_status === 'pending' ? 'secondary' : 'destructive'}
                                    className={vendor.verification_status === 'approved' ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}
                                  >
                                    {vendor.verification_status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {vendor.verification_status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                    {vendor.verification_status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                    {vendor.verification_status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-semibold text-orange-600">
                                  {vendor.products_count}
                                </TableCell>
                                <TableCell className="font-semibold text-green-600">
                                  KSh {vendor.total_revenue.toLocaleString()}
                                </TableCell>
                                <TableCell className="space-x-2">
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {vendor.verification_status === 'pending' && (
                                    <>
                                      <Button 
                                        size="sm"
                                        onClick={() => handleStatusChange(vendor.id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleStatusChange(vendor.id, 'rejected')}
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

                      {/* Pagination */}
                      {vendorsData && vendorsData.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, vendorsData.total)} of {vendorsData.total} vendors
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>
                            <span className="text-sm">
                              Page {currentPage} of {vendorsData.totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, vendorsData.totalPages))}
                              disabled={currentPage === vendorsData.totalPages}
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Vendor Applications</CardTitle>
                  <CardDescription>
                    Review and manage pending vendor applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : applications && applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <Card key={app.id} className="border-2 border-orange-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg">{app.business_name}</h3>
                                <p className="text-sm text-gray-600">{app.business_description}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span><strong>Email:</strong> {app.business_email}</span>
                                  <span><strong>Phone:</strong> {app.business_phone}</span>
                                </div>
                                <p className="text-xs text-gray-500">
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
                                      <AlertDialogTitle>Approve Vendor Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to approve this vendor application? This will create a new vendor account.
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
                                      <AlertDialogTitle>Reject Vendor Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to reject this vendor application? This action cannot be undone.
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
                      <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No pending vendor applications</p>
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

export default AdminVendors;

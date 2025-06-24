
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Store } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useVendorApplications, useApproveVendorApplication, useRejectVendorApplication, useReapproveVendorApplication } from '@/hooks/useVendorApplications';
import { ApproveButton, RejectButton, ReapproveButton, ViewButton } from '@/components/ui/action-buttons';
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
import { Textarea } from '@/components/ui/textarea';

const AdminVendorApplications = () => {
  const [rejectionNotes, setRejectionNotes] = useState('');
  const { data: applications = [], isLoading } = useVendorApplications();
  const approveApplication = useApproveVendorApplication();
  const rejectApplication = useRejectVendorApplication();
  const reapproveApplication = useReapproveVendorApplication();

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'suspended':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleApprove = async (applicationId: string) => {
    await approveApplication.mutateAsync(applicationId);
  };

  const handleReject = async (applicationId: string) => {
    await rejectApplication.mutateAsync({ 
      applicationId, 
      notes: rejectionNotes 
    });
    setRejectionNotes('');
  };

  const handleReapprove = async (applicationId: string) => {
    await reapproveApplication.mutateAsync(applicationId);
  };

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;
  const suspendedCount = applications.filter(app => app.status === 'suspended').length;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Store className="h-8 w-8" />
              Vendor Applications
            </h1>
            <p className="text-blue-100 mt-2">Review and manage vendor applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{suspendedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                Review vendor applications and manage their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.business_name}
                          </TableCell>
                          <TableCell>{application.business_email}</TableCell>
                          <TableCell>{application.business_phone}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(application.status) as any}>
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(application.submitted_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="space-x-2">
                            {application.status === 'pending' && (
                              <>
                                <ApproveButton
                                  onClick={() => handleApprove(application.id)}
                                  loading={approveApplication.isPending}
                                />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <RejectButton />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Please provide a reason for rejecting this application.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <Textarea
                                      placeholder="Rejection reason..."
                                      value={rejectionNotes}
                                      onChange={(e) => setRejectionNotes(e.target.value)}
                                    />
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleReject(application.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Reject
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            {(application.status === 'rejected' || application.status === 'suspended') && (
                              <ReapproveButton
                                onClick={() => handleReapprove(application.id)}
                                loading={reapproveApplication.isPending}
                              />
                            )}
                            <ViewButton onClick={() => console.log('View application:', application.id)} />
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

export default AdminVendorApplications;

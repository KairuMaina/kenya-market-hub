
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Search, UserCheck, UserX, Eye, Phone, Mail, Calendar } from 'lucide-react';
import { useMedicalProviderApproval } from '@/hooks/useApprovalActions/useMedicalProviderApproval';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

// Import medical hooks with error handling
let useMedicalApplications: any = () => ({ data: [], isLoading: false });
let useMedicalProviders: any = () => ({ data: [], isLoading: false });

try {
  const medicalHooks = require('@/hooks/useMedical');
  useMedicalApplications = medicalHooks.useMedicalApplications;
  useMedicalProviders = medicalHooks.useMedicalProviders;
} catch (error) {
  console.error('Failed to import medical hooks:', error);
}

const AdminMedical = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const { data: applications = [], isLoading: applicationsLoading } = useMedicalApplications();
  const { data: providers = [], isLoading: providersLoading } = useMedicalProviders();
  const { approveApplication, rejectApplication } = useMedicalProviderApproval();

  const handleApprove = async (applicationId: string) => {
    try {
      await approveApplication.mutateAsync(applicationId);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await rejectApplication.mutateAsync({
        applicationId,
        adminNotes: rejectionNotes
      });
      setSelectedApplication(null);
      setRejectionNotes('');
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const filteredApplications = applications.filter(app =>
    app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.provider_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter(provider =>
    provider.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.provider_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (applicationsLoading || providersLoading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading medical data...</p>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Providers</h1>
            <p className="text-gray-600">Manage medical provider applications and profiles</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Providers</p>
                  <p className="text-2xl font-bold">{providers.filter(p => p.is_verified).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Providers</p>
                  <p className="text-2xl font-bold">{providers.filter(p => p.is_active).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>Review and approve medical provider applications</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{application.full_name}</h3>
                          <Badge variant="secondary">{application.provider_type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {application.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {application.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(application.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">License: {application.license_number}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApprove(application.id)}
                          disabled={approveApplication.isPending}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            setSelectedApplication(application);
                            // Could open rejection modal here
                          }}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verified Providers */}
        <Card>
          <CardHeader>
            <CardTitle>Verified Providers</CardTitle>
            <CardDescription>Currently active medical providers</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProviders.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No verified providers found</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProviders.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{provider.full_name}</h3>
                        <div className="flex gap-1">
                          {provider.is_verified && (
                            <Badge variant="default" className="text-xs">Verified</Badge>
                          )}
                          {provider.is_active && (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{provider.provider_type}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Rating: {provider.rating.toFixed(1)}/5
                        </span>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Review Application: {selectedApplication.full_name}</CardTitle>
                <CardDescription>Medical Provider Application Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-gray-600">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Provider Type</label>
                    <p className="text-sm text-gray-600">{selectedApplication.provider_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-gray-600">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-gray-600">{selectedApplication.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">License Number</label>
                    <p className="text-sm text-gray-600">{selectedApplication.license_number}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Rejection Notes (if rejecting)</label>
                  <Textarea
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="Enter rejection reason..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedApplication(null);
                      setRejectionNotes('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={rejectApplication.isPending}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedApplication.id)}
                    disabled={approveApplication.isPending}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ModernAdminLayout>
  );
};

export default AdminMedical;

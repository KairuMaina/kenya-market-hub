
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Search, UserCheck } from 'lucide-react';
import { useMedicalProviderApproval } from '@/hooks/useApprovalActions/useMedicalProviderApproval';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import MedicalApplicationsList from '@/components/admin/MedicalApplicationsList';
import VerifiedProvidersList from '@/components/admin/VerifiedProvidersList';
import ApplicationReviewModal from '@/components/admin/ApplicationReviewModal';

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

  const handleReject = async (applicationId: string, adminNotes?: string) => {
    try {
      await rejectApplication.mutateAsync({
        applicationId,
        adminNotes: adminNotes || rejectionNotes
      });
      setSelectedApplication(null);
      setRejectionNotes('');
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const filteredApplications = applications.filter((app: any) =>
    app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.provider_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter((provider: any) =>
    provider.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.provider_type?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                className="pl-10 w-full lg:w-64"
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
                  <p className="text-2xl font-bold text-orange-600">{applications.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Providers</p>
                  <p className="text-2xl font-bold text-green-600">{providers.filter((p: any) => p.is_verified).length}</p>
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
                  <p className="text-2xl font-bold text-orange-600">{providers.filter((p: any) => p.is_active).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <MedicalApplicationsList
          applications={filteredApplications}
          onReview={setSelectedApplication}
          onApprove={handleApprove}
          onReject={setSelectedApplication}
          isApproving={approveApplication.isPending}
        />

        {/* Verified Providers */}
        <VerifiedProvidersList providers={filteredProviders} />

        {/* Application Review Modal */}
        <ApplicationReviewModal
          application={selectedApplication}
          onClose={() => {
            setSelectedApplication(null);
            setRejectionNotes('');
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          isApproving={approveApplication.isPending}
          isRejecting={rejectApplication.isPending}
        />
      </div>
    </ModernAdminLayout>
  );
};

export default AdminMedical;

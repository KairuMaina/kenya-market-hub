
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, UserCheck, Clock, Users, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MedicalApplicationsList from '@/components/admin/MedicalApplicationsList';
import VerifiedProvidersList from '@/components/admin/VerifiedProvidersList';

// Import medical hooks with proper ES6 imports
let useMedicalApplications: any = () => ({ data: [], isLoading: false });
let useMedicalProviders: any = () => ({ data: [], isLoading: false });
let useApproveMedicalApplication: any = () => ({ mutate: () => {}, isLoading: false });
let useRejectMedicalApplication: any = () => ({ mutate: () => {}, isLoading: false });

try {
  // Use dynamic imports for better compatibility
  import('@/hooks/useMedical').then((medicalHooks) => {
    useMedicalApplications = medicalHooks.useMedicalApplications;
    useMedicalProviders = medicalHooks.useMedicalProviders;
    useApproveMedicalApplication = medicalHooks.useApproveMedicalApplication;
    useRejectMedicalApplication = medicalHooks.useRejectMedicalApplication;
  }).catch(() => {
    console.log('Medical hooks not available');
  });
} catch (error) {
  console.log('Medical hooks import failed:', error);
}

const AdminMedical = () => {
  const { toast } = useToast();
  
  // Get medical data using hooks with fallbacks
  const { data: applications = [], isLoading: applicationsLoading } = useMedicalApplications();
  const { data: providers = [], isLoading: providersLoading } = useMedicalProviders();
  const { mutate: approveApplication, isLoading: isApproving } = useApproveMedicalApplication();
  const { mutate: rejectApplication, isLoading: isRejecting } = useRejectMedicalApplication();

  // Filter applications and providers
  const pendingApplications = applications.filter((app: any) => app.status === 'pending');
  const verifiedProviders = providers.filter((provider: any) => provider.is_verified && provider.is_active);

  const handleApprove = (applicationId: string) => {
    approveApplication(applicationId, {
      onSuccess: () => {
        toast({
          title: "Application Approved",
          description: "Medical provider has been approved successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Approval Failed",
          description: error.message || "Failed to approve application",
          variant: "destructive"
        });
      }
    });
  };

  const handleReject = (applicationId: string, notes: string) => {
    rejectApplication({ applicationId, notes }, {
      onSuccess: () => {
        toast({
          title: "Application Rejected",
          description: "Medical provider application has been rejected.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Rejection Failed",
          description: error.message || "Failed to reject application",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Medical Providers</h1>
          <p className="text-gray-600 mt-1">Manage medical provider applications and verified professionals</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <Badge variant="outline" className="mt-2 text-orange-600 border-orange-200">
              Awaiting Review
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Verified Providers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedProviders.length}</div>
            <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
              Active & Verified
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <Badge variant="secondary" className="mt-2 bg-orange-50 text-orange-700 border-orange-200">
              All Time
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">All Providers</CardTitle>
            <Stethoscope className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
            <Badge variant="outline" className="mt-2 text-gray-600 border-gray-300">
              Total Registered
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Applications and Providers */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Pending Applications ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Verified Providers ({verifiedProviders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <MedicalApplicationsList
            applications={pendingApplications}
            onApprove={handleApprove}
            onReject={handleReject}
            isApproving={isApproving}
            isRejecting={isRejecting}
            isLoading={applicationsLoading}
          />
        </TabsContent>

        <TabsContent value="providers" className="mt-6">
          <VerifiedProvidersList providers={verifiedProviders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMedical;

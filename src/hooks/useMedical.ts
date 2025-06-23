
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MedicalApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  provider_type: string;
  license_number: string;
  documents: any;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  specialization?: {
    name: string;
  };
}

export interface MedicalProvider {
  id: string;
  user_id: string;
  full_name: string;
  provider_type: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  created_at: string;
  specialization?: {
    name: string;
  };
}

// Mock data for medical applications since the table doesn't exist yet
export const useMedicalApplications = () => {
  return useQuery({
    queryKey: ['medical-applications'],
    queryFn: async () => {
      // Return empty array since table doesn't exist
      return [] as MedicalApplication[];
    },
  });
};

// Mock data for medical providers since the table doesn't exist yet
export const useMedicalProviders = () => {
  return useQuery({
    queryKey: ['medical-providers'],
    queryFn: async () => {
      // Return empty array since table doesn't exist
      return [] as MedicalProvider[];
    },
  });
};

export const useApproveMedicalApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (applicationId: string) => {
      // Mock approval since table doesn't exist
      console.log('Mock approval for application:', applicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      queryClient.invalidateQueries({ queryKey: ['medical-providers'] });
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

export const useRejectMedicalApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes: string }) => {
      // Mock rejection since table doesn't exist
      console.log('Mock rejection for application:', applicationId, 'with notes:', notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      queryClient.invalidateQueries({ queryKey: ['medical-providers'] });
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

export const useMedicalApplicationStatus = () => {
  return useQuery({
    queryKey: ['my-medical-application'],
    queryFn: async () => {
      // Return null since table doesn't exist
      return null;
    },
  });
};

export const useMyMedicalProviderProfile = () => {
  return useQuery({
    queryKey: ['my-medical-provider-profile'],
    queryFn: async () => {
      // Return null since table doesn't exist
      return null;
    },
  });
};

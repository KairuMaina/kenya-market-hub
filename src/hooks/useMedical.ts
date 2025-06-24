
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MedicalProvider {
  id: string;
  full_name: string;
  provider_type: string;
  specialization_id?: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  facility_id?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  specialization?: {
    name: string;
  };
}

export interface MedicalApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  provider_type: string;
  license_number: string;
  specialization_id?: string;
  documents?: any;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  specialization?: {
    name: string;
  };
}

export const useMedicalProviders = () => {
  return useQuery({
    queryKey: ['medical-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_providers')
        .select(`
          *,
          specialization:medical_specializations(name)
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data as MedicalProvider[];
    }
  });
};

export const useMedicalApplications = () => {
  return useQuery({
    queryKey: ['medical-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_provider_applications')
        .select(`
          *,
          specialization:medical_specializations(name)
        `)
        .eq('status', 'pending');

      if (error) throw error;
      return data as MedicalApplication[];
    }
  });
};

export const useSubmitMedicalApplication = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: Omit<MedicalApplication, 'id' | 'submitted_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('medical_provider_applications')
        .insert([{
          ...applicationData,
          status: 'pending',
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      toast({
        title: 'Application submitted',
        description: 'Your medical provider application has been submitted for review.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useMedicalSpecializations = () => {
  return useQuery({
    queryKey: ['medical-specializations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_specializations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });
};

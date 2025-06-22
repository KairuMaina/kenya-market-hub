
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MedicalProvider {
  id: string;
  user_id?: string;
  full_name: string;
  provider_type: string;
  specialization_id?: string;
  facility_id?: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
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
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
}

export const useMedicalProviders = () => {
  return useQuery({
    queryKey: ['medical-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_providers')
        .select('*')
        .eq('is_active', true)
        .order('full_name');
      
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
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as MedicalApplication[];
    }
  });
};

export const useMedicalApplicationStatus = () => {
  return useQuery({
    queryKey: ['my-medical-application'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('medical_provider_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as MedicalApplication | null;
    }
  });
};

export const useMyMedicalProviderProfile = () => {
  return useQuery({
    queryKey: ['my-medical-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('medical_providers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as MedicalProvider | null;
    }
  });
};

export const useMedicalApplicationMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationData: Omit<MedicalApplication, 'id' | 'user_id' | 'status' | 'submitted_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('medical_provider_applications')
        .insert({
          ...applicationData,
          user_id: user.id,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-medical-application'] });
      toast({ title: 'Medical provider application submitted successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

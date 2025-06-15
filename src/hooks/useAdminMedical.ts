
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch all medical providers (approved)
export const useAdminMedicalProviders = () => {
  return useQuery({
    queryKey: ['admin-medical-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_providers')
        .select(`
          id,
          full_name,
          provider_type,
          is_active,
          is_verified,
          rating,
          created_at,
          specialization:medical_specializations(name)
        `);

      if (error) throw error;
      return data;
    },
  });
};

// Fetch all pending medical provider applications
export const useMedicalProviderApplications = () => {
  return useQuery({
    queryKey: ['medical-provider-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_provider_applications')
        .select(`
          id,
          full_name,
          email,
          phone,
          provider_type,
          license_number,
          documents,
          status,
          submitted_at,
          specialization:medical_specializations(name)
        `)
        .eq('status', 'pending');
        
      if (error) throw error;
      return data;
    },
  });
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useMedicalProviders = () => {
  return useQuery({
    queryKey: ['medical-providers'],
    queryFn: async () => {
      // Fetch all providers to debug what is returned from the database
      const { data, error } = await supabase
        .from('medical_providers')
        .select(`
          id,
          full_name,
          provider_type,
          rating,
          is_active,
          is_verified,
          specialization:medical_specializations(name)
        `);

      if (error) {
        console.error('Error fetching medical providers:', error);
        throw error;
      }
      
      console.log('All medical providers fetched from DB:', data);

      if (!data) {
        return [];
      }

      // Filter on the client-side to match the intended logic
      const filteredProviders = data.filter(p => p.is_active && p.is_verified);

      console.log('Providers after filtering for is_active and is_verified:', filteredProviders);

      return filteredProviders;
    },
  });
};

export const useMedicalApplicationStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['medical-provider-application-status', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('medical_provider_applications')
        .select('status, full_name, provider_type, submitted_at, admin_notes')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching medical application status:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });
};

export const useMyMedicalProviderProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-medical-provider-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('medical_providers')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching my medical provider profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });
};

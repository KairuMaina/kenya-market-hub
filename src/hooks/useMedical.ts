
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

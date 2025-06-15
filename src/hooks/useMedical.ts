
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMedicalProviders = () => {
  return useQuery({
    queryKey: ['medical-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_providers')
        .select(`
          id,
          full_name,
          provider_type,
          rating,
          profile_picture_url,
          biography,
          specialization:medical_specializations(name)
        `)
        .eq('is_active', true)
        .eq('is_verified', true);

      if (error) throw error;
      return data;
    },
  });
};

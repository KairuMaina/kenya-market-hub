
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      return data;
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

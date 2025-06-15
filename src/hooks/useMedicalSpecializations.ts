
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type MedicalSpecialization = Database['public']['Tables']['medical_specializations']['Row'];

export const useMedicalSpecializations = () => {
  return useQuery<MedicalSpecialization[]>({
    queryKey: ['medical-specializations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_specializations')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    },
  });
};

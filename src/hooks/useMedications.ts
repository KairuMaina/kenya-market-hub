
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Medication = Database['public']['Tables']['medications']['Row'];

export const useMedications = () => {
  return useQuery<Medication[]>({
    queryKey: ['medications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*');

      if (error) {
        console.error('Error fetching medications:', error);
        throw error;
      }

      return data || [];
    },
  });
};

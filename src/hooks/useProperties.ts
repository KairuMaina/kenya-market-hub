
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  listing_type: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  location?: string;
  address?: string;
  agent_id?: string;
  owner_id?: string;
  images?: any;
  amenities?: any;
  status?: string;
  views?: number;
  created_at?: string;
  updated_at?: string;
}

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Property[];
    }
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Property;
    },
    enabled: !!id
  });
};

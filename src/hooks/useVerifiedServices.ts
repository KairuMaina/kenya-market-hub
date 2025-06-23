
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVerifiedServiceProviders = () => {
  return useQuery({
    queryKey: ['verified-service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_profiles')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .eq('verification_status', 'approved')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    }
  });
};

export const useVerifiedMedicalProviders = () => {
  return useQuery({
    queryKey: ['verified-medical-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_providers')
        .select(`
          *,
          medical_specializations(name, description)
        `)
        .eq('is_verified', true)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    }
  });
};

export const useVerifiedRealEstateAgents = () => {
  return useQuery({
    queryKey: ['verified-real-estate-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('real_estate_agents')
        .select('*')
        .eq('is_verified', true)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    }
  });
};

export const usePropertiesFromVerifiedAgents = () => {
  return useQuery({
    queryKey: ['properties-verified-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          real_estate_agents!properties_agent_id_fkey(
            id,
            agency_name,
            is_verified,
            phone,
            email,
            profile_image_url
          )
        `)
        .eq('real_estate_agents.is_verified', true)
        .eq('status', 'available');

      if (error) throw error;
      return data;
    }
  });
};

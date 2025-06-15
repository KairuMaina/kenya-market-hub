
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ServiceProviderRegistrationData {
  service_type: string;
  business_name: string;
  business_description: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  license_number?: string;
  experience_years?: number;
  service_areas?: string[];
}

export const useServiceProviderRegistration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ServiceProviderRegistrationData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('service_provider_profiles')
        .insert({
          user_id: user.id,
          provider_type: data.service_type,
          business_name: data.business_name,
          business_description: data.business_description,
          location_address: data.business_address,
          phone_number: data.business_phone,
          email: data.business_email,
          documents: {
            license_number: data.license_number,
            experience_years: data.experience_years,
            service_areas: data.service_areas
          }
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      toast({
        title: 'Application Submitted Successfully!',
        description: 'Your service provider application has been submitted for review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
    },
  });
};

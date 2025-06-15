
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
        .from('vendor_applications')
        .insert({
          user_id: user.id,
          service_type: data.service_type,
          business_name: data.business_name,
          business_description: data.business_description,
          business_address: data.business_address,
          business_phone: data.business_phone,
          business_email: data.business_email,
          business_license: data.license_number,
          documents: {
            experience_years: data.experience_years,
            service_areas: data.service_areas
          },
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-vendor-profile'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
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

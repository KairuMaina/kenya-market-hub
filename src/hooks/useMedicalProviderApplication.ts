import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type ProviderType = 'doctor' | 'nurse' | 'pharmacist' | 'lab_technician' | 'ambulance_driver' | 'dentist' | 'physiotherapist';

type NewMedicalApplication = {
  full_name: string;
  email: string;
  phone: string;
  provider_type: ProviderType;
  specialization_id: string;
  license_number: string;
};

export const useMedicalProviderApplication = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationData: NewMedicalApplication) => {
      if (!user) throw new Error('You must be logged in to apply.');

      const { data, error } = await supabase
        .from('medical_provider_applications')
        .insert({
          ...applicationData,
          provider_type: applicationData.provider_type, // Ensure correct type is passed
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Application Submitted',
        description: 'Your application to become a medical provider has been submitted for review.',
      });
      queryClient.invalidateQueries({ queryKey: ['medical-provider-application-status', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['my-medical-provider-profile', user?.id] });

    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

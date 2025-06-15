
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMedicalProviderApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveMedicalProviderApplication = useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      const { data, error } = await supabase.rpc('approve_medical_provider_application', {
        p_application_id: applicationId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-medical-providers'] });
      toast({ title: 'Medical provider application approved successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectMedicalProviderApplication = useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      const { data, error } = await supabase.rpc('reject_medical_provider_application', {
        p_application_id: applicationId,
        p_admin_notes: notes
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-provider-applications'] });
      toast({ title: 'Medical provider application rejected' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error rejecting application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    approveMedicalProviderApplication,
    rejectMedicalProviderApplication
  };
};

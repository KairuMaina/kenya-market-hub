
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMedicalProviderApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveApplication = useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase.rpc('approve_medical_provider_application', {
        p_application_id: applicationId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      queryClient.invalidateQueries({ queryKey: ['medical-providers'] });
      toast({
        title: 'Application Approved',
        description: 'Medical provider application has been approved successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectApplication = useMutation({
    mutationFn: async ({ applicationId, adminNotes }: { applicationId: string; adminNotes?: string }) => {
      const { error } = await supabase.rpc('reject_medical_provider_application', {
        p_application_id: applicationId,
        p_admin_notes: adminNotes || ''
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-applications'] });
      toast({
        title: 'Application Rejected',
        description: 'Medical provider application has been rejected.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    approveApplication,
    rejectApplication
  };
};

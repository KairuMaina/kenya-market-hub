
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
      queryClient.invalidateQueries({ queryKey: ['medical-provider-applications'] });
      queryClient.invalidateQueries({ queryKey: ['medical-providers'] });
      toast({ title: 'Medical provider application approved successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving medical provider application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectApplication = useMutation({
    mutationFn: async ({ applicationId, adminNotes }: { applicationId: string; adminNotes?: string }) => {
      const { error } = await supabase.rpc('reject_medical_provider_application', {
        p_application_id: applicationId,
        p_admin_notes: adminNotes
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-provider-applications'] });
      toast({ title: 'Medical provider application rejected' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error rejecting medical provider application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { approveApplication, rejectApplication };
};

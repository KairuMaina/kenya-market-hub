
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useServiceProviderApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveServiceProvider = useMutation({
    mutationFn: async ({ providerId }: { providerId: string }) => {
      const { error } = await supabase
        .from('service_provider_profiles')
        .update({ 
          verification_status: 'approved',
          is_active: true 
        })
        .eq('id', providerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      toast({ title: 'Service provider approved successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving service provider',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectServiceProvider = useMutation({
    mutationFn: async ({ providerId, notes }: { providerId: string, notes?: string }) => {
      // Notes are captured from UI but not stored as service_provider_profiles has no admin_notes column.
      const { error } = await supabase
        .from('service_provider_profiles')
        .update({ 
          verification_status: 'rejected',
          is_active: false 
        })
        .eq('id', providerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      toast({ title: 'Service provider rejected' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error rejecting service provider',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    approveServiceProvider,
    rejectServiceProvider
  };
};

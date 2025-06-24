
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useServiceProviderApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveServiceProvider = useMutation({
    mutationFn: async ({ providerId }: { providerId: string }) => {
      // Get the provider details first
      const { data: provider, error: fetchError } = await supabase
        .from('service_provider_profiles')
        .select('user_id, provider_type, business_name')
        .eq('id', providerId)
        .single();

      if (fetchError) throw fetchError;

      // Update the provider status
      const { error: updateError } = await supabase
        .from('service_provider_profiles')
        .update({ 
          verification_status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId);

      if (updateError) throw updateError;

      // Create approval notification
      const dashboardUrl = `/services-app`; // Generic service provider dashboard
      await supabase.rpc('create_approval_notification', {
        p_user_id: provider.user_id,
        p_application_type: 'Service Provider',
        p_status: 'approved',
        p_dashboard_url: dashboardUrl
      });

      return provider;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      toast({
        title: 'Provider Approved',
        description: 'Service provider has been approved and notified.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Approval Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectServiceProvider = useMutation({
    mutationFn: async ({ providerId, notes }: { providerId: string; notes: string }) => {
      // Get the provider details first
      const { data: provider, error: fetchError } = await supabase
        .from('service_provider_profiles')
        .select('user_id, provider_type, business_name')
        .eq('id', providerId)
        .single();

      if (fetchError) throw fetchError;

      // Update the provider status
      const { error: updateError } = await supabase
        .from('service_provider_profiles')
        .update({ 
          verification_status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId);

      if (updateError) throw updateError;

      // Create rejection notification
      await supabase.rpc('create_approval_notification', {
        p_user_id: provider.user_id,
        p_application_type: 'Service Provider',
        p_status: 'rejected',
        p_dashboard_url: null
      });

      return provider;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-providers'] });
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      toast({
        title: 'Provider Rejected',
        description: 'Service provider has been rejected and notified.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Rejection Failed',
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

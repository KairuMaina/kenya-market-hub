
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useApprovalActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveVendor = useMutation({
    mutationFn: async ({ vendorId, notes }: { vendorId: string; notes?: string }) => {
      const { error } = await supabase
        .from('vendors')
        .update({ 
          verification_status: 'approved',
          is_active: true 
        })
        .eq('id', vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast({ title: 'Vendor approved successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving vendor',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectVendor = useMutation({
    mutationFn: async ({ vendorId, notes }: { vendorId: string; notes?: string }) => {
      const { error } = await supabase
        .from('vendors')
        .update({ 
          verification_status: 'rejected',
          is_active: false 
        })
        .eq('id', vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast({ title: 'Vendor rejected' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error rejecting vendor',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const approveDriver = useMutation({
    mutationFn: async ({ driverId, notes }: { driverId: string; notes?: string }) => {
      const { error } = await supabase
        .from('drivers')
        .update({ 
          is_verified: true,
          is_active: true 
        })
        .eq('id', driverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast({ title: 'Driver approved successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving driver',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectDriver = useMutation({
    mutationFn: async ({ driverId, notes }: { driverId: string; notes?: string }) => {
      const { error } = await supabase
        .from('drivers')
        .update({ 
          is_verified: false,
          is_active: false 
        })
        .eq('id', driverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast({ title: 'Driver rejected' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error rejecting driver',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const approveServiceProvider = useMutation({
    mutationFn: async ({ providerId, notes }: { providerId: string; notes?: string }) => {
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
    mutationFn: async ({ providerId, notes }: { providerId: string; notes?: string }) => {
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
    approveVendor,
    rejectVendor,
    approveDriver,
    rejectDriver,
    approveServiceProvider,
    rejectServiceProvider
  };
};


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDriverApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveDriver = useMutation({
    mutationFn: async ({ driverId }: { driverId: string }) => {
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
    mutationFn: async ({ driverId }: { driverId: string }) => {
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

  return {
    approveDriver,
    rejectDriver
  };
};

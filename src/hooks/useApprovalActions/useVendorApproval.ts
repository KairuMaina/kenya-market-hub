
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVendorApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveVendorApplication = useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      // First check if user already has a vendor record
      const { data: application } = await supabase
        .from('vendor_applications')
        .select('user_id')
        .eq('id', applicationId)
        .single();

      if (!application) {
        throw new Error('Application not found');
      }

      // Check if vendor already exists for this user
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', application.user_id)
        .single();

      if (existingVendor) {
        // If vendor exists, just update the application status
        const { error } = await supabase
          .from('vendor_applications')
          .update({ 
            status: 'approved',
            reviewed_at: new Date().toISOString(),
            reviewed_by: (await supabase.auth.getUser()).data.user?.id
          })
          .eq('id', applicationId);

        if (error) throw error;
        return { success: true, message: 'Application approved (vendor already exists)' };
      }

      // If no existing vendor, use the RPC function
      const { data, error } = await supabase.rpc('approve_vendor_application', {
        application_id: applicationId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Vendor application approved successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving vendor application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectVendorApplication = useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      const { data, error } = await supabase.rpc('reject_vendor_application', {
        application_id: applicationId,
        rejection_notes: notes
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Vendor application rejected' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error rejecting vendor application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const approveVendor = useMutation({
    mutationFn: async ({ vendorId }: { vendorId: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'], refetchType: 'all' });
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
    mutationFn: async ({ vendorId }: { vendorId: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'], refetchType: 'all' });
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

  return {
    approveVendorApplication,
    rejectVendorApplication,
    approveVendor,
    rejectVendor
  };
};

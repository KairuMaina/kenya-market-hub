
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVendorApproval = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveApplication = useMutation({
    mutationFn: async (applicationId: string) => {
      // First get the application data
      const { data: application, error: fetchError } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Create vendor record manually since we need to handle the new schema
      const { error: insertError } = await supabase
        .from('vendors')
        .insert({
          user_id: application.user_id,
          business_name: application.business_name,
          business_description: application.business_description,
          business_email: application.business_email,
          business_phone: application.business_phone,
          verification_status: 'approved',
          is_active: true
        });
      
      if (insertError) throw insertError;
      
      // Update application status
      const { error: updateError } = await supabase
        .from('vendor_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast({ title: 'Vendor application approved successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving vendor application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const rejectApplication = useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase
        .from('vendor_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
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

  const updateVendorStatus = useMutation({
    mutationFn: async ({ vendorId, status }: { vendorId: string; status: string }) => {
      const { error } = await supabase
        .from('vendors')
        .update({ 
          verification_status: status,
          is_active: status === 'approved'
        })
        .eq('id', vendorId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast({ title: 'Vendor status updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating vendor status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const updateVendor = useMutation({
    mutationFn: async (vendor: any) => {
      const { error } = await supabase
        .from('vendors')
        .update({
          business_name: vendor.business_name,
          business_description: vendor.business_description,
          business_email: vendor.business_email,
          business_phone: vendor.business_phone,
          business_address: vendor.business_address,
          verification_status: vendor.is_active ? 'approved' : 'pending',
          is_active: vendor.is_active
        })
        .eq('id', vendor.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast({ title: 'Vendor updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating vendor',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { approveApplication, rejectApplication, updateVendorStatus, updateVendor };
};

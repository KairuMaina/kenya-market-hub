
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminVendor {
  id: string;
  user_id?: string;
  business_name: string;
  business_description?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  verification_status: string;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
}

export interface AdminVendorsResponse {
  vendors: AdminVendor[];
  total: number;
  totalPages: number;
}

export const useAdminVendors = () => {
  return useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async (): Promise<AdminVendorsResponse> => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const vendorsWithNames = data?.map(vendor => ({
        ...vendor,
        full_name: vendor.business_email || vendor.business_name || 'Unknown',
        status: vendor.verification_status || 'pending'
      })) || [];
      
      return {
        vendors: vendorsWithNames,
        total: vendorsWithNames.length,
        totalPages: Math.ceil(vendorsWithNames.length / 10)
      };
    }
  });
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
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
};

export const useApproveVendorApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (vendorId: string) => {
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
};

export const useRejectVendorApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (vendorId: string) => {
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
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminVendor {
  id: string;
  user_id: string;
  business_name: string;
  business_email: string | null;
  business_phone: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  products_count: number;
  total_revenue: number;
}

export const useAdminVendors = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: ['admin-vendors', page, limit, search],
    queryFn: async () => {
      console.log('🔍 Fetching admin vendors...', { page, limit, search });

      let query = supabase
        .from('vendors')
        .select(`
          id,
          user_id,
          business_name,
          business_email,
          business_phone,
          verification_status,
          is_active,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('business_name', `%${search}%`);
      }

      const { data: vendors, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error('❌ Error fetching vendors:', error);
        throw error;
      }

      // Get products count and revenue for each vendor
      const vendorsWithStats = await Promise.all(
        (vendors || []).map(async (vendor) => {
          const [
            { count: productsCount },
            { data: orderItems }
          ] = await Promise.all([
            supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('vendor_id', vendor.id),
            supabase
              .from('order_items')
              .select('total_price, products!inner(vendor_id)')
              .eq('products.vendor_id', vendor.id)
          ]);

          const totalRevenue = orderItems?.reduce((sum, item) => 
            sum + Number(item.total_price || 0), 0) || 0;

          return {
            ...vendor,
            products_count: productsCount || 0,
            total_revenue: totalRevenue
          };
        })
      );

      console.log('✅ Vendors fetched successfully:', vendorsWithStats.length);

      return {
        vendors: vendorsWithStats,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
  });
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ vendorId, status }: { vendorId: string; status: 'approved' | 'rejected' | 'pending' }) => {
      console.log('🔄 Updating vendor status:', { vendorId, status });

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
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Vendor status updated successfully' });
    },
    onError: (error: any) => {
      console.error('❌ Error updating vendor status:', error);
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
    mutationFn: async (applicationId: string) => {
      console.log('✅ Approving vendor application:', applicationId);

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
      toast({ title: 'Vendor application approved successfully' });
    },
    onError: (error: any) => {
      console.error('❌ Error approving vendor application:', error);
      toast({
        title: 'Error approving application',
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
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      console.log('❌ Rejecting vendor application:', applicationId);

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
      console.error('❌ Error rejecting vendor application:', error);
      toast({
        title: 'Error rejecting application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

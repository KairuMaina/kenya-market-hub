
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get basic counts from various tables
      const [
        { count: totalUsers },
        { count: totalOrders },
        { count: totalProducts },
        { count: totalVendors }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalVendors: totalVendors || 0
      };
    }
  });
};

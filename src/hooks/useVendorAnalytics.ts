
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useVendorAnalytics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vendor-analytics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get products count
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', user.id);

      if (productsError) throw productsError;

      // Mock analytics data since we don't have proper analytics tables
      const totalProducts = products?.length || 0;
      const totalRevenue = totalProducts * 1000; // Mock revenue calculation
      const totalOrders = totalProducts * 5; // Mock orders

      // Calculate average rating from products
      const avgRating = products?.length > 0 
        ? products.reduce((sum, product) => sum + (product.rating || 4.0), 0) / products.length 
        : 0;

      return {
        totalProducts,
        totalRevenue,
        totalOrders,
        averageRating: avgRating,
        recentOrders: [],
        salesData: [],
        topProducts: products?.slice(0, 5) || []
      };
    },
    enabled: !!user,
  });
};


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

      // Calculate average rating from products with default rating
      const avgRating = products?.length > 0 
        ? products.reduce((sum, product) => sum + (4.0), 0) / products.length 
        : 0;

      // Generate mock monthly data
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10,
      }));

      // Generate mock category data
      const categoryData = [
        { name: 'Electronics', value: 30, revenue: 15000 },
        { name: 'Clothing', value: 25, revenue: 12000 },
        { name: 'Home & Garden', value: 20, revenue: 10000 },
        { name: 'Sports', value: 15, revenue: 7500 },
        { name: 'Books', value: 10, revenue: 5000 },
      ];

      // Add mock properties to products
      const enhancedProducts = products?.map(product => ({
        ...product,
        sales: Math.floor(Math.random() * 100) + 10,
        views: Math.floor(Math.random() * 500) + 50,
        revenue: Math.floor(Math.random() * 2000) + 500,
        rating: 4.0 + Math.random(),
      })) || [];

      return {
        totalProducts,
        totalRevenue,
        totalOrders,
        averageRating: avgRating,
        recentOrders: [],
        salesData: [],
        topProducts: enhancedProducts.slice(0, 5),
        monthlyData,
        categoryData
      };
    },
    enabled: !!user,
  });
};

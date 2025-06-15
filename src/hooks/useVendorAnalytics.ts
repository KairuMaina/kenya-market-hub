
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VendorAnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  monthlyData: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
    views: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const useVendorAnalytics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vendor-analytics', user?.id],
    queryFn: async (): Promise<VendorAnalyticsData> => {
      if (!user) throw new Error('User not authenticated');

      // Get vendor profile
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!vendor) throw new Error('Vendor profile not found');

      // Get vendor's products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendor.id);

      // Get orders for vendor's products
      const productIds = products?.map(p => p.id) || [];
      
      let orders: any[] = [];
      let orderItems: any[] = [];
      
      if (productIds.length > 0) {
        const { data: orderItemsData } = await supabase
          .from('order_items')
          .select(`
            *,
            orders!inner(*)
          `)
          .in('product_id', productIds);

        orderItems = orderItemsData || [];
        orders = orderItemsData?.map(item => item.orders).filter(Boolean) || [];
      }

      // Calculate metrics
      const totalRevenue = orderItems.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
      const totalOrders = new Set(orders.map(o => o.id)).size;
      const totalProducts = products?.length || 0;
      
      // Calculate average rating from products
      const ratingsSum = products?.reduce((sum, p) => sum + Number(p.rating || 0), 0) || 0;
      const averageRating = totalProducts > 0 ? ratingsSum / totalProducts : 0;

      // Generate monthly data (last 6 months)
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en', { month: 'short' });
        
        // For now, distribute data across months (in real app, filter by actual dates)
        const monthlyRevenue = Math.floor(totalRevenue / 6);
        const monthlyOrders = Math.floor(totalOrders / 6);
        
        return {
          month: monthName,
          sales: monthlyRevenue,
          orders: monthlyOrders
        };
      }).reverse();

      // Get top products
      const topProducts = products?.slice(0, 4).map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 50) + 10, // Mock sales count
        revenue: Number(product.price) * Math.floor(Math.random() * 50 + 10),
        views: Math.floor(Math.random() * 1000) + 100
      })) || [];

      // Category distribution based on actual products
      const categoryMap = new Map();
      products?.forEach(product => {
        const category = product.category;
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const categoryData = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        name,
        value: Math.round((count / totalProducts) * 100),
        color: colors[index % colors.length]
      }));

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        averageRating: Math.round(averageRating * 10) / 10,
        monthlyData,
        topProducts,
        categoryData
      };
    },
    enabled: !!user,
  });
};

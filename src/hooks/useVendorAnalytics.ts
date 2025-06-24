
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VendorAnalytics {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalOrders: number;
  monthlyData: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  categoryData: Array<{
    category: string;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export const useVendorAnalytics = (vendorId: string) => {
  return useQuery({
    queryKey: ['vendor-analytics', vendorId],
    queryFn: async (): Promise<VendorAnalytics> => {
      // Get vendor's products
      const { data: products } = await supabase
        .from('products')
        .select('id, name, category')
        .eq('vendor_id', vendorId);

      if (!products || products.length === 0) {
        return {
          totalSales: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalOrders: 0,
          monthlyData: [],
          categoryData: [],
          topProducts: []
        };
      }

      const productIds = products.map(p => p.id);

      // Get order items for vendor's products
      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          quantity,
          total_price,
          created_at,
          product_id,
          products!inner(name, category)
        `)
        .in('product_id', productIds);

      const totalSales = orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      const totalRevenue = orderItems?.reduce((sum, item) => sum + Number(item.total_price), 0) || 0;

      // Get orders count
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .in('id', orderItems?.map(item => item.order_id) || []);

      // Generate monthly data for last 6 months
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthItems = orderItems?.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate.getMonth() === date.getMonth() && 
                 itemDate.getFullYear() === date.getFullYear();
        }) || [];

        return {
          month: monthName,
          sales: monthItems.reduce((sum, item) => sum + item.quantity, 0),
          revenue: monthItems.reduce((sum, item) => sum + Number(item.total_price), 0)
        };
      }).reverse();

      // Generate category data
      const categoryMap = new Map();
      orderItems?.forEach(item => {
        const category = item.products?.category || 'Unknown';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { sales: 0, revenue: 0 });
        }
        const cat = categoryMap.get(category);
        cat.sales += item.quantity;
        cat.revenue += Number(item.total_price);
      });

      const categoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        sales: data.sales,
        revenue: data.revenue
      }));

      // Get top products
      const productMap = new Map();
      orderItems?.forEach(item => {
        const productId = item.product_id;
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            id: productId,
            name: item.products?.name || 'Unknown',
            sales: 0,
            revenue: 0
          });
        }
        const product = productMap.get(productId);
        product.sales += item.quantity;
        product.revenue += Number(item.total_price);
      });

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      return {
        totalSales,
        totalRevenue,
        totalProducts: products.length,
        totalOrders: orders?.length || 0,
        monthlyData,
        categoryData,
        topProducts
      };
    },
    enabled: !!vendorId
  });
};

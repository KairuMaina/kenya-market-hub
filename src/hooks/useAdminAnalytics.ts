
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  completedOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
    growth: number;
  }>;
  topCategories: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
}

export const useAdminAnalytics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const now = new Date();
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Get revenue data
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed');

      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // Get user data
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', startDate.toISOString());

      // Get orders data
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at')
        .gte('created_at', startDate.toISOString());

      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const conversionRate = totalUsers > 0 ? (completedOrders / totalUsers) * 100 : 0;

      // Get top products
      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          total_price,
          products!inner(name)
        `)
        .gte('created_at', startDate.toISOString());

      const productSales = orderItems?.reduce((acc, item) => {
        const productId = item.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            id: productId,
            name: item.products?.name || 'Unknown',
            sales: 0,
            revenue: 0
          };
        }
        acc[productId].sales += item.quantity;
        acc[productId].revenue += Number(item.total_price);
        return acc;
      }, {} as Record<string, any>) || {};

      const topProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);

      // Generate sales trend (last 7 days)
      const salesTrend = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const dayTransactions = transactions?.filter(t => 
          new Date(t.created_at) >= dayStart && new Date(t.created_at) < dayEnd
        ) || [];
        
        const dayOrders = orders?.filter(o => 
          new Date(o.created_at) >= dayStart && new Date(o.created_at) < dayEnd
        ) || [];

        return {
          date: date.toISOString().split('T')[0],
          revenue: dayTransactions.reduce((sum, t) => sum + Number(t.amount), 0),
          orders: dayOrders.length
        };
      }).reverse();

      // Mock user growth data (would need historical data in real implementation)
      const userGrowth = [
        { month: 'Jan', users: 1200, growth: 12 },
        { month: 'Feb', users: 1450, growth: 21 },
        { month: 'Mar', users: 1680, growth: 16 },
        { month: 'Apr', users: 1890, growth: 12 },
        { month: 'May', users: 2100, growth: 11 },
        { month: 'Jun', users: 2350, growth: 12 }
      ];

      // Get top categories
      const { data: products } = await supabase
        .from('products')
        .select('category');

      const categorySales = products?.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const totalProducts = products?.length || 1;
      const topCategories = Object.entries(categorySales)
        .map(([category, sales]) => ({
          category,
          sales,
          percentage: (sales / totalProducts) * 100
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      return {
        totalRevenue,
        monthlyRevenue: totalRevenue, // Same as total for this period
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalOrders,
        completedOrders,
        conversionRate,
        averageOrderValue,
        topProducts: topProducts as any,
        salesTrend,
        userGrowth,
        topCategories
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useRealtimeMetrics = () => {
  return useQuery({
    queryKey: ['realtime-metrics'],
    queryFn: async () => {
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const [
        { count: recentOrders },
        { count: activeUsers },
        { data: recentRevenue }
      ] = await Promise.all([
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', hourAgo.toISOString()),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', hourAgo.toISOString()),
        supabase
          .from('transactions')
          .select('amount')
          .gte('created_at', hourAgo.toISOString())
          .eq('status', 'completed')
      ]);

      const hourlyRevenue = recentRevenue?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        recentOrders: recentOrders || 0,
        activeUsers: activeUsers || 0,
        hourlyRevenue,
        timestamp: now.toISOString()
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

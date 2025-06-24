
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalDrivers: number;
  totalProperties: number;
  pendingOrders: number;
  completedOrders: number;
  userGrowthPercentage: number;
  revenueGrowthPercentage: number;
  orderGrowthPercentage: number;
  recentActivity: Array<{
    id: string;
    message: string;
    timestamp: string;
    type: 'user' | 'order' | 'vendor' | 'system';
  }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      try {
        // Get current month stats
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        // Current month date range
        const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString();
        const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59).toISOString();

        // Last month date range
        const lastMonthStart = new Date(lastMonthYear, lastMonth, 1).toISOString();
        const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59).toISOString();

        // Fetch all data in parallel
        const [
          usersResult,
          vendorsResult,
          ordersResult,
          productsResult,
          driversResult,
          propertiesResult,
          currentMonthUsers,
          lastMonthUsers,
          currentMonthOrders,
          lastMonthOrders,
          currentMonthRevenue,
          lastMonthRevenue,
          recentOrdersActivity,
          recentUsersActivity
        ] = await Promise.all([
          // Total counts
          supabase.from('profiles').select('id', { count: 'exact' }),
          supabase.from('vendors').select('id', { count: 'exact' }),
          supabase.from('orders').select('id, total_amount, status'),
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('drivers').select('id', { count: 'exact' }),
          supabase.from('properties').select('id', { count: 'exact' }),

          // Current month counts for growth calculation
          supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .gte('created_at', currentMonthStart)
            .lte('created_at', currentMonthEnd),
          supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .gte('created_at', lastMonthStart)
            .lte('created_at', lastMonthEnd),
          supabase
            .from('orders')
            .select('id', { count: 'exact' })
            .gte('created_at', currentMonthStart)
            .lte('created_at', currentMonthEnd),
          supabase
            .from('orders')
            .select('id', { count: 'exact' })
            .gte('created_at', lastMonthStart)
            .lte('created_at', lastMonthEnd),
          supabase
            .from('orders')
            .select('total_amount')
            .gte('created_at', currentMonthStart)
            .lte('created_at', currentMonthEnd),
          supabase
            .from('orders')
            .select('total_amount')
            .gte('created_at', lastMonthStart)
            .lte('created_at', lastMonthEnd),

          // Recent activity
          supabase
            .from('orders')
            .select('id, created_at, status, total_amount')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('profiles')
            .select('id, created_at, full_name')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        // Calculate totals
        const totalUsers = usersResult.count || 0;
        const totalVendors = vendorsResult.count || 0;
        const totalOrders = ordersResult.data?.length || 0;
        const totalProducts = productsResult.count || 0;
        const totalDrivers = driversResult.count || 0;
        const totalProperties = propertiesResult.count || 0;

        // Calculate revenue
        const totalRevenue = ordersResult.data?.reduce((sum, order) => 
          sum + (parseFloat(order.total_amount?.toString() || '0')), 0) || 0;

        // Calculate order status counts - using the correct data structure
        const pendingOrders = ordersResult.data?.filter(o => o.status === 'pending').length || 0;
        const completedOrders = ordersResult.data?.filter(o => o.status === 'completed').length || 0;

        // Calculate growth percentages
        const currentMonthUserCount = currentMonthUsers.count || 0;
        const lastMonthUserCount = lastMonthUsers.count || 0;
        const userGrowthPercentage = lastMonthUserCount > 0 
          ? ((currentMonthUserCount - lastMonthUserCount) / lastMonthUserCount) * 100 
          : 0;

        const currentMonthOrderCount = currentMonthOrders.count || 0;
        const lastMonthOrderCount = lastMonthOrders.count || 0;
        const orderGrowthPercentage = lastMonthOrderCount > 0
          ? ((currentMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100
          : 0;

        const currentMonthRevenueTotal = currentMonthRevenue.data?.reduce((sum, order) => 
          sum + (parseFloat(order.total_amount?.toString() || '0')), 0) || 0;
        const lastMonthRevenueTotal = lastMonthRevenue.data?.reduce((sum, order) => 
          sum + (parseFloat(order.total_amount?.toString() || '0')), 0) || 0;
        const revenueGrowthPercentage = lastMonthRevenueTotal > 0
          ? ((currentMonthRevenueTotal - lastMonthRevenueTotal) / lastMonthRevenueTotal) * 100
          : 0;

        // Build recent activity
        const recentActivity = [
          ...(recentOrdersActivity.data?.map(order => ({
            id: order.id,
            message: `New order #${order.id.slice(0, 8)} for $${order.total_amount}`,
            timestamp: order.created_at,
            type: 'order' as const
          })) || []),
          ...(recentUsersActivity.data?.map(user => ({
            id: user.id,
            message: `New user registered: ${user.full_name || 'Unknown'}`,
            timestamp: user.created_at,
            type: 'user' as const
          })) || [])
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
         .slice(0, 10);

        return {
          totalUsers,
          totalVendors,
          totalOrders,
          totalRevenue,
          totalProducts,
          totalDrivers,
          totalProperties,
          pendingOrders,
          completedOrders,
          userGrowthPercentage: Math.round(userGrowthPercentage * 100) / 100,
          revenueGrowthPercentage: Math.round(revenueGrowthPercentage * 100) / 100,
          orderGrowthPercentage: Math.round(orderGrowthPercentage * 100) / 100,
          recentActivity
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalDrivers: number;
  totalProducts: number;
  totalOrders: number;
  totalProperties: number;
  totalRides: number;
  totalServiceProviders: number;
  totalRevenue: number;
  pendingVendorApplications: number;
  pendingDriverApprovals: number;
  pendingServiceProviders: number;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('🔍 Fetching admin statistics...');

      // Get all counts in parallel
      const [
        { count: usersCount },
        { count: vendorsCount },
        { count: driversCount },
        { count: productsCount },
        { count: ordersCount },
        { count: propertiesCount },
        { count: ridesCount },
        { count: serviceProvidersCount },
        { data: transactions },
        { data: pendingVendorApps },
        { data: pendingDrivers },
        { data: pendingServiceProviders },
        { data: recentOrders },
        { data: recentUsers },
        { data: recentProducts }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('drivers').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('service_provider_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount').eq('status', 'completed'),
        supabase.from('vendor_applications').select('*').eq('status', 'pending'),
        supabase.from('drivers').select('*').eq('is_verified', false),
        supabase.from('service_provider_profiles').select('*').eq('verification_status', 'pending'),
        supabase.from('orders').select('id, created_at, total_amount').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('id, created_at, full_name, email').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('id, created_at, name').order('created_at', { ascending: false }).limit(5)
      ]);

      // Calculate total revenue
      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0;

      // Build recent activity
      const recentActivity = [];
      
      // Add recent orders
      recentOrders?.forEach(order => {
        recentActivity.push({
          id: order.id,
          type: 'order',
          message: `New order placed - KSh ${Number(order.total_amount).toLocaleString()}`,
          timestamp: order.created_at
        });
      });

      // Add recent users
      recentUsers?.forEach(user => {
        recentActivity.push({
          id: user.id,
          type: 'user',
          message: `New user registered: ${user.full_name || user.email}`,
          timestamp: user.created_at
        });
      });

      // Add recent products
      recentProducts?.forEach(product => {
        recentActivity.push({
          id: product.id,
          type: 'product',
          message: `New product added: ${product.name}`,
          timestamp: product.created_at
        });
      });

      // Sort recent activity by timestamp
      recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      console.log('✅ Admin statistics fetched successfully');

      return {
        totalUsers: usersCount || 0,
        totalVendors: vendorsCount || 0,
        totalDrivers: driversCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalProperties: propertiesCount || 0,
        totalRides: ridesCount || 0,
        totalServiceProviders: serviceProvidersCount || 0,
        totalRevenue,
        pendingVendorApplications: pendingVendorApps?.length || 0,
        pendingDriverApprovals: pendingDrivers?.length || 0,
        pendingServiceProviders: pendingServiceProviders?.length || 0,
        recentActivity: recentActivity.slice(0, 10)
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });
};

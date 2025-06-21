
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        // Get total users count
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total products count
        const { count: totalProducts } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Get total orders count
        const { count: totalOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Get total vendors count
        const { count: totalVendors } = await supabase
          .from('vendors')
          .select('*', { count: 'exact', head: true });

        // Get total properties count
        const { count: totalProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        // Get total rides count
        const { count: totalRides } = await supabase
          .from('rides')
          .select('*', { count: 'exact', head: true });

        // Get total drivers count
        const { count: totalDrivers } = await supabase
          .from('drivers')
          .select('*', { count: 'exact', head: true });

        // Get total service providers count
        const { count: totalServiceProviders } = await supabase
          .from('service_provider_profiles')
          .select('*', { count: 'exact', head: true });

        // Get pending vendor applications count
        const { count: pendingVendorApplications } = await supabase
          .from('vendor_applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Get pending driver approvals count (drivers with pending status)
        const { count: pendingDriverApprovals } = await supabase
          .from('drivers')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', false);

        // Get pending service provider applications count
        const { count: pendingServiceProviders } = await supabase
          .from('service_provider_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('verification_status', 'pending');

        // Calculate total revenue from completed orders
        const { data: orderData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'completed');

        const totalRevenue = orderData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        // Get recent activity (simplified - just recent orders for now)
        const { data: recentActivity } = await supabase
          .from('orders')
          .select('id, created_at, total_amount, status')
          .order('created_at', { ascending: false })
          .limit(10);

        const formattedActivity = recentActivity?.map(order => ({
          id: order.id,
          message: `New order of KSh ${order.total_amount} - ${order.status}`,
          timestamp: order.created_at
        })) || [];

        return {
          totalUsers: totalUsers || 0,
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalVendors: totalVendors || 0,
          totalProperties: totalProperties || 0,
          totalRides: totalRides || 0,
          totalDrivers: totalDrivers || 0,
          totalServiceProviders: totalServiceProviders || 0,
          pendingVendorApplications: pendingVendorApplications || 0,
          pendingDriverApprovals: pendingDriverApprovals || 0,
          pendingServiceProviders: pendingServiceProviders || 0,
          totalRevenue,
          recentActivity: formattedActivity
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Return default values in case of error
        return {
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalVendors: 0,
          totalProperties: 0,
          totalRides: 0,
          totalDrivers: 0,
          totalServiceProviders: 0,
          pendingVendorApplications: 0,
          pendingDriverApprovals: 0,
          pendingServiceProviders: 0,
          totalRevenue: 0,
          recentActivity: []
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

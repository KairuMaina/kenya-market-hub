
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalVendors: number;
  totalProperties: number;
  totalRides: number;
  totalDrivers: number;
  totalServiceProviders: number;
  totalRevenue: number;
  pendingVendorApplications: number;
  pendingDriverApprovals: number;
  pendingServiceProviders: number;
  recentActivity?: Array<{
    id: string;
    message: string;
    timestamp: string;
  }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: ordersCount },
        { count: vendorsCount },
        { count: propertiesCount },
        { count: ridesCount },
        { count: driversCount },
        { count: serviceProvidersCount },
        { data: transactions },
        { data: vendorApplications },
        { data: pendingDrivers },
        { data: pendingProviders }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('drivers').select('*', { count: 'exact', head: true }),
        supabase.from('service_provider_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount'),
        supabase.from('vendor_applications').select('*').eq('status', 'pending'),
        supabase.from('drivers').select('*').eq('is_verified', false),
        supabase.from('service_provider_profiles').select('*').eq('verification_status', 'pending')
      ]);

      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalVendors: vendorsCount || 0,
        totalProperties: propertiesCount || 0,
        totalRides: ridesCount || 0,
        totalDrivers: driversCount || 0,
        totalServiceProviders: serviceProvidersCount || 0,
        totalRevenue,
        pendingVendorApplications: vendorApplications?.length || 0,
        pendingDriverApprovals: pendingDrivers?.length || 0,
        pendingServiceProviders: pendingProviders?.length || 0,
        recentActivity: [
          {
            id: '1',
            message: 'New vendor application received',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            message: 'Order #12345 completed',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      };
    }
  });
};

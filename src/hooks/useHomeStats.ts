
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useHomeStats = () => {
  return useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: propertiesCount },
        { count: ridesCount },
        { count: vendorsCount },
        { count: ordersCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: usersCount || 0,
        products: productsCount || 0,
        properties: propertiesCount || 0,
        rides: ridesCount || 0,
        vendors: vendorsCount || 0,
        orders: ordersCount || 0
      };
    }
  });
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: ordersCount },
        { data: transactions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount')
      ]);

      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        users: usersCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0,
        revenue: totalRevenue
      };
    }
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      change: '+0%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Products',
      value: stats?.products || 0,
      change: '+0%',
      icon: ShoppingBag,
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: `KSh ${(stats?.revenue || 0).toLocaleString()}`,
      change: '+0%',
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      title: 'Orders',
      value: stats?.orders || 0,
      change: '+0%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              {stat.change} from last month
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboardStats;

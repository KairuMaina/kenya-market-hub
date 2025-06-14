
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Package, ShoppingCart, Building, Car, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: ordersCount },
        { count: propertiesCount },
        { count: ridesCount },
        { count: serviceProvidersCount },
        { data: transactions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('service_provider_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount')
      ]);

      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        users: usersCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0,
        properties: propertiesCount || 0,
        rides: ridesCount || 0,
        serviceProviders: serviceProvidersCount || 0,
        revenue: totalRevenue
      };
    }
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Registered users'
    },
    {
      title: 'Products',
      value: stats?.products || 0,
      icon: Package,
      color: 'from-green-500 to-green-600',
      description: 'Active products'
    },
    {
      title: 'Orders',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      description: 'Total orders'
    },
    {
      title: 'Properties',
      value: stats?.properties || 0,
      icon: Building,
      color: 'from-orange-500 to-orange-600',
      description: 'Listed properties'
    },
    {
      title: 'Rides',
      value: stats?.rides || 0,
      icon: Car,
      color: 'from-red-500 to-red-600',
      description: 'Ride requests'
    },
    {
      title: 'Service Providers',
      value: stats?.serviceProviders || 0,
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Active providers'
    },
    {
      title: 'Revenue',
      value: `KSH ${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Total revenue'
    },
    {
      title: 'Growth',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      description: 'Monthly growth'
    }
  ];

  if (isLoading) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p>Loading dashboard...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-blue-100 mt-2">
              Here's what's happening with Soko Smart today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <Card key={stat.title} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  E-commerce Management
                </CardTitle>
                <CardDescription>
                  Manage products, orders, and vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">Latest activity in your marketplace</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Real Estate Hub
                </CardTitle>
                <CardDescription>
                  Properties, agents, and inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">Property listings and agent management</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Transportation
                </CardTitle>
                <CardDescription>
                  Rides, drivers, and logistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">Ride management and driver coordination</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminDashboard;

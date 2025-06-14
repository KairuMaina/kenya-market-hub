
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Package, ShoppingCart, Building, Car, Briefcase, DollarSign, TrendingUp, Store, UserCheck, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch comprehensive dashboard statistics
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
        { count: vendorsCount },
        { count: driversCount },
        { data: transactions },
        { data: vendorApplications },
        { data: pendingVendors },
        { data: pendingDrivers },
        { data: pendingProviders }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('service_provider_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('drivers').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount'),
        supabase.from('vendor_applications').select('*').eq('status', 'pending'),
        supabase.from('vendors').select('*').eq('verification_status', 'pending'),
        supabase.from('drivers').select('*').eq('is_verified', false),
        supabase.from('service_provider_profiles').select('*').eq('verification_status', 'pending')
      ]);

      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const pendingApplications = (vendorApplications?.length || 0);
      const pendingApprovals = (pendingVendors?.length || 0) + (pendingDrivers?.length || 0) + (pendingProviders?.length || 0);

      return {
        users: usersCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0,
        properties: propertiesCount || 0,
        rides: ridesCount || 0,
        serviceProviders: serviceProvidersCount || 0,
        vendors: vendorsCount || 0,
        drivers: driversCount || 0,
        revenue: totalRevenue,
        pendingApplications,
        pendingApprovals
      };
    }
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Registered users',
      link: '/admin/customers'
    },
    {
      title: 'Products',
      value: stats?.products || 0,
      icon: Package,
      color: 'from-green-500 to-green-600',
      description: 'Active products',
      link: '/admin/products'
    },
    {
      title: 'Orders',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      description: 'Total orders',
      link: '/admin/orders'
    },
    {
      title: 'Properties',
      value: stats?.properties || 0,
      icon: Building,
      color: 'from-orange-500 to-orange-600',
      description: 'Listed properties',
      link: '/admin/properties'
    },
    {
      title: 'Rides',
      value: stats?.rides || 0,
      icon: Car,
      color: 'from-red-500 to-red-600',
      description: 'Ride requests',
      link: '/admin/rides'
    },
    {
      title: 'Vendors',
      value: stats?.vendors || 0,
      icon: Store,
      color: 'from-pink-500 to-pink-600',
      description: 'Active vendors',
      link: '/admin/vendors'
    },
    {
      title: 'Drivers',
      value: stats?.drivers || 0,
      icon: Car,
      color: 'from-blue-500 to-cyan-600',
      description: 'Registered drivers',
      link: '/admin/drivers'
    },
    {
      title: 'Service Providers',
      value: stats?.serviceProviders || 0,
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Active providers',
      link: '/admin/service-providers'
    }
  ];

  const alertCards = [
    {
      title: 'Pending Applications',
      value: stats?.pendingApplications || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      description: 'New vendor applications',
      link: '/admin/vendors',
      urgent: (stats?.pendingApplications || 0) > 0
    },
    {
      title: 'Pending Approvals', 
      value: stats?.pendingApprovals || 0,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      description: 'Accounts awaiting approval',
      urgent: (stats?.pendingApprovals || 0) > 0
    },
    {
      title: 'Revenue',
      value: `KSH ${(stats?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Total revenue',
      link: '/admin/analytics'
    },
    {
      title: 'Growth',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      description: 'Monthly growth',
      link: '/admin/analytics'
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

          {/* Alert Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {alertCards.map((alert) => (
              <Card 
                key={alert.title} 
                className={`shadow-lg border-0 hover:shadow-xl transition-all duration-300 ${
                  alert.urgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {alert.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${alert.color} ${alert.urgent ? 'animate-pulse' : ''}`}>
                    <alert.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{alert.value}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{alert.description}</p>
                    {alert.link && (
                      <Link to={alert.link}>
                        <Button variant="outline" size="sm" className="text-xs h-6">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
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
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{stat.description}</p>
                    {stat.link && (
                      <Link to={stat.link}>
                        <Button variant="outline" size="sm" className="text-xs h-6">
                          Manage
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  E-commerce Management
                </CardTitle>
                <CardDescription>
                  Manage products, orders, and vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Oversee your marketplace operations</p>
                <div className="flex gap-2">
                  <Link to="/admin/vendors">
                    <Button size="sm" variant="outline">Vendors</Button>
                  </Link>
                  <Link to="/admin/products">
                    <Button size="sm" variant="outline">Products</Button>
                  </Link>
                  <Link to="/admin/orders">
                    <Button size="sm" variant="outline">Orders</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Real Estate Hub
                </CardTitle>
                <CardDescription>
                  Properties, agents, and inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Manage property listings and agents</p>
                <div className="flex gap-2">
                  <Link to="/admin/properties">
                    <Button size="sm" variant="outline">Properties</Button>
                  </Link>
                  <Link to="/admin/agents">
                    <Button size="sm" variant="outline">Agents</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Transportation & Services
                </CardTitle>
                <CardDescription>
                  Rides, drivers, and service providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Coordinate rides and services</p>
                <div className="flex gap-2">
                  <Link to="/admin/drivers">
                    <Button size="sm" variant="outline">Drivers</Button>
                  </Link>
                  <Link to="/admin/service-providers">
                    <Button size="sm" variant="outline">Services</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminDashboard;

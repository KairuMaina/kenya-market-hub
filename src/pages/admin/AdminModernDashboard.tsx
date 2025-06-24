
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, ShoppingBag, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminModernDashboard = () => {
  // Fetch real dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: ordersCount },
        { count: vendorsCount },
        { count: driversCount },
        { count: serviceProvidersCount },
        { data: pendingVendors },
        { data: pendingNotifications }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('drivers').select('*', { count: 'exact', head: true }),
        supabase.from('service_provider_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*').eq('verification_status', 'pending'),
        supabase.from('notifications').select('*').eq('is_read', false)
      ]);

      return {
        users: usersCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0,
        vendors: vendorsCount || 0,
        drivers: driversCount || 0,
        serviceProviders: serviceProvidersCount || 0,
        pendingVendors: pendingVendors?.length || 0,
        unreadNotifications: pendingNotifications?.length || 0
      };
    }
  });

  const quickActions = [
    { title: 'Add User', href: '/admin/users', icon: Users, color: 'bg-blue-500' },
    { title: 'Add Product', href: '/admin/products', icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'View Orders', href: '/admin/orders', icon: ClipboardList, color: 'bg-orange-500' },
    { title: 'Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Soko Smart Admin Panel</p>
        </div>
        <Link to="/admin/users">
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </Link>
      </div>

      <AdminDashboardStats />

      {/* Alert Cards for Pending Items */}
      {(stats?.pendingVendors > 0 || stats?.unreadNotifications > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats?.pendingVendors > 0 && (
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Vendor Applications</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingVendors}</div>
                <p className="text-xs text-muted-foreground">Vendors awaiting approval</p>
                <Link to="/admin/vendors">
                  <Button variant="outline" size="sm" className="mt-2">
                    Review Applications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {stats?.unreadNotifications > 0 && (
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.unreadNotifications}</div>
                <p className="text-xs text-muted-foreground">Notifications requiring attention</p>
                <Link to="/admin/notifications">
                  <Button variant="outline" size="sm" className="mt-2">
                    View Notifications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System operational</p>
                  <p className="text-xs text-gray-500">All services running normally</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Database connected</p>
                  <p className="text-xs text-gray-500">Real-time data synchronization active</p>
                </div>
              </div>
              {stats?.pendingVendors > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stats.pendingVendors} vendor applications pending</p>
                    <p className="text-xs text-gray-500">Requires administrative review</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Button variant="outline" className="w-full justify-start">
                  <div className={`w-4 h-4 rounded mr-2 ${action.color}`}>
                    <action.icon className="h-3 w-3 text-white m-0.5" />
                  </div>
                  {action.title}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminModernDashboard;

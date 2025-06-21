
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Building, 
  Car, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Store,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      description: 'Registered users',
      link: '/admin/users'
    },
    {
      title: 'Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'from-orange-500 to-orange-600',
      description: 'Active products',
      link: '/admin/products'
    },
    {
      title: 'Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'from-orange-500 to-orange-600',
      description: 'Total orders',
      link: '/admin/orders'
    },
    {
      title: 'Vendors',
      value: stats?.totalVendors || 0,
      icon: Store,
      color: 'from-orange-500 to-orange-600',
      description: 'Active vendors',
      link: '/admin/vendors'
    },
    {
      title: 'Properties',
      value: stats?.totalProperties || 0,
      icon: Building,
      color: 'from-orange-500 to-orange-600',
      description: 'Listed properties',
      link: '/admin/properties'
    },
    {
      title: 'Rides',
      value: stats?.totalRides || 0,
      icon: Car,
      color: 'from-orange-500 to-orange-600',
      description: 'Ride requests',
      link: '/admin/rides'
    },
    {
      title: 'Drivers',
      value: stats?.totalDrivers || 0,
      icon: Car,
      color: 'from-orange-500 to-orange-600',
      description: 'Registered drivers',
      link: '/admin/drivers'
    },
    {
      title: 'Service Providers',
      value: stats?.totalServiceProviders || 0,
      icon: Briefcase,
      color: 'from-orange-500 to-orange-600',
      description: 'Active providers',
      link: '/admin/service-providers'
    }
  ];

  const alertCards = [
    {
      title: 'Pending Applications',
      value: stats?.pendingVendorApplications || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Vendor applications',
      link: '/admin/vendors',
      urgent: (stats?.pendingVendorApplications || 0) > 0
    },
    {
      title: 'Pending Approvals',
      value: (stats?.pendingDriverApprovals || 0) + (stats?.pendingServiceProviders || 0),
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      description: 'Awaiting approval',
      urgent: ((stats?.pendingDriverApprovals || 0) + (stats?.pendingServiceProviders || 0)) > 0
    },
    {
      title: 'Revenue',
      value: `KSh ${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      description: 'Total revenue',
      link: '/admin/analytics'
    },
    {
      title: 'Growth',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      description: 'Monthly growth',
      link: '/admin/analytics'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-orange-100 mt-2">
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
          <Card key={stat.title} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-orange-50">
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
                    <Button variant="outline" size="sm" className="text-xs h-6 border-orange-300 text-orange-600 hover:bg-orange-50">
                      Manage
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Frequently used admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/users">
                <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <Users className="h-5 w-5 text-orange-600 mb-2" />
                  <p className="text-sm font-medium">Manage Users</p>
                </button>
              </Link>
              <Link to="/admin/products">
                <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <Package className="h-5 w-5 text-orange-600 mb-2" />
                  <p className="text-sm font-medium">Manage Products</p>
                </button>
              </Link>
              <Link to="/admin/orders">
                <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <ShoppingCart className="h-5 w-5 text-orange-600 mb-2" />
                  <p className="text-sm font-medium">View Orders</p>
                </button>
              </Link>
              <Link to="/admin/analytics">
                <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <TrendingUp className="h-5 w-5 text-orange-600 mb-2" />
                  <p className="text-sm font-medium">Analytics</p>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

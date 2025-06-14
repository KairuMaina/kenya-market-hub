
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, DollarSign, Users, Package, ShoppingCart, Building, Car } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminAnalytics = () => {
  // Fetch comprehensive analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: ordersCount },
        { count: propertiesCount },
        { count: ridesCount },
        { data: transactions },
        { data: recentOrders }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount, created_at'),
        supabase.from('orders').select('created_at, total_amount').order('created_at', { ascending: false }).limit(30)
      ]);

      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      // Generate monthly data for charts
      const monthlyData = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthOrders = recentOrders?.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === date.getMonth() && 
                 orderDate.getFullYear() === date.getFullYear();
        }) || [];
        
        monthlyData.push({
          month: monthName,
          orders: monthOrders.length,
          revenue: monthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        });
      }

      // Category distribution
      const categoryData = [
        { name: 'E-commerce', value: productsCount || 0, color: '#8884d8' },
        { name: 'Real Estate', value: propertiesCount || 0, color: '#82ca9d' },
        { name: 'Transportation', value: ridesCount || 0, color: '#ffc658' },
        { name: 'Users', value: usersCount || 0, color: '#ff7300' }
      ];

      return {
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalProperties: propertiesCount || 0,
        totalRides: ridesCount || 0,
        totalRevenue,
        monthlyData,
        categoryData
      };
    }
  });

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `KSH ${(analytics?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+12.5%'
    },
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+8.2%'
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      change: '+15.3%'
    },
    {
      title: 'Growth Rate',
      value: '+18.7%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      change: '+2.1%'
    }
  ];

  if (isLoading) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p>Loading analytics...</p>
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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Analytics Dashboard
            </h1>
            <p className="text-indigo-100 mt-2">Comprehensive business insights and performance metrics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
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
                  <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`KSH ${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Orders</CardTitle>
                <CardDescription>Order volume trends over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Platform Distribution */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Distribution of platform activities across different services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics?.categoryData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Platform Breakdown</h3>
                  {analytics?.categoryData?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-gray-600">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminAnalytics;

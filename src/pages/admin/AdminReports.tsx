
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, TrendingUp, Users, Package, ShoppingCart, Building, Car, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminReports = () => {
  // Fetch comprehensive reports data
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: productsCount },
        { count: ordersCount },
        { count: propertiesCount },
        { count: ridesCount },
        { data: orders },
        { data: transactions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('rides').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('created_at, total_amount, status').order('created_at', { ascending: false }).limit(100),
        supabase.from('transactions').select('amount, created_at').order('created_at', { ascending: false }).limit(100)
      ]);

      // Process monthly data
      const monthlyRevenue = processMonthlyRevenue(transactions || []);
      const monthlyOrders = processMonthlyOrders(orders || []);
      const platformData = [
        { name: 'E-commerce', value: ordersCount || 0, color: '#8884d8' },
        { name: 'Real Estate', value: propertiesCount || 0, color: '#82ca9d' },
        { name: 'Transportation', value: ridesCount || 0, color: '#ffc658' }
      ];

      return {
        summary: {
          users: usersCount || 0,
          products: productsCount || 0,
          orders: ordersCount || 0,
          properties: propertiesCount || 0,
          rides: ridesCount || 0,
          totalRevenue: (transactions || []).reduce((sum, t) => sum + Number(t.amount), 0)
        },
        charts: {
          monthlyRevenue,
          monthlyOrders,
          platformData
        }
      };
    }
  });

  const processMonthlyRevenue = (transactions: any[]) => {
    const monthlyData: { [key: string]: number } = {};
    transactions.forEach(transaction => {
      const month = new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + Number(transaction.amount || 0);
    });
    return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue })).slice(-6);
  };

  const processMonthlyOrders = (orders: any[]) => {
    const monthlyData: { [key: string]: number } = {};
    orders.forEach(order => {
      const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return Object.entries(monthlyData).map(([month, orders]) => ({ month, orders })).slice(-6);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  const exportReport = (type: string) => {
    // In a real app, this would generate and download a report
    console.log(`Exporting ${type} report...`);
  };

  if (isLoading) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p>Loading reports...</p>
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
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Business Reports
            </h1>
            <p className="text-teal-100 mt-2">Comprehensive analytics and performance reports</p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.summary.users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.summary.products}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.summary.orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.summary.properties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rides</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportsData?.summary.rides}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSH {reportsData?.summary.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => exportReport('revenue')} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Revenue Report
            </Button>
            <Button onClick={() => exportReport('users')} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export User Report
            </Button>
            <Button onClick={() => exportReport('orders')} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Orders Report
            </Button>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportsData?.charts.monthlyRevenue}>
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
            <Card>
              <CardHeader>
                <CardTitle>Monthly Orders</CardTitle>
                <CardDescription>Order volume trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportsData?.charts.monthlyOrders}>
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
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity Distribution</CardTitle>
              <CardDescription>Distribution of activities across different platform services</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={reportsData?.charts.platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportsData?.charts.platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">+24.5%</div>
                <p className="text-sm text-gray-600">Monthly growth</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">89.2%</div>
                <p className="text-sm text-gray-600">User engagement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">12.8%</div>
                <p className="text-sm text-gray-600">Order conversion</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminReports;

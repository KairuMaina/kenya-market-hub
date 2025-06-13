
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Package
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const AdminReports = () => {
  const { user, loading } = useAuth();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('30d');

  // Fetch real data
  const { data: orders = [] } = useQuery({
    queryKey: ['reports-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['reports-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['reports-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data;
    }
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user || user.email !== 'gmaina424@gmail.com') {
    return <Navigate to="/" replace />;
  }

  // Calculate real statistics
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = profiles.length;
  const totalProducts = products.length;

  const reports = [
    {
      title: 'Sales Report',
      description: 'Comprehensive sales data and trends',
      icon: DollarSign,
      type: 'sales',
      color: 'from-green-500 to-green-600',
      records: orders.length
    },
    {
      title: 'Orders Report',
      description: 'Order status and fulfillment data',
      icon: ShoppingBag,
      type: 'orders',
      color: 'from-blue-500 to-blue-600',
      records: orders.length
    },
    {
      title: 'Users Report',
      description: 'User registration and activity metrics',
      icon: Users,
      type: 'users',
      color: 'from-purple-500 to-purple-600',
      records: profiles.length
    },
    {
      title: 'Products Report',
      description: 'Product performance and inventory',
      icon: Package,
      type: 'products',
      color: 'from-orange-500 to-orange-600',
      records: products.length
    }
  ];

  const handleDownload = (reportType: string) => {
    // Generate CSV content based on report type
    let csvContent = '';
    let filename = '';
    
    switch (reportType) {
      case 'sales':
        csvContent = generateSalesCSV(orders);
        filename = 'sales-report';
        break;
      case 'orders':
        csvContent = generateOrdersCSV(orders);
        filename = 'orders-report';
        break;
      case 'users':
        csvContent = generateUsersCSV(profiles);
        filename = 'users-report';
        break;
      case 'products':
        csvContent = generateProductsCSV(products);
        filename =   'products-report';
        break;
      default:
        return;
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSalesCSV = (orders: any[]) => {
    const headers = 'Order ID,Total Amount,Payment Status,Created At\n';
    const rows = orders.map(order => 
      `${order.id},${order.total_amount || 0},${order.payment_status || 'pending'},${order.created_at}`
    ).join('\n');
    return headers + rows;
  };

  const generateOrdersCSV = (orders: any[]) => {
    const headers = 'Order ID,User ID,Status,Total Amount,Created At\n';
    const rows = orders.map(order => 
      `${order.id},${order.user_id},${order.status || 'pending'},${order.total_amount || 0},${order.created_at}`
    ).join('\n');
    return headers + rows;
  };

  const generateUsersCSV = (profiles: any[]) => {
    const headers = 'User ID,Full Name,Email,Country,Created At\n';
    const rows = profiles.map(profile => 
      `${profile.id},"${profile.full_name || ''}","${profile.email}","${profile.country || 'Kenya'}",${profile.created_at}`
    ).join('\n');
    return headers + rows;
  };

  const generateProductsCSV = (products: any[]) => {
    const headers = 'Product ID,Name,Category,Price,Stock Quantity,In Stock,Created At\n';
    const rows = products.map(product => 
      `${product.id},"${product.name}","${product.category}",${product.price || 0},${product.stock_quantity || 0},${product.in_stock ? 'Yes' : 'No'},${product.created_at}`
    ).join('\n');
    return headers + rows;
  };

  return (
    <MainLayout>
      <div className="space-y-3 sm:space-y-4 animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            Reports & Analytics
          </h1>
          <p className="text-indigo-100 mt-1 sm:mt-2 text-sm">Generate and download detailed reports</p>
        </div>

        {/* Report Controls */}
        <Card className="shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">Report Generator</CardTitle>
            <CardDescription className="text-sm">Select report type and date range to generate custom reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="orders">Orders Report</SelectItem>
                    <SelectItem value="users">Users Report</SelectItem>
                    <SelectItem value="products">Products Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="12m">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => handleDownload(reportType)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-2 bg-gradient-to-r ${report.color} rounded-lg`}>
                      <report.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg md:text-xl">{report.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Records:</span>
                    <span className="font-medium">{report.records} entries</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-sm"
                    onClick={() => {
                      setReportType(report.type);
                      handleDownload(report.type);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {report.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-time Quick Stats */}
        <Card className="shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Live Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                  KSh {totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{totalOrders}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">{totalUsers}</div>
                <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">{totalProducts}</div>
                <div className="text-xs sm:text-sm text-gray-600">Products</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminReports;

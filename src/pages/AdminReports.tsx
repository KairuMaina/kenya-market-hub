
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const reports = [
    {
      title: 'Sales Report',
      description: 'Comprehensive sales data and trends',
      icon: DollarSign,
      type: 'sales',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Orders Report',
      description: 'Order status and fulfillment data',
      icon: ShoppingBag,
      type: 'orders',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Users Report',
      description: 'User registration and activity metrics',
      icon: Users,
      type: 'users',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Products Report',
      description: 'Product performance and inventory',
      icon: Package,
      type: 'products',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleDownload = (reportType: string) => {
    // Mock download functionality
    const element = document.createElement('a');
    element.href = '#';
    element.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
            Reports & Analytics
          </h1>
          <p className="text-indigo-100 mt-2 text-sm sm:text-base">Generate and download detailed reports</p>
        </div>

        {/* Report Controls */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Report Generator</CardTitle>
            <CardDescription>Select report type and date range to generate custom reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 sm:p-3 bg-gradient-to-r ${report.color} rounded-lg`}>
                      <report.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">{report.title}</CardTitle>
                      <CardDescription className="text-sm">{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Generated:</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Records:</span>
                    <span className="font-medium">1,234 entries</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
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

        {/* Quick Stats */}
        <Card className="shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">KSH 2.4M</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">1,234</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">856</div>
                <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">2,450</div>
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

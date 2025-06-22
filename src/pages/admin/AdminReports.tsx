
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, DollarSign } from 'lucide-react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import { DateRange } from 'react-day-picker';

const AdminReports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Fetch report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['admin-reports', reportType, dateRange],
    queryFn: async () => {
      let query = supabase.from('orders').select('*');
      
      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    }
  });

  const generateReport = () => {
    if (!reportData) return;
    
    const csvContent = [
      ['Order ID', 'User ID', 'Total Amount', 'Status', 'Payment Status', 'Created At'],
      ...reportData.map(order => [
        order.id,
        order.user_id,
        order.total_amount,
        order.status,
        order.payment_status,
        new Date(order.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Calculate summary statistics
  const totalRevenue = reportData?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;
  const totalOrders = reportData?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <ModernAdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Reports & Analytics
          </h1>
          <p className="text-green-100 mt-2">Generate and download detailed business reports</p>
        </div>

        {/* Report Filters */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
            <CardDescription>Configure report parameters and date ranges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
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
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={generateReport} 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                KSH {totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">From selected period</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders in period</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                KSH {averageOrderValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Average per order</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Previously generated reports and scheduled reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-medium">Sales Report - Monthly</h4>
                  <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-green-50">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-medium">User Activity Report</h4>
                  <p className="text-sm text-gray-600">Generated on {new Date(Date.now() - 86400000).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-green-50">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-medium">Product Performance Report</h4>
                  <p className="text-sm text-gray-600">Generated on {new Date(Date.now() - 172800000).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-green-50">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminReports;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Activity
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const AdminAnalytics = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ['analytics-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['analytics-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['analytics-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 sm:h-8 sm:w-8" />
            Analytics Dashboard
          </h1>
          <p className="text-blue-100 mt-2 text-sm sm:text-base">Monitor your marketplace performance</p>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    KSh {totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                  <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                  <ShoppingBag className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{profiles.length}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    KSh {averageOrderValue.toFixed(0)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Order Status Overview</CardTitle>
              <CardDescription className="text-sm">Current status of all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Orders</span>
                  <span className="font-semibold">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing Orders</span>
                  <span className="font-semibold">{orders.filter(o => o.status === 'processing').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Shipped Orders</span>
                  <span className="font-semibold">{orders.filter(o => o.status === 'shipped').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Delivered Orders</span>
                  <span className="font-semibold">{orders.filter(o => o.status === 'delivered').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Product Inventory</CardTitle>
              <CardDescription className="text-sm">Current stock status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Products</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Stock</span>
                  <span className="font-semibold text-green-600">
                    {products.filter(p => p.in_stock).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Out of Stock</span>
                  <span className="font-semibold text-red-600">
                    {products.filter(p => !p.in_stock).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Stock (< 10)</span>
                  <span className="font-semibold text-orange-600">
                    {products.filter(p => p.stock_quantity < 10 && p.in_stock).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminAnalytics;

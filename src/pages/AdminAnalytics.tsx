
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const AdminAnalytics = () => {
  const { user, loading } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');

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

  // Mock data for analytics - replace with real Supabase queries
  const salesData = [
    { date: '2024-01-01', sales: 1200, orders: 45 },
    { date: '2024-01-02', sales: 1800, orders: 67 },
    { date: '2024-01-03', sales: 1400, orders: 52 },
    { date: '2024-01-04', sales: 2100, orders: 78 },
    { date: '2024-01-05', sales: 1650, orders: 61 },
    { date: '2024-01-06', sales: 1950, orders: 73 },
    { date: '2024-01-07', sales: 2300, orders: 85 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#8B5CF6' },
    { name: 'Fashion', value: 25, color: '#EC4899' },
    { name: 'Beauty', value: 20, color: '#F59E0B' },
    { name: 'Auto Parts', value: 20, color: '#10B981' }
  ];

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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { title: 'Total Revenue', value: 'KSH 2.4M', icon: DollarSign, change: '+18%', color: 'from-green-500 to-green-600' },
            { title: 'Total Orders', value: '1,234', icon: ShoppingBag, change: '+12%', color: 'from-blue-500 to-blue-600' },
            { title: 'Active Users', value: '856', icon: Users, change: '+8%', color: 'from-purple-500 to-purple-600' },
            { title: 'Growth Rate', value: '23%', icon: TrendingUp, change: '+5%', color: 'from-orange-500 to-orange-600' }
          ].map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`p-2 sm:p-3 bg-gradient-to-r ${stat.color} rounded-full`}>
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Sales Chart */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                Sales Overview
              </CardTitle>
              <CardDescription className="text-sm">Daily sales and orders for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#EC4899" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
                Category Distribution
              </CardTitle>
              <CardDescription className="text-sm">Sales distribution by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsPieChart data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={80}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs sm:text-sm text-gray-600">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminAnalytics;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Package, ShoppingCart, Building, Car, Briefcase, DollarSign } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '12,345', icon: Users, color: 'from-orange-500 to-orange-600' },
    { title: 'Total Products', value: '2,456', icon: Package, color: 'from-orange-500 to-orange-600' },
    { title: 'Total Orders', value: '8,910', icon: ShoppingCart, color: 'from-orange-500 to-orange-600' },
    { title: 'Total Revenue', value: 'KSh 1.2M', icon: DollarSign, color: 'from-orange-500 to-orange-600' },
    { title: 'Properties Listed', value: '567', icon: Building, color: 'from-orange-500 to-orange-600' },
    { title: 'Active Rides', value: '123', icon: Car, color: 'from-orange-500 to-orange-600' },
    { title: 'Service Providers', value: '345', icon: Briefcase, color: 'from-orange-500 to-orange-600' },
    { title: 'Monthly Growth', value: '+15%', icon: BarChart3, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-orange-100 mt-2">Overview of your Soko Smart platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="text-sm">New user registration: john@example.com</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="text-sm">Product added: Samsung Galaxy S24</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="text-sm">New order: Order #12345</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="text-sm">Property listed: 3BR House in Westlands</p>
                  </div>
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
                  <button className="p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <Users className="h-5 w-5 text-orange-600 mb-2" />
                    <p className="text-sm font-medium">Manage Users</p>
                  </button>
                  <button className="p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <Package className="h-5 w-5 text-orange-600 mb-2" />
                    <p className="text-sm font-medium">Add Product</p>
                  </button>
                  <button className="p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <ShoppingCart className="h-5 w-5 text-orange-600 mb-2" />
                    <p className="text-sm font-medium">View Orders</p>
                  </button>
                  <button className="p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                    <BarChart3 className="h-5 w-5 text-orange-600 mb-2" />
                    <p className="text-sm font-medium">Analytics</p>
                  </button>
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

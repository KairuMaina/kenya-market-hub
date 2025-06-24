
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, ShoppingBag, ClipboardList, TrendingUp } from 'lucide-react';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import { Link } from 'react-router-dom';

const AdminModernDashboard = () => {
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
        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Quick Action
        </Button>
      </div>

      <AdminDashboardStats />

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
                  <p className="text-sm font-medium">System ready for deployment</p>
                  <p className="text-xs text-gray-500">Mock data removed, awaiting real API integration</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">All routes configured</p>
                  <p className="text-xs text-gray-500">Frontend to admin panel mapping complete</p>
                </div>
              </div>
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

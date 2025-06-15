import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Plus,
  BarChart3,
  Store,
  Users
} from 'lucide-react';
import { useMyVendorProfile } from '@/hooks/useVendors';
import VendorAnalytics from "@/components/VendorAnalytics";

const VendorMainDashboard = () => {
  const { data: vendorProfile } = useMyVendorProfile();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new product in your store',
      icon: Plus,
      color: 'bg-orange-500',
      action: () => navigate('/vendor/products/add')
    },
    {
      title: 'View Store',
      description: 'See how customers view your store',
      icon: Store,
      color: 'bg-blue-500',
      action: () => navigate('/vendor/store')
    },
    {
      title: 'Customers',
      description: 'Manage customer relationships',
      icon: Users,
      color: 'bg-purple-500',
      action: () => navigate('/vendor/customers')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Store className="h-8 w-8" />
          Vendor Dashboard
        </h1>
        <p className="text-orange-100 mt-2">
          Welcome back! Manage your store and grow your business
        </p>
        {vendorProfile && (
          <div className="mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {vendorProfile.business_name}
            </Badge>
          </div>
        )}
      </div>
      <VendorAnalytics />

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left space-y-2 hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #00{item}</p>
                    <p className="text-sm text-gray-600">Customer {item}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">KSH {(item * 1500).toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Product {item}</p>
                    <p className="text-sm text-gray-600">{item * 5} sold this month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">KSH {(item * 800).toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{item * 2}% sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorMainDashboard;

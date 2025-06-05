
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Package,
  UserCheck,
  Eye
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
    { title: 'Total Orders', value: '856', icon: ShoppingBag, change: '+23%' },
    { title: 'Revenue', value: 'KSh 2.4M', icon: DollarSign, change: '+18%' },
    { title: 'Active Vendors', value: '45', icon: UserCheck, change: '+8%' },
  ];

  const recentOrders = [
    { id: '#001', customer: 'John Doe', amount: 'KSh 15,000', status: 'Completed', vendor: 'TechHub Kenya' },
    { id: '#002', customer: 'Jane Smith', amount: 'KSh 8,500', status: 'Processing', vendor: 'AutoSpare Kenya' },
    { id: '#003', customer: 'Mike Johnson', amount: 'KSh 12,000', status: 'Shipped', vendor: 'StyleHub' },
    { id: '#004', customer: 'Sarah Wilson', amount: 'KSh 4,500', status: 'Pending', vendor: 'HomeEssentials' },
  ];

  const pendingVendors = [
    { name: 'Electronics Plus', email: 'info@electronicsplus.ke', applied: '2 days ago' },
    { name: 'Fashion Forward', email: 'hello@fashionforward.ke', applied: '1 day ago' },
    { name: 'Auto Masters', email: 'contact@automasters.ke', applied: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">KenyaMarket Admin</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'Completed' ? 'default' : 
                            order.status === 'Processing' ? 'secondary' :
                            order.status === 'Shipped' ? 'outline' : 'destructive'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Vendor Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Pending Vendor Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVendors.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{vendor.name}</h4>
                      <p className="text-sm text-gray-600">{vendor.email}</p>
                      <p className="text-xs text-gray-500">Applied {vendor.applied}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="default">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Package className="h-6 w-6 mb-2" />
                  View Products
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <ShoppingBag className="h-6 w-6 mb-2" />
                  All Orders
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

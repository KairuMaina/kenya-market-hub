
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminOrders = () => {
  // Fetch orders with customer information
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch profiles separately
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Profiles fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  // Fetch order items
  const { data: orderItems } = useQuery({
    queryKey: ['admin-order-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select('*');
      
      if (error) {
        console.error('Order items fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'processing':
      case 'shipped':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getCustomerInfo = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  const getOrderItemsCount = (orderId: string) => {
    return orderItems?.filter(item => item.order_id === orderId).length || 0;
  };

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Order Management
            </h1>
            <p className="text-orange-100 mt-2">Track and manage customer orders</p>
          </div>

          {/* Order Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSH {totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Orders</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-2">Loading orders...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{getCustomerInfo(order.user_id)}</TableCell>
                          <TableCell>{getOrderItemsCount(order.id)} items</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            KSH {Number(order.total_amount || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={order.payment_status === 'completed' ? 'default' : 'outline'}>
                              {order.payment_status || 'pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminOrders;

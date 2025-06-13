
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Package, Truck, CheckCircle } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const getCustomerInfo = (userId: string) => {
    return profiles.find(p => p.id === userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                </div>
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipped</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'shipped').length}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Order ID</th>
                    <th className="text-left p-4">Customer</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Payment</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const customer = getCustomerInfo(order.user_id);
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm">#{order.id.slice(-8)}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{customer?.full_name || 'Unknown Customer'}</p>
                            <p className="text-sm text-gray-500">{customer?.email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-medium">KSh {order.total_amount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(order.status || 'pending')}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status || 'pending')}
                              {order.status || 'pending'}
                            </div>
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                            {order.payment_status || 'pending'}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(order.created_at || '').toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id?.slice(-8)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Customer Information</h4>
                  <p>{getCustomerInfo(selectedOrder.user_id)?.full_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{getCustomerInfo(selectedOrder.user_id)?.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Order Status</h4>
                  <Badge className={getStatusColor(selectedOrder.status || 'pending')}>
                    {selectedOrder.status || 'pending'}
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shipping_address ? 
                    JSON.stringify(selectedOrder.shipping_address) : 
                    'No shipping address provided'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Order Total</h4>
                <p className="text-xl font-bold text-green-600">
                  KSh {selectedOrder.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminOrders;

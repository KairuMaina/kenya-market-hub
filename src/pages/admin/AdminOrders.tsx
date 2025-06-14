
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Eye, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
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

  // Fetch profiles for customer names
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles-for-orders'],
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

  const getCustomerName = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email) : 'Unknown';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8" />
              Order Management
            </h1>
            <p className="text-purple-100 mt-2 text-sm sm:text-base">Manage customer orders and transactions</p>
          </div>

          {/* Order Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{pendingOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{completedOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">KSH {totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Orders</CardTitle>
              <CardDescription className="text-sm">View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading orders...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Order ID</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Customer</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Amount</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Payment</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="font-mono text-xs">
                              #{order.id.slice(-8)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="font-medium">{getCustomerName(order.user_id)}</div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="font-medium">KSH {Number(order.total_amount).toLocaleString()}</div>
                            {order.discount_amount > 0 && (
                              <div className="text-xs text-green-600">
                                -KSH {Number(order.discount_amount).toLocaleString()} discount
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <Badge 
                              variant={order.payment_status === 'completed' ? 'default' : 'outline'} 
                              className="text-xs"
                            >
                              {order.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusBadgeVariant(order.status)} 
                              className="text-xs"
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleView(order)}
                            >
                              <Eye className="h-3 w-3" />
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

          {/* View Order Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Details
                </DialogTitle>
                <DialogDescription>
                  Order #{selectedOrder?.id.slice(-8)}
                </DialogDescription>
              </DialogHeader>
              
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">Customer:</span>
                        <p className="text-sm">{getCustomerName(selectedOrder.user_id)}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Order Date:</span>
                        <p className="text-sm">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Payment Method:</span>
                        <p className="text-sm">{selectedOrder.payment_method || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">Total Amount:</span>
                        <p className="text-lg font-bold text-green-600">
                          KSH {Number(selectedOrder.total_amount).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Order Status:</span>
                        <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="ml-2">
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Payment Status:</span>
                        <Badge 
                          variant={selectedOrder.payment_status === 'completed' ? 'default' : 'outline'} 
                          className="ml-2"
                        >
                          {selectedOrder.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {selectedOrder.discount_amount > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Discount Applied:</span>
                      <p className="text-sm text-green-700">
                        KSH {Number(selectedOrder.discount_amount).toLocaleString()} discount
                      </p>
                    </div>
                  )}
                  
                  {selectedOrder.shipping_address && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Shipping Address:</span>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">
                          {typeof selectedOrder.shipping_address === 'string' 
                            ? selectedOrder.shipping_address 
                            : JSON.stringify(selectedOrder.shipping_address, null, 2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminOrders;


import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Users, Package, BarChart3, Store, Tag, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import AddProductModal from '@/components/AddProductModal';
import { useVendorApplications } from '@/hooks/useVendors';
import { useAdminVendors } from '@/hooks/useAdminVendors';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  role?: string;
}

interface OrderData {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

interface TransactionData {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  order_id: string;
}

interface VendorApplication {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  submitted_at: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_amount: number;
  discount_type: string;
  used_count: number;
  usage_limit?: number;
  expires_at: string;
  created_at: string;
  is_active: boolean;
  minimum_order_amount: number;
  updated_at: string;
}

const NewAdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchParams] = useSearchParams();
  const [directQueryResult, setDirectQueryResult] = useState<any>(null);
  const [detailedTestResult, setDetailedTestResult] = useState<any>(null);
  
  // Get the default tab from URL parameters
  const defaultTab = searchParams.get('tab') || 'products';

  // Enhanced direct database test function
  const testDirectQuery = async () => {
    console.log('🧪 Testing direct database query...');
    try {
      const { data, error, count } = await supabase
        .from('vendor_applications')
        .select('*', { count: 'exact' });
      
      console.log('🧪 Direct query result:', { data, error, count });
      setDirectQueryResult({ data, error, count, timestamp: new Date().toISOString() });
      
      if (data && data.length > 0) {
        toast({ 
          title: `Found ${data.length} applications in direct query`,
          description: "Check console for details"
        });
      } else {
        toast({ 
          title: "No applications found in direct query",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('🧪 Direct query failed:', err);
      setDirectQueryResult({ error: err, timestamp: new Date().toISOString() });
    }
  };

  // Comprehensive database test
  const runDetailedTest = async () => {
    console.log('🔬 Running detailed database test...');
    const results: any = {};
    
    try {
      // Test 1: Check if we can connect to Supabase at all
      console.log('🔬 Test 1: Basic connection test...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      results.user = { user: user?.email, error: userError };
      
      // Test 2: Test table existence and permissions
      console.log('🔬 Test 2: Table access test...');
      const { data: schemaData, error: schemaError } = await supabase
        .from('vendor_applications')
        .select('count', { count: 'exact', head: true });
      results.tableAccess = { data: schemaData, error: schemaError };
      
      // Test 3: Try different query approaches
      console.log('🔬 Test 3: Different query approaches...');
      
      // Approach A: Simple select
      const { data: dataA, error: errorA } = await supabase
        .from('vendor_applications')
        .select('*');
      results.simpleSelect = { data: dataA, error: errorA, count: dataA?.length };
      
      // Approach B: Select with limit
      const { data: dataB, error: errorB } = await supabase
        .from('vendor_applications')
        .select('*')
        .limit(10);
      results.limitedSelect = { data: dataB, error: errorB, count: dataB?.length };
      
      // Approach C: Select specific columns
      const { data: dataC, error: errorC } = await supabase
        .from('vendor_applications')
        .select('id, business_name, status');
      results.specificColumns = { data: dataC, error: errorC, count: dataC?.length };
      
      console.log('🔬 Detailed test results:', results);
      setDetailedTestResult({ ...results, timestamp: new Date().toISOString() });
      
      // Show summary in toast
      const totalFound = results.simpleSelect?.count || 0;
      toast({
        title: `Detailed test completed`,
        description: `Found ${totalFound} records. Check console for full details.`
      });
      
    } catch (err) {
      console.error('🔬 Detailed test failed:', err);
      setDetailedTestResult({ error: err, timestamp: new Date().toISOString() });
      toast({
        title: "Detailed test failed",
        description: "Check console for error details",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch users with their roles - simplified query
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<UserProfile[]> => {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = profiles.map(profile => {
        const userRole = roles.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || 'customer'
        };
      });

      return usersWithRoles;
    }
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch orders - simplified query
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async (): Promise<OrderData[]> => {
      // Get orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status, payment_status, created_at, user_id')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;

      // Get user profiles for user info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name');
      
      if (profilesError) throw profilesError;

      // Combine the data
      const ordersWithUsers = ordersData.map(order => {
        const profile = profiles.find(p => p.id === order.user_id);
        return {
          ...order,
          user_email: profile?.email,
          user_name: profile?.full_name
        };
      });

      return ordersWithUsers;
    }
  });

  // Fetch transactions - simplified query
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async (): Promise<TransactionData[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, payment_method, status, created_at, order_id')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Use the vendor applications hook with enhanced logging
  const { data: vendorApplications, isLoading: vendorApplicationsLoading, error: vendorApplicationsError } = useVendorApplications();

  // Fetch vendor profiles for admin
  const [vendorPage, setVendorPage] = useState(1);
  const [vendorSearchTerm, setVendorSearchTerm] = useState('');
  const { data: adminVendorsData, isLoading: adminVendorsLoading, error: adminVendorsError } = useAdminVendors(vendorPage, 10, vendorSearchTerm);

  // Add console logging to debug the vendor applications data
  useEffect(() => {
    console.log('🔄 Admin Dashboard - Vendor applications data changed:');
    console.log('📊 Applications:', vendorApplications);
    console.log('⏳ Loading:', vendorApplicationsLoading);
    console.log('❌ Error:', vendorApplicationsError);
    console.log('📏 Length:', vendorApplications?.length || 0);
  }, [vendorApplications, vendorApplicationsLoading, vendorApplicationsError]);

  // Fetch coupons
  const { data: coupons, isLoading: couponsLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async (): Promise<Coupon[]> => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "User deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting user", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting product", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Approve/reject vendor application
  const handleVendorApplication = useMutation({
    mutationFn: async ({ applicationId, action }: { applicationId: string; action: 'approve' | 'reject' }) => {
      const { data: application, error: fetchError } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
      
      if (fetchError) throw fetchError;

      if (action === 'approve') {
        // Create vendor profile
        const { error: vendorError } = await supabase
          .from('vendors')
          .insert({
            user_id: application.user_id,
            business_name: application.business_name,
            business_description: application.business_description,
            contact_phone: application.contact_phone,
            contact_email: application.contact_email,
            verification_status: 'approved'
          });
        
        if (vendorError) throw vendorError;
      }

      // Update application status
      const { error: updateError } = await supabase
        .from('vendor_applications')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', applicationId);
      
      if (updateError) throw updateError;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({ 
        title: `Vendor application ${variables.action === 'approve' ? 'approved' : 'rejected'} successfully` 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error processing application', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(userId);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(productId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'delivered':
      case 'approved':
        return 'default';
      case 'pending':
      case 'processing':
        return 'secondary';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your marketplace</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSH {transactions?.reduce((sum, t) => sum + Number(t.amount), 0)?.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendor Applications</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vendorApplications?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {vendorApplications?.filter(app => app.status === 'pending').length || 0} pending
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your marketplace products</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div>Loading products...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>KSH {Number(product.price).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                              {product.in_stock ? `${product.stock_quantity || 0} in stock` : 'Out of stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteProduct.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div>Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role || 'customer'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={deleteUser.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div>Loading orders...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">{order.id.slice(0, 8)}...</TableCell>
                          <TableCell>{order.user_name || order.user_email || 'Unknown'}</TableCell>
                          <TableCell>KSH {Number(order.total_amount).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                              {order.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div>Loading transactions...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions?.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono">{transaction.id.slice(0, 8)}...</TableCell>
                          <TableCell className="font-mono">{transaction.order_id.slice(0, 8)}...</TableCell>
                          <TableCell>KSH {Number(transaction.amount).toFixed(2)}</TableCell>
                          <TableCell className="capitalize">{transaction.payment_method}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vendors</CardTitle>
                    <CardDescription>
                      View and manage all vendor profiles. New vendors will be listed here as soon as they are approved.
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        placeholder="Search vendors..."
                        value={vendorSearchTerm}
                        onChange={(e) => {
                          setVendorSearchTerm(e.target.value);
                          setVendorPage(1);
                        }}
                        className="pl-9 w-64 h-9 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        style={{ paddingLeft: 36 }}
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {adminVendorsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-orange-500">Loading vendors...</span>
                  </div>
                ) : adminVendorsError ? (
                  <div className="text-red-500 bg-red-50 p-4 rounded">
                    Error loading vendors: {adminVendorsError.message}
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-orange-50">
                            <th className="px-4 py-2 text-left font-semibold">Business Name</th>
                            <th className="px-4 py-2 text-left font-semibold">Email</th>
                            <th className="px-4 py-2 font-semibold">Status</th>
                            <th className="px-4 py-2 font-semibold">Products</th>
                            <th className="px-4 py-2 font-semibold">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminVendorsData?.length > 0 ? adminVendorsData.map((vendor) => (
                            <tr key={vendor.id} className="hover:bg-orange-50 transition-all">
                              <td className="px-4 py-2 font-medium">{vendor.business_name}</td>
                              <td className="px-4 py-2">{vendor.business_email || 'N/A'}</td>
                              <td className="px-4 py-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  vendor.verification_status === 'approved'
                                    ? 'bg-green-100 text-green-700'
                                    : vendor.verification_status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {vendor.verification_status}
                                </span>
                              </td>
                              <td className="px-4 py-2">{vendor.products_count}</td>
                              <td className="px-4 py-2 text-green-700 font-semibold">KSh {Number(vendor.total_revenue).toLocaleString()}</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                No vendors found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Coupon Management</CardTitle>
                    <CardDescription>Manage discount coupons and promotions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coupon
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {couponsLoading ? (
                  <div>Loading coupons...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons?.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell className="font-mono">{coupon.code}</TableCell>
                          <TableCell className="capitalize">{coupon.discount_type}</TableCell>
                          <TableCell>
                            {coupon.discount_type === 'percentage' 
                              ? `${coupon.discount_amount}%` 
                              : `KSH ${coupon.discount_amount}`}
                          </TableCell>
                          <TableCell>
                            {coupon.used_count}/{coupon.usage_limit || '∞'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                              {coupon.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddProductModal 
        open={showAddProduct} 
        onOpenChange={setShowAddProduct}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          setShowAddProduct(false);
        }}
      />
    </MainLayout>
  );
};

export default NewAdminDashboard;

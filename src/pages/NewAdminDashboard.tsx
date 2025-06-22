
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import AddProductModal from '@/components/AddProductModal';
import { useVendorApplications } from '@/hooks/useVendors';
import { useAdminVendors } from '@/hooks/useAdminVendors';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminProductsTab from '@/components/admin/AdminProductsTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminOrdersTab from '@/components/admin/AdminOrdersTab';
import AdminTransactionsTab from '@/components/admin/AdminTransactionsTab';
import AdminVendorsTab from '@/components/admin/AdminVendorsTab';
import AdminCouponsTab from '@/components/admin/AdminCouponsTab';

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
        return 'default' as const;
      case 'pending':
      case 'processing':
        return 'secondary' as const;
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  // Calculate stats
  const revenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const vendorApplicationsCount = vendorApplications?.length || 0;
  const pendingApplicationsCount = vendorApplications?.filter(app => app.status === 'pending').length || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your marketplace</p>
        </div>

        <AdminStatsCards 
          usersCount={users?.length || 0}
          productsCount={products?.length || 0}
          ordersCount={orders?.length || 0}
          revenue={revenue}
          vendorApplicationsCount={vendorApplicationsCount}
          pendingApplicationsCount={pendingApplicationsCount}
        />

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
            <AdminProductsTab 
              products={products}
              isLoading={productsLoading}
              onAddProduct={() => setShowAddProduct(true)}
              onDeleteProduct={handleDeleteProduct}
              isDeleting={deleteProduct.isPending}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <AdminUsersTab 
              users={users}
              isLoading={usersLoading}
              onDeleteUser={handleDeleteUser}
              isDeleting={deleteUser.isPending}
            />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <AdminOrdersTab 
              orders={orders}
              isLoading={ordersLoading}
              getStatusBadgeVariant={getStatusBadgeVariant}
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <AdminTransactionsTab 
              transactions={transactions}
              isLoading={transactionsLoading}
              getStatusBadgeVariant={getStatusBadgeVariant}
            />
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4">
            <AdminVendorsTab 
              adminVendorsData={adminVendorsData}
              adminVendorsLoading={adminVendorsLoading}
              adminVendorsError={adminVendorsError}
              vendorSearchTerm={vendorSearchTerm}
              setVendorSearchTerm={setVendorSearchTerm}
              setVendorPage={setVendorPage}
            />
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            <AdminCouponsTab 
              coupons={coupons}
              isLoading={couponsLoading}
            />
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

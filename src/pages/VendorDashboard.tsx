
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { Store, Package, BarChart3, Settings } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import VendorApplicationModal from '@/components/VendorApplicationModal';

const VendorDashboard = () => {
  const { user, loading } = useAuth();
  const { data: vendorProfile, isLoading } = useMyVendorProfile();
  const [showApplication, setShowApplication] = useState(false);

  if (loading || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!vendorProfile) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Store className="h-16 w-16 mx-auto text-gray-400" />
            <h1 className="text-3xl font-bold">Become a Vendor</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our marketplace and start selling your products to thousands of customers. 
              Apply now to become a verified vendor.
            </p>
            <Button onClick={() => setShowApplication(true)} size="lg">
              Apply Now
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>List Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add your products with detailed descriptions, images, and pricing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Track Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor your sales performance with detailed analytics and reports.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Manage Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Process orders efficiently and communicate with customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <VendorApplicationModal 
          open={showApplication} 
          onOpenChange={setShowApplication} 
        />
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{vendorProfile.business_name}</h1>
            <p className="text-muted-foreground">Vendor Dashboard</p>
          </div>
          <Badge variant={getStatusColor(vendorProfile.verification_status)}>
            {vendorProfile.verification_status}
          </Badge>
        </div>

        {vendorProfile.verification_status === 'pending' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-800">
                Your vendor application is currently under review. You'll be notified once it's approved.
              </p>
            </CardContent>
          </Card>
        )}

        {vendorProfile.verification_status === 'rejected' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">
                Your vendor application was rejected. Please contact support for more information.
              </p>
            </CardContent>
          </Card>
        )}

        {vendorProfile.verification_status === 'approved' && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">KSH 0</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{vendorProfile.commission_rate}%</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>Manage your product listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    No products listed yet. Start by adding your first product.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>View and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    No orders yet. Orders will appear here once customers start purchasing your products.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Settings</CardTitle>
                  <CardDescription>Manage your vendor profile and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Business Information</h4>
                    <p className="text-sm text-muted-foreground">{vendorProfile.business_description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-sm text-muted-foreground">{vendorProfile.business_email}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default VendorDashboard;

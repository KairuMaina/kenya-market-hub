import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import ServiceProviderRegistration from '@/components/ServiceProviderRegistration';
import MainLayout from '@/components/MainLayout';
import VendorApplicationModal from '@/components/VendorApplicationModal';

const VendorDashboard = () => {
  const { user, loading } = useAuth();
  const { data: vendorProfile, isLoading } = useMyVendorProfile();
  const { data: driverProfile } = useServiceProviderProfile('driver');
  const { data: propertyProfile } = useServiceProviderProfile('property_owner');
  const [showApplication, setShowApplication] = useState(false);
  const [showServiceRegistration, setShowServiceRegistration] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<'driver' | 'property_owner'>('driver');

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

  // Check if user has any approved profiles
  const hasApprovedProfile = vendorProfile?.verification_status === 'approved' ||
                           driverProfile?.verification_status === 'approved' ||
                           propertyProfile?.verification_status === 'approved';

  if (!vendorProfile && !driverProfile && !propertyProfile) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Store className="h-16 w-16 mx-auto text-gray-400" />
            <h1 className="text-3xl font-bold">Become a Service Provider</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our platform and start offering your services. Choose from product sales, 
              ride services, or property listings.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => setShowApplication(true)} size="lg">
                Product Vendor
              </Button>
              <Button 
                onClick={() => {
                  setSelectedServiceType('driver');
                  setShowServiceRegistration(true);
                }} 
                variant="outline" 
                size="lg"
              >
                Ride Driver
              </Button>
              <Button 
                onClick={() => {
                  setSelectedServiceType('property_owner');
                  setShowServiceRegistration(true);
                }} 
                variant="outline" 
                size="lg"
              >
                Property Owner
              </Button>
            </div>
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
        
        {showServiceRegistration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-2 -right-2 z-10"
                onClick={() => setShowServiceRegistration(false)}
              >
                ×
              </Button>
              <ServiceProviderRegistration
                onRegistered={() => setShowServiceRegistration(false)}
              />
            </div>
          </div>
        )}
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
            <h1 className="text-3xl font-bold">Service Provider Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and track performance</p>
          </div>
        </div>

        {/* Service Provider Status Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {vendorProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Product Vendor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getStatusColor(vendorProfile.verification_status)}>
                  {vendorProfile.verification_status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {vendorProfile.business_name}
                </p>
              </CardContent>
            </Card>
          )}

          {driverProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Ride Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getStatusColor(driverProfile.verification_status)}>
                  {driverProfile.verification_status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {driverProfile.business_name}
                </p>
              </CardContent>
            </Card>
          )}

          {propertyProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getStatusColor(propertyProfile.verification_status)}>
                  {propertyProfile.verification_status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {propertyProfile.business_name}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Show analytics only for approved vendors */}
        {hasApprovedProfile && (
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

        {!hasApprovedProfile && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-800">
                Your service provider applications are under review. You'll get access to 
                full dashboard features once approved.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default VendorDashboard;

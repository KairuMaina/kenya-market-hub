
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Car, 
  Home as HomeIcon, 
  User, 
  Plus,
  Package,
  BarChart3,
  Settings,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ServiceProviderRegistration from '@/components/ServiceProviderRegistration';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { useMyVendorProfile } from '@/hooks/useVendors';

const VendorDashboard = () => {
  const { user } = useAuth();
  const { data: vendorProfile } = useMyVendorProfile();
  const { data: driverProfile } = useServiceProviderProfile('driver');
  const { data: propertyProfile } = useServiceProviderProfile('property_owner');

  const serviceTypes = [
    {
      id: 'vendor',
      title: 'Product Vendor',
      icon: ShoppingBag,
      description: 'Sell products on our marketplace',
      profile: vendorProfile,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'driver',
      title: 'Ride Driver',
      icon: Car,
      description: 'Provide taxi or motorbike rides',
      profile: driverProfile,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'property_owner',
      title: 'Property Owner',
      icon: HomeIcon,
      description: 'List properties for sale or rent',
      profile: propertyProfile,
      color: 'from-purple-500 to-violet-600'
    }
  ];

  const quickActions = [
    {
      title: 'Add Products',
      icon: Package,
      action: () => console.log('Add products'),
      color: 'bg-orange-500',
      enabled: vendorProfile?.verification_status === 'approved'
    },
    {
      title: 'View Analytics',
      icon: BarChart3,
      action: () => console.log('View analytics'),
      color: 'bg-blue-500',
      enabled: vendorProfile?.verification_status === 'approved'
    },
    {
      title: 'Ride History',
      icon: BarChart3,
      action: () => console.log('View ride history'),
      color: 'bg-green-500',
      enabled: driverProfile?.verification_status === 'approved'
    },
    {
      title: 'Settings',
      icon: Settings,
      action: () => console.log('Settings'),
      color: 'bg-gray-500',
      enabled: true
    }
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Registered</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Service Provider Dashboard</h1>
          <p className="text-gray-600">Manage your services and grow your business</p>
        </div>

        {/* Service Types Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceTypes.map((service) => (
            <Card key={service.id} className="relative overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${service.color}`} />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${service.color} text-white`}>
                      <service.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {getStatusBadge(service.profile?.verification_status)}
                  {service.profile?.verification_status === 'approved' && (
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={action.action}
                  disabled={!action.enabled}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registration Tabs */}
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register Services</TabsTrigger>
            <TabsTrigger value="status">Application Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="space-y-6">
            <ServiceProviderRegistration />
          </TabsContent>
          
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceTypes.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <service.icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{service.title}</h3>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(service.profile?.verification_status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default VendorDashboard;

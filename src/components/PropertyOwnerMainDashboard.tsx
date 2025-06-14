
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  DollarSign, 
  Eye, 
  MessageSquare,
  Plus,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';

const PropertyOwnerMainDashboard = () => {
  const { data: propertyProfile } = useServiceProviderProfile('property_owner');

  const quickStats = [
    {
      title: 'Total Properties',
      value: '12',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Monthly Revenue',
      value: 'KSH 180,000',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Property Views',
      value: '245',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'New Inquiries',
      value: '18',
      icon: MessageSquare,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const quickActions = [
    {
      title: 'Add Property',
      description: 'List a new property for sale or rent',
      icon: Plus,
      color: 'bg-green-500',
      href: '/property-owner/properties/add'
    },
    {
      title: 'View Inquiries',
      description: 'Respond to customer inquiries',
      icon: MessageSquare,
      color: 'bg-blue-500',
      href: '/property-owner/inquiries'
    },
    {
      title: 'Analytics',
      description: 'View property performance metrics',
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '/property-owner/analytics'
    },
    {
      title: 'Manage Tenants',
      description: 'Handle tenant relationships',
      icon: Users,
      color: 'bg-orange-500',
      href: '/property-owner/tenants'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building className="h-8 w-8" />
          Property Management Dashboard
        </h1>
        <p className="text-green-100 mt-2">
          Manage your real estate portfolio and maximize your returns
        </p>
        {propertyProfile && (
          <div className="mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {propertyProfile.business_name || 'Property Owner'}
            </Badge>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
                onClick={() => console.log(`Navigate to ${action.href}`)}
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
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Property {item} - Apartment</p>
                    <p className="text-sm text-gray-600">John Doe inquired</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">2 hours ago</p>
                    <Badge variant="outline" className="text-xs">
                      New
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Modern Apartment {item}</p>
                    <p className="text-sm text-gray-600">{item * 12} views this month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">KSH {(item * 25000).toLocaleString()}/month</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +{item * 5}% interest
                    </p>
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

export default PropertyOwnerMainDashboard;

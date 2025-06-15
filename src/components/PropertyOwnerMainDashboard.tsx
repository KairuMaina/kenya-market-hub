
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Eye, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Plus
} from 'lucide-react';

const PropertyOwnerMainDashboard = () => {
  const quickStats = [
    { title: 'Active Listings', value: '12', icon: Building, color: 'green' },
    { title: 'Total Views', value: '1,847', icon: Eye, color: 'blue' },
    { title: 'Inquiries', value: '23', icon: MessageSquare, color: 'orange' },
    { title: 'Viewings Scheduled', value: '8', icon: Calendar, color: 'purple' }
  ];

  const recentInquiries = [
    { id: 1, property: 'Modern Apartment - Westlands', inquirer: 'John Doe', type: 'rent', date: '2 hours ago' },
    { id: 2, property: '3BR House - Karen', inquirer: 'Jane Smith', type: 'sale', date: '5 hours ago' },
    { id: 3, property: 'Studio - Kilimani', inquirer: 'Mike Johnson', type: 'rent', date: '1 day ago' }
  ];

  const topPerformingProperties = [
    { id: 1, title: 'Modern Apartment - Westlands', views: 234, inquiries: 12, type: 'rent' },
    { id: 2, title: '3BR House - Karen', views: 189, inquiries: 8, type: 'sale' },
    { id: 3, title: 'Luxury Villa - Runda', views: 156, inquiries: 15, type: 'sale' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Property Management Dashboard</h1>
        <p className="text-green-100">Manage your properties and grow your real estate business</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
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
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Add Property</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Inquiries</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule Viewings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{inquiry.property}</h4>
                    <p className="text-sm text-gray-600">from {inquiry.inquirer}</p>
                    <p className="text-xs text-gray-500">{inquiry.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={inquiry.type === 'rent' ? 'default' : 'secondary'}>
                      {inquiry.type}
                    </Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingProperties.map((property) => (
                <div key={property.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{property.title}</h4>
                    <Badge variant={property.type === 'rent' ? 'default' : 'secondary'}>
                      {property.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{property.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{property.inquiries} inquiries</span>
                    </div>
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

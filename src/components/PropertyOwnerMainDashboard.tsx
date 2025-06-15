
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
import { useProperties } from '@/hooks/useProperties';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const PropertyOwnerMainDashboard = () => {
  const navigate = useNavigate();
  const { data: properties, isLoading: propertiesLoading } = useProperties();

  const { data: inquiries } = useQuery({
    queryKey: ['property-inquiries-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('property_inquiries')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: viewings } = useQuery({
    queryKey: ['property-viewings-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('property_viewings')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: recentInquiries } = useQuery({
    queryKey: ['recent-property-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          properties (title, listing_type)
        `)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const totalViews = properties?.reduce((sum, property) => sum + property.views_count, 0) || 0;

  const quickStats = [
    { 
      title: 'Active Listings', 
      value: propertiesLoading ? '...' : properties?.length.toString() || '0', 
      icon: Building, 
      color: 'green' 
    },
    { 
      title: 'Total Views', 
      value: propertiesLoading ? '...' : totalViews.toLocaleString(), 
      icon: Eye, 
      color: 'blue' 
    },
    { 
      title: 'Inquiries', 
      value: inquiries?.toString() || '0', 
      icon: MessageSquare, 
      color: 'orange' 
    },
    { 
      title: 'Viewings Scheduled', 
      value: viewings?.toString() || '0', 
      icon: Calendar, 
      color: 'purple' 
    }
  ];

  const topPerformingProperties = properties
    ?.sort((a, b) => b.views_count - a.views_count)
    .slice(0, 3)
    .map(property => ({
      id: property.id,
      title: property.title,
      views: property.views_count,
      inquiries: 0, // This would need to be calculated from inquiries table
      type: property.listing_type
    })) || [];

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
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/property-owner/properties/add')}
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Add Property</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/property-owner/analytics')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/property-owner/inquiries')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Inquiries</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/property-owner/viewings')}
            >
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
              {recentInquiries?.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{inquiry.properties?.title}</h4>
                    <p className="text-sm text-gray-600">from {inquiry.inquirer_name}</p>
                    <p className="text-xs text-gray-500">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={inquiry.properties?.listing_type === 'rent' ? 'default' : 'secondary'}>
                      {inquiry.properties?.listing_type}
                    </Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No recent inquiries</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingProperties?.map((property) => (
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
              )) || (
                <p className="text-gray-500 text-center py-4">No properties listed yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyOwnerMainDashboard;

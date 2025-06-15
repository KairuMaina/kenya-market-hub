
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Eye, MessageSquare, Calendar, DollarSign } from 'lucide-react';

const PropertyOwnerAnalytics = () => {
  const analyticsData = [
    { title: 'Total Views', value: '1,847', icon: Eye, color: 'blue', change: '+12.5%' },
    { title: 'Inquiries', value: '234', icon: MessageSquare, color: 'green', change: '+8.3%' },
    { title: 'Viewings Scheduled', value: '89', icon: Calendar, color: 'purple', change: '+15.2%' },
    { title: 'Conversion Rate', value: '23.4%', icon: TrendingUp, color: 'orange', change: '+2.1%' }
  ];

  const topPerformingProperties = [
    { name: 'Modern Apartment - Westlands', views: 456, inquiries: 34, conversions: 8 },
    { name: '3BR House - Karen', views: 389, inquiries: 28, conversions: 6 },
    { name: 'Luxury Villa - Runda', views: 321, inquiries: 45, conversions: 12 },
    { name: 'Studio - Kilimani', views: 267, inquiries: 19, conversions: 4 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Property Analytics
        </h1>
        <p className="text-green-100 mt-2">Track your property performance and market insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Properties with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingProperties.map((property, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium mb-2">{property.name}</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{property.views}</div>
                      <div className="text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{property.inquiries}</div>
                      <div className="text-gray-500">Inquiries</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">{property.conversions}</div>
                      <div className="text-gray-500">Conversions</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Property market trends and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Average Days on Market</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">42 days</p>
                <p className="text-sm text-gray-600">3 days faster than area average</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">Average Price per sqm</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">KSh 95,000</p>
                <p className="text-sm text-gray-600">8% above market average</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium">Inquiry Conversion Rate</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">23.4%</p>
                <p className="text-sm text-gray-600">Above industry standard (18%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyOwnerAnalytics;

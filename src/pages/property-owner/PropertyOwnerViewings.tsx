
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react';

const PropertyOwnerViewings = () => {
  const upcomingViewings = [
    {
      id: 1,
      property: 'Modern Apartment - Westlands',
      viewer: 'John Doe',
      email: 'john@example.com',
      phone: '+254 700 123456',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'confirmed'
    },
    {
      id: 2,
      property: '3BR House - Karen',
      viewer: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254 700 654321',
      date: '2024-01-21',
      time: '2:00 PM',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Property Viewings
        </h1>
        <p className="text-green-100 mt-2">Manage scheduled property viewings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Viewings</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total This Month</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upcoming Viewings</CardTitle>
          <CardDescription>Manage your scheduled property viewings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingViewings.map((viewing) => (
              <Card key={viewing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{viewing.property}</h3>
                        <Badge className={getStatusColor(viewing.status)}>
                          {viewing.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span><strong>Viewer:</strong> {viewing.viewer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span><strong>Date:</strong> {viewing.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span><strong>Time:</strong> {viewing.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{viewing.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{viewing.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="destructive">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyOwnerViewings;

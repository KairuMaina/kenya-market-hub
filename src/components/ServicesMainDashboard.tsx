
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench
} from 'lucide-react';

const ServicesMainDashboard = () => {
  const stats = [
    {
      title: 'Active Bookings',
      value: '12',
      change: '+2 from yesterday',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Total Clients',
      value: '48',
      change: '+6 this month',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: 'KSh 45,000',
      change: '+15% from last month',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '★★★★★',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const recentBookings = [
    {
      id: '001',
      client: 'John Doe',
      service: 'Plumbing Repair',
      date: 'Today, 2:00 PM',
      status: 'confirmed',
      amount: 'KSh 2,500'
    },
    {
      id: '002',
      client: 'Jane Smith',
      service: 'Electrical Work',
      date: 'Tomorrow, 10:00 AM',
      status: 'pending',
      amount: 'KSh 3,500'
    },
    {
      id: '003',
      client: 'Mike Johnson',
      service: 'Carpentry',
      date: 'Dec 17, 3:30 PM',
      status: 'completed',
      amount: 'KSh 5,000'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Dashboard</h1>
          <p className="text-gray-600">Manage your professional services and client bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <Wrench className="h-4 w-4 mr-2" />
          New Service
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{booking.client}</h4>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                    <p className="text-xs text-gray-500">{booking.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">View Calendar</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Clients</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <DollarSign className="h-6 w-6 mb-2" />
                <span className="text-sm">View Earnings</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Star className="h-6 w-6 mb-2" />
                <span className="text-sm">Reviews</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesMainDashboard;

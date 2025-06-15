
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Navigation, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  DollarSign,
  Filter,
  Search,
  Car,
  Users
} from 'lucide-react';

const DriverRideManagement = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const rides = [
    {
      id: 'R001',
      passenger: 'John Doe',
      phone: '+254 712 345 678',
      pickup: 'Westlands Shopping Mall',
      destination: 'Karen Country Club',
      fare: 450,
      status: 'active',
      scheduledTime: '2:30 PM',
      distance: '12.5 km',
      estimatedDuration: '25 min'
    },
    {
      id: 'R002',
      passenger: 'Sarah Wilson',
      phone: '+254 701 234 567',
      pickup: 'JKIA Terminal 1A',
      destination: 'Kilimani',
      fare: 800,
      status: 'scheduled',
      scheduledTime: '4:00 PM',
      distance: '18.2 km',
      estimatedDuration: '35 min'
    },
    {
      id: 'R003',
      passenger: 'Mike Johnson',
      phone: '+254 722 456 789',
      pickup: 'CBD - Kencom',
      destination: 'Eastlands - Donholm',
      fare: 320,
      status: 'completed',
      scheduledTime: '1:15 PM',
      distance: '8.7 km',
      estimatedDuration: '20 min'
    },
    {
      id: 'R004',
      passenger: 'Jane Smith',
      phone: '+254 733 567 890',
      pickup: 'Nakumatt Junction',
      destination: 'Ngong Road',
      fare: 280,
      status: 'pending',
      scheduledTime: '5:30 PM',
      distance: '6.3 km',
      estimatedDuration: '15 min'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Car className="h-4 w-4" />;
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <Users className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredRides = rides.filter(ride => {
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    const matchesSearch = ride.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Ride Management</h1>
        <p className="text-gray-600">Manage your current and upcoming rides</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search rides by passenger, pickup, or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rides List */}
      <div className="grid gap-4">
        {filteredRides.map((ride) => (
          <Card key={ride.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(ride.status)} text-white`}>
                    {getStatusIcon(ride.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{ride.passenger}</h3>
                    <p className="text-sm text-gray-600">Ride #{ride.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {ride.status}
                  </Badge>
                  <span className="text-lg font-bold text-green-600">
                    KSH {ride.fare}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-gray-600">{ride.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-gray-600">{ride.destination}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scheduled:</span>
                    <span className="text-sm font-medium">{ride.scheduledTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="text-sm font-medium">{ride.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{ride.estimatedDuration}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {ride.status === 'active' && (
                  <>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </>
                )}
                
                {ride.status === 'scheduled' && (
                  <>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm">
                      Start Ride
                    </Button>
                  </>
                )}
                
                {ride.status === 'pending' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Accept Ride
                    </Button>
                    <Button size="sm" variant="outline">
                      Decline
                    </Button>
                  </>
                )}

                {ride.status === 'completed' && (
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRides.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any rides at the moment.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DriverRideManagement;

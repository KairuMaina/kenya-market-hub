
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  DollarSign,
  Calendar,
  Navigation
} from 'lucide-react';

const DriverHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const rideHistory = [
    {
      id: 'R001',
      passenger: 'John Doe',
      pickup: 'Westlands Shopping Mall',
      destination: 'Karen Country Club',
      fare: 450,
      distance: '12.5 km',
      duration: '25 min',
      status: 'completed',
      rating: 5,
      date: '2024-01-15',
      time: '14:30'
    },
    {
      id: 'R002',
      passenger: 'Sarah Wilson',
      pickup: 'JKIA Terminal 1A',
      destination: 'Kilimani',
      fare: 800,
      distance: '18.2 km',
      duration: '35 min',
      status: 'completed',
      rating: 5,
      date: '2024-01-15',
      time: '16:00'
    },
    {
      id: 'R003',
      passenger: 'Mike Johnson',
      pickup: 'CBD - Kencom',
      destination: 'Eastlands - Donholm',
      fare: 320,
      distance: '8.7 km',
      duration: '20 min',
      status: 'completed',
      rating: 4,
      date: '2024-01-14',
      time: '13:15'
    },
    {
      id: 'R004',
      passenger: 'Jane Smith',
      pickup: 'Nakumatt Junction',
      destination: 'Ngong Road',
      fare: 280,
      distance: '6.3 km',
      duration: '15 min',
      status: 'cancelled',
      date: '2024-01-14',
      time: '17:30'
    },
    {
      id: 'R005',
      passenger: 'David Brown',
      pickup: 'Sarit Centre',
      destination: 'Gigiri',
      fare: 520,
      distance: '14.8 km',
      duration: '28 min',
      status: 'completed',
      rating: 5,
      date: '2024-01-13',
      time: '11:45'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredRides = rideHistory.filter(ride => {
    const matchesSearch = ride.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    const matchesDate = dateFilter === 'all' || ride.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalEarnings = filteredRides
    .filter(ride => ride.status === 'completed')
    .reduce((sum, ride) => sum + ride.fare, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ride History</h1>
        <p className="text-gray-600">View and manage your past rides</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rides</p>
                <p className="text-2xl font-bold">{filteredRides.length}</p>
              </div>
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Rides</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredRides.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">KSH {totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by passenger, pickup, or destination..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2024-01-15">Today</SelectItem>
                  <SelectItem value="2024-01-14">Yesterday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ride History List */}
      <div className="space-y-4">
        {filteredRides.map((ride) => (
          <Card key={ride.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(ride.status)} text-white`}>
                    <Navigation className="h-4 w-4" />
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
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="text-sm font-medium">{ride.date} at {ride.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="text-sm font-medium">{ride.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{ride.duration}</span>
                  </div>
                  {ride.rating && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <div className="flex">
                        {[...Array(ride.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                {ride.status === 'completed' && (
                  <Button size="sm" variant="outline">
                    <Navigation className="h-4 w-4 mr-1" />
                    View Route
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
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t completed any rides yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DriverHistory;

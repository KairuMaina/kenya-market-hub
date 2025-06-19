
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  DollarSign, 
  Navigation, 
  Clock, 
  Star,
  Users
} from 'lucide-react';
import { useDriverDashboardData, useMyDriverProfile } from '@/hooks/useDriver';
import DriverStatusToggle from './DriverStatusToggle';
import { timeAgo } from '@/utils/time';
import { useNavigate } from 'react-router-dom';

const DriverMainDashboard = () => {
  const { data, isLoading, error } = useDriverDashboardData();
  const { data: profile, isLoading: profileLoading } = useMyDriverProfile();
  const navigate = useNavigate();

  if (isLoading || profileLoading) {
    return (
       <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  if (error || !data || !profile) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Could not load driver dashboard data.</p>
        <p className="text-gray-500 text-sm mt-2">
          {error?.message || 'Please ensure your driver profile is fully set up.'}
        </p>
      </div>
    );
  }

  const { stats, activeRides, recentRides } = data;

  const quickStats = [
    { title: 'Today\'s Earnings', value: `KSH ${stats.todaysEarnings.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { title: 'Rides Today', value: stats.ridesCompletedToday.toString(), icon: Car, color: 'blue' },
    { title: 'Online Time', value: 'N/A', icon: Clock, color: 'orange' },
    { title: 'Your Rating', value: (stats.averageRating || 0).toFixed(1), icon: Star, color: 'yellow' }
  ];

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
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

          {activeRides.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Ride</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRides.map((ride) => (
                    <div key={ride.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{(ride.profiles as any)?.full_name || 'Passenger'}</h4>
                          <p className="text-sm text-gray-600">{ride.pickup_address} → {ride.destination_address}</p>
                          <p className="text-sm font-medium text-green-600">~KSH {ride.fare || ride.estimated_fare || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={ride.status === 'accepted' ? 'default' : 'secondary'} className="capitalize">
                          {ride.status === 'accepted' ? 'To Pickup' : ride.status.replace('_', ' ')}
                        </Badge>
                        <Button size="sm" onClick={() => navigate('/driver/rides')}>
                          <Navigation className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRides.length > 0 ? recentRides.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{(ride.profiles as any)?.full_name || 'Passenger'}</h4>
                        <span className="text-sm font-medium text-green-600">KSH {ride.fare || ride.actual_fare || 0}</span>
                      </div>
                      <p className="text-sm text-gray-600">{ride.pickup_address} → {ride.destination_address}</p>
                      <p className="text-xs text-gray-500">{ride.completed_at ? timeAgo(ride.completed_at) : timeAgo(ride.updated_at)}</p>
                    </div>
                    {ride.rating && ride.rating > 0 && (
                      <div className="flex items-center ml-3">
                        {[...Array(ride.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                )) : <p className="text-sm text-gray-500">No recent rides.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <DriverStatusToggle />
          <Card>
            <CardHeader>
              <CardTitle>Your Vehicle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Car className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium">{profile.vehicle_make} {profile.vehicle_model}</p>
                  <p className="text-sm text-gray-600">{profile.license_plate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverMainDashboard;

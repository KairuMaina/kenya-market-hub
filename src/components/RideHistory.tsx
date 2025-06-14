
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Clock, Star } from 'lucide-react';
import { useRides } from '@/hooks/useRides';
import { format } from 'date-fns';

const RideHistory = () => {
  const { userRides, isLoading } = useRides();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading your rides...</div>
        </CardContent>
      </Card>
    );
  }

  if (!userRides || userRides.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No rides yet. Book your first ride!
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Your Rides</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userRides.map((ride) => (
          <div key={ride.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="h-4 w-4 text-gray-600" />
                <span className="font-medium capitalize">{ride.vehicle_type}</span>
              </div>
              <Badge className={getStatusColor(ride.status)}>
                {ride.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">From: {ride.pickup_address}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">To: {ride.destination_address}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{format(new Date(ride.created_at), 'MMM dd, yyyy HH:mm')}</span>
              <div className="flex items-center space-x-4">
                {ride.actual_fare && (
                  <span className="font-medium">KSh {ride.actual_fare}</span>
                )}
                {ride.estimated_fare && !ride.actual_fare && (
                  <span className="font-medium">Est. KSh {ride.estimated_fare}</span>
                )}
                {ride.status === 'completed' && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>Rate</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RideHistory;

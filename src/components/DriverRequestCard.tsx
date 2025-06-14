
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Car, Bike } from 'lucide-react';
import { useRespondToRideRequest } from '@/hooks/useDriverMatching';

interface DriverRequestCardProps {
  request: {
    id: string;
    ride_id: string;
    distance_km: number;
    estimated_pickup_minutes: number;
    expires_at: string;
    rides: {
      id: string;
      pickup_address: string;
      destination_address: string;
      estimated_fare: number;
      vehicle_type: 'taxi' | 'motorbike';
    };
  };
}

const DriverRequestCard: React.FC<DriverRequestCardProps> = ({ request }) => {
  const respondToRequest = useRespondToRideRequest();
  
  const timeLeft = Math.max(0, Math.floor((new Date(request.expires_at).getTime() - Date.now()) / 1000));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleAccept = () => {
    respondToRequest.mutate({
      requestId: request.id,
      response: 'accepted',
      rideId: request.ride_id
    });
  };

  const handleDecline = () => {
    respondToRequest.mutate({
      requestId: request.id,
      response: 'declined',
      rideId: request.ride_id
    });
  };

  if (timeLeft === 0) {
    return null; // Don't show expired requests
  }

  return (
    <Card className="shadow-lg border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
            {request.rides.vehicle_type === 'taxi' ? (
              <Car className="h-5 w-5 text-orange-600" />
            ) : (
              <Bike className="h-5 w-5 text-orange-600" />
            )}
            New Ride Request
          </CardTitle>
          <Badge variant="destructive" className="animate-pulse">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Route Information */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-green-700">Pickup</p>
              <p className="text-sm text-gray-700">{request.rides.pickup_address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-red-700">Destination</p>
              <p className="text-sm text-gray-700">{request.rides.destination_address}</p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-600 font-medium">Fare</p>
            <p className="font-bold text-green-700">
              KSh {request.rides.estimated_fare.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <MapPin className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-600 font-medium">Distance</p>
            <p className="font-bold text-blue-700">{request.distance_km} km</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Clock className="h-4 w-4 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-purple-600 font-medium">ETA</p>
            <p className="font-bold text-purple-700">{request.estimated_pickup_minutes} min</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={handleDecline}
            disabled={respondToRequest.isPending}
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
          >
            Decline
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={respondToRequest.isPending}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {respondToRequest.isPending ? 'Accepting...' : 'Accept Ride'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverRequestCard;

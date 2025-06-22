
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Navigation } from 'lucide-react';
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
      vehicle_type: string;
    };
  };
}

const DriverRequestCard: React.FC<DriverRequestCardProps> = ({ request }) => {
  const respondToRequest = useRespondToRideRequest();

  const handleAccept = () => {
    respondToRequest.mutate({ requestId: request.id, response: 'accepted' });
  };

  const handleDecline = () => {
    respondToRequest.mutate({ requestId: request.id, response: 'declined' });
  };

  const timeLeft = Math.max(0, Math.floor((new Date(request.expires_at).getTime() - Date.now()) / 1000));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="shadow-lg border-l-4 border-l-orange-500 hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5 text-orange-600" />
            New Ride Request
          </CardTitle>
          <Badge variant="outline" className="text-red-600 border-red-300">
            {minutes}:{seconds.toString().padStart(2, '0')} left
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-700">Pickup</p>
                <p className="text-sm text-gray-600">{request.rides.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">Destination</p>
                <p className="text-sm text-gray-600">{request.rides.destination_address}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">~{request.estimated_pickup_minutes} min pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">KSh {request.rides.estimated_fare}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {request.rides.vehicle_type === 'taxi' ? 'Taxi' : 'Motorbike'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {request.distance_km.toFixed(1)} km away
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <Button
            onClick={handleDecline}
            variant="outline"
            className="flex-1"
            disabled={respondToRequest.isPending}
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            disabled={respondToRequest.isPending}
          >
            {respondToRequest.isPending ? 'Responding...' : 'Accept Ride'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverRequestCard;

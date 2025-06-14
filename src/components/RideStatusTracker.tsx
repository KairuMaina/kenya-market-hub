
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Car, CheckCircle, AlertCircle } from 'lucide-react';
import { useRideStatusUpdates } from '@/hooks/useDriverMatching';

interface RideStatusTrackerProps {
  ride: {
    id: string;
    status: string;
    pickup_address: string;
    destination_address: string;
    estimated_fare: number;
    vehicle_type: 'taxi' | 'motorbike';
    created_at: string;
    accepted_at?: string;
    started_at?: string;
    completed_at?: string;
  };
}

const RideStatusTracker: React.FC<RideStatusTrackerProps> = ({ ride }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Enable real-time updates for this ride
  useRideStatusUpdates(ride.id);

  useEffect(() => {
    const interval = setInterval(() => {
      const startTime = new Date(ride.accepted_at || ride.created_at);
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [ride.accepted_at, ride.created_at]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusInfo = () => {
    switch (ride.status) {
      case 'requested':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <AlertCircle className="h-4 w-4" />,
          message: 'Searching for nearby drivers...',
          description: 'We\'re finding the best driver for your trip'
        };
      case 'accepted':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Car className="h-4 w-4" />,
          message: 'Driver assigned and on the way',
          description: 'Your driver is heading to the pickup location'
        };
      case 'in_progress':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <MapPin className="h-4 w-4" />,
          message: 'Trip in progress',
          description: 'Enjoy your ride to the destination'
        };
      case 'completed':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <CheckCircle className="h-4 w-4" />,
          message: 'Trip completed',
          description: 'Thank you for riding with us!'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="h-4 w-4" />,
          message: 'Unknown status',
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800">Trip Status</CardTitle>
          <Badge className={statusInfo.color}>
            {statusInfo.icon}
            <span className="ml-1">{ride.status.replace('_', ' ').toUpperCase()}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Message */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <p className="font-medium text-blue-900">{statusInfo.message}</p>
          <p className="text-sm text-blue-700 mt-1">{statusInfo.description}</p>
        </div>

        {/* Route Information */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-green-700">From</p>
              <p className="text-sm text-gray-700">{ride.pickup_address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-red-700">To</p>
              <p className="text-sm text-gray-700">{ride.destination_address}</p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 font-medium">Estimated Fare</p>
            <p className="font-bold text-green-700">
              KSh {ride.estimated_fare.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-medium flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              Time Elapsed
            </p>
            <p className="font-bold text-purple-700">{formatTime(timeElapsed)}</p>
          </div>
        </div>

        {/* Live Updates Notice */}
        {(ride.status === 'requested' || ride.status === 'accepted') && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800 text-center">
              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-ping mr-2"></span>
              Live updates enabled - Status will update automatically
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideStatusTracker;

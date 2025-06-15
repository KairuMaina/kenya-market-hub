
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDriverRideHistory } from '@/hooks/useDriver';
import { timeAgo } from '@/utils/time';
import { Car, Star, XCircle, CheckCircle, Calendar, MapPin, DollarSign } from 'lucide-react';

const RideHistoryCard = ({ ride }: { ride: any }) => {
  const isCompleted = ride.status === 'completed';
  const statusIcon = isCompleted ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  );
  
  const statusColor = isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{ride.profiles?.full_name || 'Passenger'}</h4>
            <Badge className={statusColor}>
              {statusIcon}
              <span className="ml-1 capitalize">{ride.status}</span>
            </Badge>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{ride.pickup_address} to {ride.destination_address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{timeAgo(ride.completed_at || ride.cancelled_at || ride.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex md:flex-col items-end md:items-center justify-between md:justify-center gap-2 md:border-l md:pl-4">
          {isCompleted && ride.actual_fare && (
            <div className="flex items-center gap-2 text-green-600">
              <DollarSign className="h-5 w-5" />
              <span className="font-bold text-lg">{ride.actual_fare.toLocaleString()}</span>
            </div>
          )}
          {isCompleted && ride.rating && (
            <div className="flex items-center gap-1">
              {[...Array(ride.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
              {[...Array(5 - ride.rating)].map((_, i) => (
                <Star key={i + ride.rating} className="h-4 w-4 text-gray-300" />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const DriverHistory = () => {
  const { data: rideHistory, isLoading, error } = useDriverRideHistory();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading Ride History...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Could not load ride history.</p>
        <p className="text-gray-500 text-sm mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ride History</h1>
        <p className="text-gray-600">A log of all your past rides</p>
      </div>
      
      <div className="space-y-4">
        {rideHistory && rideHistory.length > 0 ? (
          rideHistory.map((ride) => <RideHistoryCard key={ride.id} ride={ride} />)
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No rides yet</h3>
              <p className="mt-1 text-sm text-gray-500">Your completed and cancelled rides will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DriverHistory;

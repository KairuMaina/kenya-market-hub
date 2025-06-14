
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, MapPin, Star } from 'lucide-react';
import { EnhancedRide } from '@/hooks/useEnhancedRides';

interface RideHistoryTabProps {
  rides: EnhancedRide[] | undefined;
  isLoading: boolean;
}

const RideHistoryTab = ({ rides, isLoading }: RideHistoryTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'accepted': return 'secondary';
      case 'requested': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <TabsContent value="history" className="p-6 pt-0 space-y-4">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading your rides...</p>
        </div>
      ) : rides && rides.length > 0 ? (
        <div className="grid gap-4">
          {rides.map((ride) => (
            <Card key={ride.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md card-hover">
              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                    <Car className="h-5 w-5 text-orange-600" />
                    {ride.vehicle_type === 'taxi' ? 'Taxi Ride' : 'Motorbike Ride'}
                  </CardTitle>
                  <Badge variant={getStatusColor(ride.status)} className="shadow-sm">
                    {formatStatus(ride.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {/* Ride Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Fare</p>
                    <p className="font-bold text-green-700">
                      KSh {(ride.actual_fare || ride.estimated_fare || 0).toLocaleString()}
                    </p>
                  </div>
                  {ride.distance_km && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">Distance</p>
                      <p className="font-bold text-blue-700">{ride.distance_km.toFixed(1)} km</p>
                    </div>
                  )}
                  {ride.duration_minutes && (
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600 font-medium">Duration</p>
                      <p className="font-bold text-purple-700 flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ride.duration_minutes} min
                      </p>
                    </div>
                  )}
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600 font-medium">Date</p>
                    <p className="font-bold text-orange-700">
                      {new Date(ride.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Rating (for completed rides) */}
                {ride.status === 'completed' && ride.rating && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 bg-yellow-50 p-3 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700">{ride.rating}/5</span>
                    {ride.review && (
                      <span className="text-sm text-yellow-600">- {ride.review}</span>
                    )}
                  </div>
                )}

                {/* Driver Matching Status (for requested rides) */}
                {ride.status === 'requested' && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Finding Driver...
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      We're looking for available drivers in your area
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4">
              <Car className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-gray-600 font-medium mb-2">No rides yet</p>
            <p className="text-sm text-gray-500">
              Book your first ride to get started
            </p>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

export default RideHistoryTab;

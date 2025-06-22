
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, DollarSign, Star, Clock } from 'lucide-react';
import { useEnhancedRides } from '@/hooks/useEnhancedRides';
import RideStatusTracker from '@/components/RideStatusTracker';

const RideHistoryTab = () => {
  const { data: rides, isLoading } = useEnhancedRides();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'accepted':
        return 'bg-yellow-500';
      case 'requested':
        return 'bg-orange-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <TabsContent value="history" className="p-6 pt-0">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2">Loading your ride history...</span>
        </div>
      </TabsContent>
    );
  }

  if (!rides || rides.length === 0) {
    return (
      <TabsContent value="history" className="p-6 pt-0">
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">No rides yet</p>
            <p className="text-sm text-gray-500">Your ride history will appear here once you book your first ride</p>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="history" className="p-6 pt-0 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Ride History</h2>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          {rides.length} rides
        </Badge>
      </div>

      {rides.map((ride) => (
        <Card key={ride.id} className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                {new Date(ride.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardTitle>
              <Badge className={`${getStatusColor(ride.status)} text-white`}>
                {ride.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Live Status Tracker for Active Rides */}
            {(ride.status === 'requested' || ride.status === 'accepted' || ride.status === 'in_progress') && (
              <RideStatusTracker 
                ride={{
                  id: ride.id,
                  status: ride.status,
                  pickup_address: ride.pickup_address,
                  destination_address: ride.destination_address,
                  estimated_fare: ride.estimated_fare,
                  vehicle_type: (ride.vehicle_type as 'taxi' | 'motorbike') || 'taxi',
                  created_at: ride.created_at,
                  accepted_at: ride.created_at,
                  started_at: ride.created_at,
                  completed_at: ride.completed_at
                }}
              />
            )}

            {/* Route Information */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-green-700">Pickup</p>
                  <p className="text-sm text-gray-700">{ride.pickup_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-red-700">Destination</p>
                  <p className="text-sm text-gray-700">{ride.destination_address}</p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-600 font-medium">
                  {ride.status === 'completed' ? 'Final Fare' : 'Estimated'}
                </p>
                <p className="font-bold text-green-700">
                  KSh {(ride.actual_fare || ride.estimated_fare).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-600 font-medium">Vehicle</p>
                <p className="font-bold text-blue-700 capitalize">{ride.vehicle_type}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-purple-600 font-medium">Distance</p>
                <p className="font-bold text-purple-700">5 km</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-orange-600 font-medium">Duration</p>
                <p className="font-bold text-orange-700">15 min</p>
              </div>
            </div>

            {/* Rating and Review */}
            {ride.status === 'completed' && (
              <div className="border-t pt-4">
                {ride.rating ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">Your Rating: {ride.rating}/5</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Rebook
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Rate your experience</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Rate Trip
                      </Button>
                      <Button variant="outline" size="sm">
                        Rebook
                      </Button>
                    </div>
                  </div>
                )}
                {ride.review && (
                  <p className="text-sm text-gray-600 mt-2 italic">"{ride.review}"</p>
                )}
              </div>
            )}

            {/* Commission Info for Completed Rides */}
            {ride.status === 'completed' && ride.actual_fare && (
              <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-700">
                <p className="font-medium">Fare Breakdown:</p>
                <div className="flex justify-between">
                  <span>Total Fare:</span>
                  <span>KSh {ride.actual_fare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Commission (5%):</span>
                  <span>KSh {(ride.actual_fare * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Driver Earnings:</span>
                  <span>KSh {(ride.actual_fare * 0.95).toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </TabsContent>
  );
};

export default RideHistoryTab;

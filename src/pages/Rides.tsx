
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, MapPin, Star, Navigation } from 'lucide-react';
import EnhancedRideBooking from '@/components/EnhancedRideBooking';
import { useEnhancedRides, useRideMatchingRequests } from '@/hooks/useEnhancedRides';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Rides = () => {
  const { user, loading } = useAuth();
  const { data: rides, isLoading } = useEnhancedRides();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const { data: matchingRequests } = useRideMatchingRequests(selectedRideId || undefined);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Navigation className="h-8 w-8" />
              Ride Services
            </h1>
            <p className="text-muted-foreground">
              Book rides across Kenya with our network of verified drivers
            </p>
          </div>
        </div>

        <Tabs defaultValue="book" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="book">Book a Ride</TabsTrigger>
            <TabsTrigger value="history">My Rides</TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-4">
            <EnhancedRideBooking 
              onRideBooked={(rideId) => {
                setSelectedRideId(rideId);
                // Optionally switch to history tab
              }}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading your rides...</div>
            ) : rides && rides.length > 0 ? (
              <div className="grid gap-4">
                {rides.map((ride) => (
                  <Card key={ride.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          {ride.vehicle_type === 'taxi' ? 'Taxi Ride' : 'Motorbike Ride'}
                        </CardTitle>
                        <Badge variant={getStatusColor(ride.status)}>
                          {formatStatus(ride.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Route Information */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium text-sm">From</p>
                            <p className="text-sm text-muted-foreground">{ride.pickup_address}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-red-600 mt-1" />
                          <div>
                            <p className="font-medium text-sm">To</p>
                            <p className="text-sm text-muted-foreground">{ride.destination_address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Ride Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Fare</p>
                          <p className="font-medium">
                            KSh {(ride.actual_fare || ride.estimated_fare || 0).toLocaleString()}
                          </p>
                        </div>
                        {ride.distance_km && (
                          <div>
                            <p className="text-xs text-muted-foreground">Distance</p>
                            <p className="font-medium">{ride.distance_km.toFixed(1)} km</p>
                          </div>
                        )}
                        {ride.duration_minutes && (
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ride.duration_minutes} min
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {new Date(ride.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Rating (for completed rides) */}
                      {ride.status === 'completed' && ride.rating && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{ride.rating}/5</span>
                          {ride.review && (
                            <span className="text-sm text-muted-foreground">- {ride.review}</span>
                          )}
                        </div>
                      )}

                      {/* Driver Matching Status (for requested rides) */}
                      {ride.status === 'requested' && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Finding Driver...</p>
                          <p className="text-xs text-blue-700">
                            We're looking for available drivers in your area
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">No rides yet</p>
                  <p className="text-sm text-muted-foreground">
                    Book your first ride to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Rides;

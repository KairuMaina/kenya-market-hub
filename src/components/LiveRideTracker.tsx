
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Car, Navigation, Phone, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LiveRideTrackerProps {
  rideId: string;
}

interface DriverLocation {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

const LiveRideTracker: React.FC<LiveRideTrackerProps> = ({ rideId }) => {
  const { user } = useAuth();
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [rideData, setRideData] = useState<any>(null);
  const [driverData, setDriverData] = useState<any>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial ride data
    const fetchRideData = async () => {
      const { data: ride } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single();

      if (ride && ride.driver_id) {
        setRideData(ride);

        // Fetch driver information
        const { data: driver } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', ride.driver_id)
          .single();

        setDriverData(driver);
      }
    };

    fetchRideData();

    // Set up real-time location tracking
    const locationChannel = supabase
      .channel(`driver-location-${rideId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=eq.${rideData?.driver_id}`
        },
        (payload) => {
          const location = payload.new;
          if (location.location) {
            // Parse PostGIS point format
            const coordinates = location.location.replace('(', '').replace(')', '').split(',');
            setDriverLocation({
              lng: parseFloat(coordinates[0]),
              lat: parseFloat(coordinates[1]),
              heading: location.heading,
              speed: location.speed,
              timestamp: location.timestamp
            });

            // Calculate estimated arrival time (simplified)
            if (rideData?.pickup_location) {
              const distance = calculateDistance(
                { lat: parseFloat(coordinates[1]), lng: parseFloat(coordinates[0]) },
                { 
                  lat: parseFloat(rideData.pickup_location.split(',')[1]), 
                  lng: parseFloat(rideData.pickup_location.split(',')[0]) 
                }
              );
              
              // Estimate 2-3 minutes per km in city traffic
              setEstimatedArrival(Math.round(distance * 2.5));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(locationChannel);
    };
  }, [rideId, rideData?.driver_id]);

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (!rideData || !driverData) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2">Loading ride details...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-blue-900">Live Ride Tracking</CardTitle>
          <Badge className="bg-green-500 text-white animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            LIVE
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Driver Information */}
        <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {driverData.license_number?.charAt(0) || 'D'}
              </div>
              <div>
                <h3 className="font-bold text-lg">{driverData.license_number}</h3>
                <p className="text-gray-600">{driverData.vehicle_make} {driverData.vehicle_model}</p>
                <p className="text-sm text-gray-500">{driverData.license_plate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-500">★</span>
                <span className="font-bold">{driverData.rating || 'N/A'}</span>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {driverData.vehicle_type}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Phone className="h-4 w-4 mr-2" />
              Call Driver
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Live Location Status */}
        {driverLocation && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800 flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Driver Location
              </h4>
              <span className="text-xs text-green-600">
                Updated: {new Date(driverLocation.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {estimatedArrival && (
                <div className="text-center p-3 bg-white rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-blue-600 font-medium">ETA</p>
                  <p className="font-bold text-blue-700">{estimatedArrival} min</p>
                </div>
              )}
              {driverLocation.speed && (
                <div className="text-center p-3 bg-white rounded-lg">
                  <Car className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-purple-600 font-medium">Speed</p>
                  <p className="font-bold text-purple-700">{Math.round(driverLocation.speed)} km/h</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trip Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">Trip Progress</h4>
            <Badge className={
              rideData.status === 'accepted' ? 'bg-yellow-500' :
              rideData.status === 'in_progress' ? 'bg-blue-500' :
              'bg-green-500'
            }>
              {rideData.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-6 h-12 w-0.5 bg-gray-300"></div>
            
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm text-green-700">Pickup Location</p>
                <p className="text-sm text-gray-700">{rideData.pickup_address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm text-red-700">Destination</p>
                <p className="text-sm text-gray-700">{rideData.destination_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Updates Notice */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800 text-center flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
            Real-time tracking active - Location updates every 30 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveRideTracker;

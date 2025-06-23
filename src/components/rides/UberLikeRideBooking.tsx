
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Clock, DollarSign, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Driver {
  id: string;
  distance_km: number;
  estimated_pickup_minutes: number;
  driver_profile?: {
    phone_number: string;
    vehicle_make: string;
    vehicle_model: string;
    license_plate: string;
    rating: number;
  };
}

interface RideBookingData {
  pickup_address: string;
  destination_address: string;
  vehicle_type: 'taxi' | 'motorbike';
  pickup_location?: { lat: number; lng: number };
  destination_location?: { lat: number; lng: number };
}

const UberLikeRideBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<RideBookingData>({
    pickup_address: '',
    destination_address: '',
    vehicle_type: 'taxi'
  });
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const searchForDrivers = async () => {
    if (!bookingData.pickup_address || !bookingData.destination_address) {
      toast({
        title: 'Error',
        description: 'Please enter both pickup and destination addresses',
        variant: 'destructive'
      });
      return;
    }

    setIsSearching(true);
    try {
      // Simulate geocoding for demo (in real app, use Google Maps API)
      const pickupCoords = { lat: -1.2921, lng: 36.8219 }; // Nairobi coords as default
      const destinationCoords = { lat: -1.3021, lng: 36.8319 }; // Slightly different coords for destination
      
      // Update booking data with coordinates
      setBookingData(prev => ({
        ...prev,
        pickup_location: pickupCoords,
        destination_location: destinationCoords
      }));
      
      const { data: drivers, error } = await supabase.rpc('find_nearby_drivers', {
        pickup_lat: pickupCoords.lat,
        pickup_lng: pickupCoords.lng,
        vehicle_type_param: bookingData.vehicle_type,
        radius_km: 10
      });

      if (error) throw error;

      // Transform the response to match our Driver interface
      const transformedDrivers: Driver[] = drivers?.map((driver: any) => ({
        id: driver.driver_id,
        distance_km: driver.distance_km,
        estimated_pickup_minutes: driver.estimated_pickup_minutes
      })) || [];

      setAvailableDrivers(transformedDrivers);
      
      // Calculate estimated fare based on distance
      const baseFare = bookingData.vehicle_type === 'taxi' ? 200 : 150;
      const perKmRate = bookingData.vehicle_type === 'taxi' ? 50 : 30;
      const estimatedDistance = 5; // Default estimate
      setEstimatedFare(baseFare + (estimatedDistance * perKmRate));

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to find nearby drivers',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const bookRide = async () => {
    if (!selectedDriver) {
      toast({
        title: 'Error',
        description: 'Please select a driver',
        variant: 'destructive'
      });
      return;
    }

    if (!bookingData.pickup_location || !bookingData.destination_location) {
      toast({
        title: 'Error',
        description: 'Location data is missing. Please search for drivers again.',
        variant: 'destructive'
      });
      return;
    }

    setIsBooking(true);
    try {
      const { data: ride, error } = await supabase
        .from('rides')
        .insert({
          user_id: user?.id,
          pickup_address: bookingData.pickup_address,
          destination_address: bookingData.destination_address,
          pickup_location: `POINT(${bookingData.pickup_location.lng} ${bookingData.pickup_location.lat})`,
          destination_location: `POINT(${bookingData.destination_location.lng} ${bookingData.destination_location.lat})`,
          vehicle_type: bookingData.vehicle_type,
          estimated_fare: estimatedFare,
          status: 'requested'
        })
        .select()
        .single();

      if (error) throw error;

      // Send ride request to selected driver
      await supabase
        .from('driver_ride_requests')
        .insert({
          ride_id: ride.id,
          driver_id: selectedDriver.id,
          distance_km: selectedDriver.distance_km,
          estimated_pickup_minutes: selectedDriver.estimated_pickup_minutes
        });

      toast({
        title: 'Ride Requested!',
        description: 'Your ride has been requested. Waiting for driver confirmation.',
      });

      // Reset form
      setBookingData({
        pickup_address: '',
        destination_address: '',
        vehicle_type: 'taxi'
      });
      setAvailableDrivers([]);
      setSelectedDriver(null);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book ride',
        variant: 'destructive'
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Book a Ride
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pickup Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  placeholder="Enter pickup address"
                  value={bookingData.pickup_address}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    pickup_address: e.target.value
                  }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                <Input
                  placeholder="Enter destination address"
                  value={bookingData.destination_address}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    destination_address: e.target.value
                  }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Type</label>
            <div className="flex gap-2">
              <Button
                variant={bookingData.vehicle_type === 'taxi' ? 'default' : 'outline'}
                onClick={() => setBookingData(prev => ({ ...prev, vehicle_type: 'taxi' }))}
                className="flex-1"
              >
                <Car className="h-4 w-4 mr-2" />
                Taxi
              </Button>
              <Button
                variant={bookingData.vehicle_type === 'motorbike' ? 'default' : 'outline'}
                onClick={() => setBookingData(prev => ({ ...prev, vehicle_type: 'motorbike' }))}
                className="flex-1"
              >
                🏍️ Motorbike
              </Button>
            </div>
          </div>

          <Button
            onClick={searchForDrivers}
            disabled={isSearching}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {isSearching ? 'Searching...' : 'Find Drivers'}
          </Button>
        </CardContent>
      </Card>

      {/* Available Drivers */}
      {availableDrivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Drivers</CardTitle>
            {estimatedFare > 0 && (
              <Badge className="w-fit bg-green-100 text-green-800">
                <DollarSign className="h-3 w-3 mr-1" />
                Estimated Fare: KSh {estimatedFare}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDriver?.id === driver.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Driver</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {driver.distance_km} km away
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {driver.estimated_pickup_minutes} min pickup
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedDriver && (
              <Button
                onClick={bookRide}
                disabled={isBooking}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
              >
                {isBooking ? 'Booking...' : 'Book Selected Driver'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {availableDrivers.length === 0 && !isSearching && bookingData.pickup_address && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No drivers available in your area. Please try again later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UberLikeRideBooking;

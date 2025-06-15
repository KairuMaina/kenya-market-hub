
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageCircle, MapPin, Clock, Star, Navigation } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: {
    make: string;
    model: string;
    license_plate: string;
    color: string;
  };
  phone: string;
  photo?: string;
}

interface RideTracking {
  id: string;
  status: 'searching' | 'found' | 'pickup' | 'in_progress' | 'completed';
  driver?: Driver;
  pickup_address: string;
  destination_address: string;
  estimated_arrival: number;
  fare: number;
  distance: number;
  duration: number;
}

interface RealTimeTrackingProps {
  rideId: string;
  onRideComplete: () => void;
  onRideCancel: () => void;
}

const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({
  rideId,
  onRideComplete,
  onRideCancel
}) => {
  const [ride, setRide] = useState<RideTracking>({
    id: rideId,
    status: 'searching',
    pickup_address: 'Westlands, Nairobi',
    destination_address: 'JKIA, Nairobi',
    estimated_arrival: 5,
    fare: 1200,
    distance: 25,
    duration: 35
  });

  const [countdown, setCountdown] = useState(5);

  // Simulate ride progression
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Progress to next stage
          setRide(currentRide => {
            switch (currentRide.status) {
              case 'searching':
                return {
                  ...currentRide,
                  status: 'found',
                  driver: {
                    id: '1',
                    name: 'James Mwangi',
                    rating: 4.8,
                    vehicle: {
                      make: 'Toyota',
                      model: 'Corolla',
                      license_plate: 'KCA 123X',
                      color: 'White'
                    },
                    phone: '+254712345678'
                  }
                };
              case 'found':
                return { ...currentRide, status: 'pickup' };
              case 'pickup':
                return { ...currentRide, status: 'in_progress' };
              case 'in_progress':
                return { ...currentRide, status: 'completed' };
              default:
                return currentRide;
            }
          });
          return ride.status === 'searching' ? 3 : ride.status === 'found' ? 2 : 8;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ride.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'searching': return 'bg-yellow-100 text-yellow-800';
      case 'found': return 'bg-blue-100 text-blue-800';
      case 'pickup': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'searching': return 'Finding driver...';
      case 'found': return 'Driver found!';
      case 'pickup': return 'Driver en route';
      case 'in_progress': return 'Trip in progress';
      case 'completed': return 'Trip completed';
      default: return 'Unknown status';
    }
  };

  if (ride.status === 'completed') {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-green-800">Trip Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                KSh {ride.fare.toLocaleString()}
              </div>
              <p className="text-gray-600">Total fare</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-bold">{ride.distance}km</div>
                <div className="text-sm text-gray-600">Distance</div>
              </div>
              <div>
                <div className="font-bold">{ride.duration}min</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div>
                <div className="font-bold flex items-center justify-center">
                  {ride.driver?.rating} <Star className="h-4 w-4 text-yellow-500 ml-1" />
                </div>
                <div className="text-sm text-gray-600">Driver</div>
              </div>
            </div>

            <Button onClick={onRideComplete} className="w-full">
              Rate Your Trip
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Ride</CardTitle>
            <Badge className={getStatusColor(ride.status)}>
              {getStatusText(ride.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Route */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">{ride.pickup_address}</span>
            </div>
            <div className="flex items-center space-x-3 ml-1">
              <div className="w-1 h-8 bg-gray-300"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">{ride.destination_address}</span>
            </div>
          </div>

          {/* Countdown */}
          {ride.status !== 'completed' && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {countdown}
              </div>
              <div className="text-sm text-gray-600">
                {ride.status === 'searching' ? 'seconds to find driver' : 
                 ride.status === 'found' ? 'seconds to confirm' : 
                 'minutes away'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver Card */}
      {ride.driver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Your Driver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {ride.driver.photo ? (
                  <img 
                    src={ride.driver.photo} 
                    alt={ride.driver.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-600">
                    {ride.driver.name.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold">{ride.driver.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{ride.driver.rating}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {ride.driver.vehicle.color} {ride.driver.vehicle.make} {ride.driver.vehicle.model}
                </p>
                <p className="text-sm font-mono">{ride.driver.vehicle.license_plate}</p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-30 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
              }}
            />
            <div className="relative z-10 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">Live tracking map</p>
              <p className="text-sm text-blue-600">Updated every 30 seconds</p>
            </div>
            
            {/* Animated route */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-blue-500 rounded-full opacity-60 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {ride.status !== 'completed' && (
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={onRideCancel}
            className="flex-1"
            disabled={ride.status === 'in_progress'}
          >
            Cancel Ride
          </Button>
          <Button className="flex-1">
            Share Trip
          </Button>
        </div>
      )}
    </div>
  );
};

export default RealTimeTracking;

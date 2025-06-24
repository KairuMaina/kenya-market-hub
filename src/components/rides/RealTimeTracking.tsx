
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Phone, MessageCircle, Star } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle_make: string;
  vehicle_model: string;
  license_plate: string;
  current_location: {
    lat: number;
    lng: number;
  };
}

interface RealTimeTrackingProps {
  rideId: string;
  currentStatus: 'searching' | 'found' | 'pickup' | 'in_progress';
}

const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({
  rideId,
  currentStatus
}) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<number>(0);
  const [rideProgress, setRideProgress] = useState(0);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentStatus === 'found' || currentStatus === 'pickup') {
        setEstimatedArrival(prev => Math.max(0, prev - 1));
      }
      
      if (currentStatus === 'in_progress') {
        setRideProgress(prev => Math.min(100, prev + 2));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStatus]);

  useEffect(() => {
    // Mock driver data - in real app, this would come from API
    if (currentStatus !== 'searching') {
      setDriver({
        id: '1',
        name: 'John Kamau',
        phone: '+254712345678',
        rating: 4.8,
        vehicle_make: 'Toyota',
        vehicle_model: 'Vitz',
        license_plate: 'KCA 123A',
        current_location: { lat: -1.2921, lng: 36.8219 }
      });
      setEstimatedArrival(5); // 5 minutes
    }
  }, [currentStatus]);

  const getStatusInfo = () => {
    switch (currentStatus) {
      case 'searching':
        return {
          title: 'Searching for Driver',
          description: 'Looking for nearby drivers...',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'found':
        return {
          title: 'Driver Found',
          description: 'Driver is on the way to pick you up',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'pickup':
        return {
          title: 'Driver Arriving',
          description: 'Driver is almost at your location',
          color: 'bg-orange-100 text-orange-800'
        };
      case 'in_progress':
        return {
          title: 'Trip in Progress',
          description: 'Enjoy your ride!',
          color: 'bg-green-100 text-green-800'
        };
      default:
        return {
          title: 'Unknown Status',
          description: '',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (currentStatus === 'searching') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            {statusInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{statusInfo.description}</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-pulse bg-gray-200 rounded-lg h-40 w-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{statusInfo.title}</CardTitle>
            <Badge className={statusInfo.color}>
              {currentStatus.toUpperCase().replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{statusInfo.description}</p>
          
          {currentStatus === 'in_progress' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trip Progress</span>
                <span>{rideProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${rideProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver Information */}
      {driver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Your Driver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{driver.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {driver.rating}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Vehicle:</span>
                <p className="font-medium">{driver.vehicle_make} {driver.vehicle_model}</p>
              </div>
              <div>
                <span className="text-gray-600">Plate:</span>
                <p className="font-medium">{driver.license_plate}</p>
              </div>
            </div>

            {estimatedArrival > 0 && currentStatus !== 'in_progress' && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Arriving in {estimatedArrival} minute{estimatedArrival !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>Live tracking map would appear here</p>
              <p className="text-sm">Integration with mapping service required</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeTracking;

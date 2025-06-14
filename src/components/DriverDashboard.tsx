
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, MapPin } from 'lucide-react';
import { useDriverRideRequests } from '@/hooks/useDriverMatching';
import DriverRequestCard from './DriverRequestCard';

const DriverDashboard = () => {
  const { data: rideRequests, isLoading } = useDriverRideRequests();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <span className="ml-2">Loading ride requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Car className="h-8 w-8" />
          Driver Dashboard
        </h1>
        <p className="text-orange-100 mt-2">
          Accept ride requests and start earning
        </p>
      </div>

      {rideRequests && rideRequests.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Incoming Ride Requests</h2>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {rideRequests.length} pending
            </Badge>
          </div>
          
          {rideRequests.map((request) => (
            <DriverRequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-gray-600 font-medium mb-2">No ride requests</p>
            <p className="text-sm text-gray-500">
              You'll receive notifications when passengers request rides in your area
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DriverDashboard;

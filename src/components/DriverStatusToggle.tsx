
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Power, Car, Clock } from 'lucide-react';
import { useDriverStatus } from '@/hooks/useDriverMatching';

const DriverStatusToggle = () => {
  const updateStatus = useDriverStatus();

  const handleStatusChange = (status: 'available' | 'busy' | 'offline') => {
    updateStatus.mutate(status);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Power className="h-5 w-5" />
          Driver Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge variant="outline" className="text-green-600 border-green-300 mb-4">
            Currently Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleStatusChange('available')}
            variant="default"
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={updateStatus.isPending}
          >
            <Car className="h-4 w-4" />
            Go Online
          </Button>
          
          <Button
            onClick={() => handleStatusChange('busy')}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 flex items-center gap-2"
            disabled={updateStatus.isPending}
          >
            <Clock className="h-4 w-4" />
            Set Busy
          </Button>
          
          <Button
            onClick={() => handleStatusChange('offline')}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2"
            disabled={updateStatus.isPending}
          >
            <Power className="h-4 w-4" />
            Go Offline
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Your status determines whether you receive ride requests</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverStatusToggle;

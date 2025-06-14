
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Power, UserCheck, Clock } from 'lucide-react';
import { useDriverStatus } from '@/hooks/useDriverMatching';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DriverStatusToggle = () => {
  const { user } = useAuth();
  const updateStatus = useDriverStatus();

  const { data: driverProfile } = useQuery({
    queryKey: ['driver-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('drivers')
        .select('status, availability_status')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const currentStatus = driverProfile?.status || 'offline';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'busy':
        return 'bg-yellow-500 text-white';
      case 'offline':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <UserCheck className="h-4 w-4" />;
      case 'busy':
        return <Clock className="h-4 w-4" />;
      case 'offline':
        return <Power className="h-4 w-4" />;
      default:
        return <Power className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (newStatus: 'available' | 'busy' | 'offline') => {
    updateStatus.mutate(newStatus);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Driver Status
          <Badge className={getStatusColor(currentStatus)}>
            {getStatusIcon(currentStatus)}
            <span className="ml-1 capitalize">{currentStatus}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={currentStatus === 'available' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('available')}
            disabled={updateStatus.isPending}
            className="w-full justify-start"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Available for Rides
          </Button>
          
          <Button
            variant={currentStatus === 'busy' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('busy')}
            disabled={updateStatus.isPending}
            className="w-full justify-start"
          >
            <Clock className="h-4 w-4 mr-2" />
            Busy
          </Button>
          
          <Button
            variant={currentStatus === 'offline' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('offline')}
            disabled={updateStatus.isPending}
            className="w-full justify-start"
          >
            <Power className="h-4 w-4 mr-2" />
            Go Offline
          </Button>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t">
          {currentStatus === 'available' && (
            <p>✅ You're online and will receive ride requests</p>
          )}
          {currentStatus === 'busy' && (
            <p>⏳ You're busy and won't receive new requests</p>
          )}
          {currentStatus === 'offline' && (
            <p>⏸️ You're offline and won't receive any requests</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverStatusToggle;

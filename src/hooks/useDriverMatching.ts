
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface DriverRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  distance_km: number;
  estimated_pickup_minutes: number;
  sent_at: string;
  responded_at?: string;
  expires_at: string;
  created_at: string;
  rides: {
    id: string;
    pickup_address: string;
    destination_address: string;
    estimated_fare: number;
    vehicle_type: 'taxi' | 'motorbike';
  };
}

export interface NearbyDriver {
  driver_id: string;
  distance_km: number;
  estimated_pickup_minutes: number;
}

// Hook for finding nearby drivers
export const useFindNearbyDrivers = () => {
  return useMutation({
    mutationFn: async ({
      pickupLat,
      pickupLng,
      vehicleType,
      radiusKm = 10
    }: {
      pickupLat: number;
      pickupLng: number;
      vehicleType: 'taxi' | 'motorbike';
      radiusKm?: number;
    }) => {
      const { data, error } = await supabase.rpc('find_nearby_drivers', {
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        vehicle_type_param: vehicleType,
        radius_km: radiusKm
      });

      if (error) throw error;
      return data as NearbyDriver[];
    }
  });
};

// Hook for sending ride requests to drivers
export const useSendRideRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rideId,
      driverRequests
    }: {
      rideId: string;
      driverRequests: Array<{
        driver_id: string;
        distance_km: number;
        estimated_pickup_minutes: number;
      }>;
    }) => {
      const requests = driverRequests.map(request => ({
        ride_id: rideId,
        driver_id: request.driver_id,
        distance_km: request.distance_km,
        estimated_pickup_minutes: request.estimated_pickup_minutes,
        expires_at: new Date(Date.now() + 2 * 60 * 1000).toISOString()
      }));

      const { data, error } = await supabase
        .from('driver_ride_requests')
        .insert(requests)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-ride-requests'] });
      toast({
        title: 'Searching for drivers',
        description: 'We\'ve notified nearby drivers about your ride request.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send ride requests',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook for drivers to view their ride requests
export const useDriverRideRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['driver-ride-requests', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (driverError) throw driverError;
      if (!driver) return [];

      const { data, error } = await supabase
        .from('driver_ride_requests')
        .select(`
          *,
          rides (
            id,
            pickup_address,
            destination_address,
            estimated_fare,
            vehicle_type
          )
        `)
        .eq('driver_id', driver.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DriverRequest[];
    },
    enabled: !!user,
    refetchInterval: 3000,
  });
};

// Hook for drivers to respond to ride requests
export const useRespondToRideRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      response,
      rideId
    }: {
      requestId: string;
      response: 'accepted' | 'declined';
      rideId: string;
    }) => {
      const { error: requestError } = await supabase
        .from('driver_ride_requests')
        .update({
          status: response,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      if (response === 'accepted') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data: driver, error: driverError } = await supabase
          .from('drivers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (driverError) throw driverError;

        const { error: rideError } = await supabase
          .from('rides')
          .update({
            status: 'accepted',
            driver_id: driver.id,
            accepted_at: new Date().toISOString()
          })
          .eq('id', rideId);

        if (rideError) throw rideError;

        const { error: expireError } = await supabase
          .from('driver_ride_requests')
          .update({ status: 'expired' })
          .eq('ride_id', rideId)
          .eq('status', 'pending')
          .neq('id', requestId);

        if (expireError) throw expireError;
      }

      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['driver-ride-requests'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-rides'] });
      
      toast({
        title: variables.response === 'accepted' ? 'Ride Accepted!' : 'Ride Declined',
        description: variables.response === 'accepted' 
          ? 'You have accepted this ride request. Contact the passenger to coordinate pickup.'
          : 'You have declined this ride request.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to respond',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook for real-time ride status updates
export const useRideStatusUpdates = (rideId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!rideId) return;

    const channel = supabase
      .channel(`ride-status-${rideId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${rideId}`
        },
        (payload) => {
          console.log('Ride status updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['enhanced-rides'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_ride_requests',
          filter: `ride_id=eq.${rideId}`
        },
        (payload) => {
          console.log('Driver request updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['driver-ride-requests'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, queryClient]);
};

// Phase 2: Commission & Driver Earnings hooks
export interface DriverEarnings {
  driver_id: string;
  total_trips: number;
  total_gross_earnings: number;
  total_commission: number;
  total_net_earnings: number;
  today_trips: number;
  today_gross_earnings: number;
  today_commission: number;
  today_net_earnings: number;
  week_trips: number;
  week_gross_earnings: number;
  week_commission: number;
  week_net_earnings: number;
}

export const useDriverEarnings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['driver-earnings', user?.id],
    queryFn: async (): Promise<DriverEarnings> => {
      if (!user) throw new Error('User not authenticated');

      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (driverError) throw driverError;
      if (!driver) throw new Error('Driver profile not found');

      // Get completed rides for this driver
      const { data: rides, error: ridesError } = await supabase
        .from('rides')
        .select('actual_fare, completed_at')
        .eq('driver_id', driver.id)
        .eq('status', 'completed')
        .not('actual_fare', 'is', null);

      if (ridesError) throw ridesError;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      let totalGross = 0, todayGross = 0, weekGross = 0;
      let totalTrips = 0, todayTrips = 0, weekTrips = 0;

      rides?.forEach(ride => {
        const fare = Number(ride.actual_fare);
        const completedAt = new Date(ride.completed_at!);
        
        totalGross += fare;
        totalTrips++;

        if (completedAt >= todayStart) {
          todayGross += fare;
          todayTrips++;
        }

        if (completedAt >= weekStart) {
          weekGross += fare;
          weekTrips++;
        }
      });

      const commissionRate = 0.05; // 5%
      
      return {
        driver_id: driver.id,
        total_trips: totalTrips,
        total_gross_earnings: totalGross,
        total_commission: totalGross * commissionRate,
        total_net_earnings: totalGross * (1 - commissionRate),
        today_trips: todayTrips,
        today_gross_earnings: todayGross,
        today_commission: todayGross * commissionRate,
        today_net_earnings: todayGross * (1 - commissionRate),
        week_trips: weekTrips,
        week_gross_earnings: weekGross,
        week_commission: weekGross * commissionRate,
        week_net_earnings: weekGross * (1 - commissionRate),
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useDriverStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async (status: 'available' | 'busy' | 'offline') => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('drivers')
        .update({ 
          status,
          availability_status: status === 'available' ? 'online' : 'offline'
        })
        .eq('user_id', user.id);

      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      toast({
        title: 'Status Updated',
        description: `You are now ${status}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return updateStatus;
};

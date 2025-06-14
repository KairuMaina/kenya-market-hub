
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useFindNearbyDrivers, useSendRideRequests } from './useDriverMatching';

export interface EnhancedRide {
  id: string;
  user_id: string;
  driver_id?: string;
  pickup_address: string;
  destination_address: string;
  pickup_location: { lat: number; lng: number };
  destination_location: { lat: number; lng: number };
  vehicle_type: 'taxi' | 'motorbike';
  estimated_fare: number;
  actual_fare?: number;
  distance_km?: number;
  duration_minutes?: number;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  requested_at?: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  rating?: number;
  review?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface RideMatchingRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  distance_km?: number;
  estimated_time_minutes?: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  created_at: string;
  responded_at?: string;
}

export const useEnhancedRides = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enhanced-rides', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(ride => ({
        ...ride,
        estimated_fare: ride.estimated_fare || 0,
        pickup_location: ride.pickup_location ? 
          { lat: (ride.pickup_location as any).y, lng: (ride.pickup_location as any).x } : 
          { lat: 0, lng: 0 },
        destination_location: ride.destination_location ? 
          { lat: (ride.destination_location as any).y, lng: (ride.destination_location as any).x } : 
          { lat: 0, lng: 0 },
      })) as EnhancedRide[];
    },
    enabled: !!user,
    refetchInterval: 5000,
  });
};

export const useBookEnhancedRide = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const findDrivers = useFindNearbyDrivers();
  const sendRequests = useSendRideRequests();

  return useMutation({
    mutationFn: async (rideData: {
      pickupAddress: string;
      destinationAddress: string;
      pickupLocation: { lat: number; lng: number };
      destinationLocation: { lat: number; lng: number };
      vehicleType: 'taxi' | 'motorbike';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: fareData, error: fareError } = await supabase
        .from('fare_calculations')
        .select('*')
        .eq('vehicle_type', rideData.vehicleType)
        .eq('is_active', true)
        .single();

      if (fareError) throw fareError;

      const estimatedDistance = 5;
      const estimatedFare = fareData.base_fare + (estimatedDistance * fareData.per_km_rate);

      const { data: ride, error } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          pickup_address: rideData.pickupAddress,
          destination_address: rideData.destinationAddress,
          pickup_location: `POINT(${rideData.pickupLocation.lng} ${rideData.pickupLocation.lat})`,
          destination_location: `POINT(${rideData.destinationLocation.lng} ${rideData.destinationLocation.lat})`,
          vehicle_type: rideData.vehicleType,
          estimated_fare: estimatedFare,
          status: 'requested',
        })
        .select()
        .single();

      if (error) throw error;

      const nearbyDrivers = await findDrivers.mutateAsync({
        pickupLat: rideData.pickupLocation.lat,
        pickupLng: rideData.pickupLocation.lng,
        vehicleType: rideData.vehicleType,
      });

      if (nearbyDrivers.length > 0) {
        await sendRequests.mutateAsync({
          rideId: ride.id,
          driverRequests: nearbyDrivers.map(driver => ({
            driver_id: driver.driver_id,
            distance_km: driver.distance_km,
            estimated_pickup_minutes: driver.estimated_pickup_minutes
          }))
        });
      }

      return ride;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-rides'] });
      toast({
        title: 'Ride Booked!',
        description: 'Your ride request has been submitted. Finding nearby drivers...',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useRideMatchingRequests = (rideId?: string) => {
  return useQuery({
    queryKey: ['ride-matching-requests', rideId],
    queryFn: async () => {
      if (!rideId) return [];

      const { data, error } = await supabase
        .from('ride_matching_requests')
        .select(`
          *,
          drivers (
            id,
            phone_number,
            vehicle_type,
            vehicle_make,
            vehicle_model,
            license_plate,
            rating
          )
        `)
        .eq('ride_id', rideId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RideMatchingRequest[];
    },
    enabled: !!rideId,
    refetchInterval: 3000,
  });
};

// Commission calculation hook
export const useCalculateCommission = () => {
  return useMutation({
    mutationFn: async ({ 
      rideId, 
      actualFare 
    }: { 
      rideId: string; 
      actualFare: number;
    }) => {
      const commissionRate = 0.05; // 5%
      const commission = actualFare * commissionRate;
      const driverEarnings = actualFare - commission;

      // Update the ride with actual fare and commission details
      const { error } = await supabase
        .from('rides')
        .update({ 
          actual_fare: actualFare,
          completed_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', rideId);

      if (error) throw error;

      return {
        actualFare,
        commission,
        driverEarnings,
        commissionRate
      };
    }
  });
};

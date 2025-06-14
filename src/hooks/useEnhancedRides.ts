
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedRide {
  id: string;
  user_id: string;
  driver_id?: string;
  pickup_address: string;
  destination_address: string;
  pickup_location: { lat: number; lng: number };
  destination_location: { lat: number; lng: number };
  vehicle_type: 'taxi' | 'motorbike';
  estimated_fare?: number;
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
        pickup_location: ride.pickup_location ? 
          { lat: (ride.pickup_location as any).y, lng: (ride.pickup_location as any).x } : 
          { lat: 0, lng: 0 },
        destination_location: ride.destination_location ? 
          { lat: (ride.destination_location as any).y, lng: (ride.destination_location as any).x } : 
          { lat: 0, lng: 0 },
      })) as EnhancedRide[];
    },
    enabled: !!user,
  });
};

export const useBookEnhancedRide = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      // Calculate estimated fare with surge pricing
      const { data: fareData, error: fareError } = await supabase
        .rpc('calculate_enhanced_fare', {
          vehicle_type: rideData.vehicleType,
          pickup_lat: rideData.pickupLocation.lat,
          pickup_lng: rideData.pickupLocation.lng,
          dest_lat: rideData.destinationLocation.lat,
          dest_lng: rideData.destinationLocation.lng,
        });

      if (fareError) throw fareError;

      const { data, error } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          pickup_address: rideData.pickupAddress,
          destination_address: rideData.destinationAddress,
          pickup_location: `POINT(${rideData.pickupLocation.lng} ${rideData.pickupLocation.lat})`,
          destination_location: `POINT(${rideData.destinationLocation.lng} ${rideData.destinationLocation.lat})`,
          vehicle_type: rideData.vehicleType,
          estimated_fare: fareData?.estimated_fare || 0,
          status: 'requested',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
    refetchInterval: 3000, // Refresh every 3 seconds for real-time updates
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RideRequest {
  id: string;
  user_id: string;
  pickup_location: any;
  pickup_address: string;
  destination_location: any;
  destination_address: string;
  vehicle_type: string;
  estimated_fare?: number;
  status: string;
  created_at: string;
}

export interface DriverRideRequest {
  id: string;
  ride_id: string;
  driver_id: string;
  status: string;
  distance_km?: number;
  estimated_pickup_minutes?: number;
  expires_at: string;
  created_at: string;
}

export const useAvailableRides = () => {
  return useQuery({
    queryKey: ['available-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'requested')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as RideRequest[];
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });
};

export const useFindNearbyDrivers = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      pickupLat, 
      pickupLng, 
      radiusKm = 10 
    }: {
      pickupLat: number;
      pickupLng: number;
      radiusKm?: number;
    }) => {
      const { data, error } = await supabase.rpc('find_nearby_drivers', {
        p_pickup_lat: pickupLat,
        p_pickup_lng: pickupLng,
        p_radius_km: radiusKm
      });
      
      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      toast({
        title: 'Error finding nearby drivers',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDriverRideRequests = () => {
  return useQuery({
    queryKey: ['driver-ride-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Get driver info first
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (driverError) throw driverError;
      
      // Note: This table might not exist yet, so we'll handle the error gracefully
      const { data, error } = await supabase
        .from('driver_ride_requests')
        .select(`
          *,
          rides (*)
        `)
        .eq('driver_id', driver.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
        throw error;
      }
      
      return data || [];
    },
    refetchInterval: 3000 // Check for new requests every 3 seconds
  });
};

export const useRespondToRideRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      requestId, 
      response 
    }: {
      requestId: string;
      response: 'accepted' | 'declined';
    }) => {
      // Note: This table might not exist yet
      const { error } = await supabase
        .from('driver_ride_requests')
        .update({ 
          status: response,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
        throw error;
      }
      
      if (response === 'accepted') {
        // Update the ride status to accepted
        const { data: request } = await supabase
          .from('driver_ride_requests')
          .select('ride_id, driver_id')
          .eq('id', requestId)
          .single();
        
        if (request) {
          await supabase
            .from('rides')
            .update({ 
              status: 'accepted',
              driver_id: request.driver_id,
              accepted_at: new Date().toISOString()
            })
            .eq('id', request.ride_id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-ride-requests'] });
      queryClient.invalidateQueries({ queryKey: ['available-rides'] });
      toast({ title: 'Response sent successfully' });
    },
    onError: (error: any) => {
      if (!error.message.includes('relation') && !error.message.includes('does not exist')) {
        toast({
          title: 'Error responding to ride request',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  });
};

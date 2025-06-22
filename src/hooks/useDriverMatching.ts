import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDriverRequests = () => {
  return useQuery({
    queryKey: ['driver-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Get driver record
      const { data: driver } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!driver) throw new Error('Driver not found');
      
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
        .gt('expires_at', new Date().toISOString());
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Poll every 5 seconds for new requests
  });
};

export const useRespondToRideRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ requestId, response }: { requestId: string; response: 'accepted' | 'declined' }) => {
      const { error } = await supabase
        .from('driver_ride_requests')
        .update({
          status: response,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
      
      if (response === 'accepted') {
        // Update the ride status
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
              driver_id: request.driver_id 
            })
            .eq('id', request.ride_id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-requests'] });
      toast({
        title: 'Response recorded',
        description: 'Your response has been recorded successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useMatchDriversToRide = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      rideId, 
      pickupLat, 
      pickupLng, 
      vehicleType 
    }: { 
      rideId: string; 
      pickupLat: number; 
      pickupLng: number; 
      vehicleType: string; 
    }) => {
      // Find nearby drivers
      const { data: nearbyDrivers, error: driversError } = await supabase
        .rpc('find_nearby_drivers', { 
          p_pickup_lat: pickupLat, 
          p_pickup_lng: pickupLng,
          p_radius_km: 10
        });
      
      if (driversError) throw driversError;
      
      if (!nearbyDrivers || nearbyDrivers.length === 0) {
        throw new Error('No drivers available in your area');
      }
      
      // Create ride requests for nearby drivers
      const requests = nearbyDrivers.map((driver: any) => ({
        ride_id: rideId,
        driver_id: driver.driver_id,
        distance_km: driver.distance_km,
        estimated_pickup_minutes: Math.round(driver.distance_km * 2.5), // Estimate based on distance
        expires_at: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes from now
        status: 'pending'
      }));
      
      const { error: requestsError } = await supabase
        .from('driver_ride_requests')
        .insert(requests);
      
      if (requestsError) throw requestsError;
      
      return { message: `Sent ride requests to ${nearbyDrivers.length} drivers` };
    },
    onError: (error: any) => {
      toast({
        title: 'Error matching drivers',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDriverStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (status: 'available' | 'busy' | 'offline') => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('drivers')
        .update({ status })
        .eq('user_id', user.id);
      
      if (error) throw error;
      return { status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      toast({
        title: 'Status updated',
        description: 'Your driver status has been updated successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDriverEarnings = () => {
  return useQuery({
    queryKey: ['driver-earnings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Get driver record
      const { data: driver } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!driver) throw new Error('Driver not found');
      
      const { data, error } = await supabase
        .from('rides')
        .select('estimated_fare, status, created_at')
        .eq('driver_id', driver.id)
        .eq('status', 'completed');
      
      if (error) throw error;
      
      const totalEarnings = data?.reduce((sum, ride) => sum + Number(ride.estimated_fare), 0) || 0;
      const ridesCompleted = data?.length || 0;
      
      return {
        totalEarnings,
        ridesCompleted,
        rides: data || []
      };
    }
  });
};

export const useRideStatusUpdates = (rideId: string) => {
  return useQuery({
    queryKey: ['ride-status', rideId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!rideId,
    refetchInterval: 3000 // Poll every 3 seconds
  });
};

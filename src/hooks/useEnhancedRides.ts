
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedRide {
  id: string;
  user_id: string;
  driver_id?: string;
  pickup_address: string;
  destination_address: string;
  pickup_location: { lat: number; lng: number };
  destination_location: { lat: number; lng: number };
  estimated_fare: number;
  actual_fare?: number;
  status: string;
  vehicle_type: string;
  created_at: string;
  completed_at?: string;
  rating?: number;
  review?: string;
  duration_minutes?: number;
}

export const useEnhancedRides = (filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  vehicleType?: string;
}) => {
  return useQuery({
    queryKey: ['enhanced-rides', filters],
    queryFn: async () => {
      let query = supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters?.vehicleType) {
        query = query.eq('vehicle_type', filters.vehicleType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(ride => ({
        ...ride,
        pickup_location: ride.pickup_location ? 
          JSON.parse(ride.pickup_location) : 
          { lat: 0, lng: 0 },
        destination_location: ride.destination_location ? 
          JSON.parse(ride.destination_location) : 
          { lat: 0, lng: 0 },
        vehicle_type: ride.vehicle_type || 'taxi'
      })) as EnhancedRide[];
    }
  });
};

export const useCreateEnhancedRide = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (rideData: {
      pickup_address: string;
      destination_address: string;
      pickup_location: { lat: number; lng: number };
      destination_location: { lat: number; lng: number };
      estimated_fare: number;
      vehicle_type: 'taxi' | 'motorbike';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          pickup_address: rideData.pickup_address,
          destination_address: rideData.destination_address,
          pickup_location: JSON.stringify(rideData.pickup_location),
          destination_location: JSON.stringify(rideData.destination_location),
          estimated_fare: rideData.estimated_fare,
          vehicle_type: rideData.vehicle_type,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-rides'] });
      toast({
        title: 'Ride requested',
        description: 'Your ride request has been created successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating ride',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useRideMatching = () => {
  return useQuery({
    queryKey: ['ride-matching'],
    queryFn: async () => {
      // Get available drivers
      const { data: availableDrivers, error } = await supabase
        .rpc('find_nearby_drivers', { 
          p_pickup_lat: -1.2921, // Default to Nairobi coordinates
          p_pickup_lng: 36.8219,
          p_radius_km: 50
        });
      
      if (error) throw error;
      return availableDrivers || [];
    }
  });
};

export const useUpdateRideStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ rideId, status, actualFare }: { 
      rideId: string; 
      status: string; 
      actualFare?: number; 
    }) => {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        if (actualFare) {
          updateData.actual_fare = actualFare;
        }
      }
      
      const { error } = await supabase
        .from('rides')
        .update(updateData)
        .eq('id', rideId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-rides'] });
      toast({
        title: 'Ride updated',
        description: 'Ride status updated successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating ride',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

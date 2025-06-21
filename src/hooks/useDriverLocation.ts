
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DriverLocation {
  id: string;
  driver_id: string;
  location: any;
  heading?: number;
  speed?: number;
  timestamp: string;
  is_active: boolean;
}

export const useDriverLocation = (driverId?: string) => {
  return useQuery({
    queryKey: ['driver-location', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      
      const { data, error } = await supabase
        .from('driver_locations')
        .select('*')
        .eq('driver_id', driverId)
        .eq('is_active', true)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as DriverLocation;
    },
    enabled: !!driverId
  });
};

export const useUpdateDriverLocation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      driverId, 
      latitude, 
      longitude, 
      heading, 
      speed 
    }: {
      driverId: string;
      latitude: number;
      longitude: number;
      heading?: number;
      speed?: number;
    }) => {
      // First, deactivate old locations
      await supabase
        .from('driver_locations')
        .update({ is_active: false })
        .eq('driver_id', driverId);
      
      // Insert new location
      const { error } = await supabase
        .from('driver_locations')
        .insert({
          driver_id: driverId,
          location: `POINT(${longitude} ${latitude})`,
          heading,
          speed,
          is_active: true
        });
      
      if (error) throw error;
      
      // Also update the driver's current location
      await supabase
        .from('drivers')
        .update({
          current_location: `POINT(${longitude} ${latitude})`,
          last_location_update: new Date().toISOString()
        })
        .eq('id', driverId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['driver-location', variables.driverId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating location',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useNearbyDrivers = (latitude?: number, longitude?: number, radiusKm: number = 10) => {
  return useQuery({
    queryKey: ['nearby-drivers', latitude, longitude, radiusKm],
    queryFn: async () => {
      if (!latitude || !longitude) return [];
      
      const { data, error } = await supabase.rpc('find_nearby_drivers', {
        p_pickup_lat: latitude,
        p_pickup_lng: longitude,
        p_radius_km: radiusKm
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!latitude && !!longitude
  });
};

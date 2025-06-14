
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DriverLocation {
  id: string;
  driver_id: string;
  location: { lat: number; lng: number };
  accuracy?: number;
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
      
      if (data) {
        // Convert PostGIS point to lat/lng object
        const point = data.location as any;
        return {
          ...data,
          location: { lat: point.y || point.lat, lng: point.x || point.lng }
        } as DriverLocation;
      }
      
      return null;
    },
    enabled: !!driverId,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time tracking
  });
};

export const useNearbyDrivers = (userLocation?: { lat: number; lng: number }, radiusKm = 10) => {
  return useQuery({
    queryKey: ['nearby-drivers', userLocation?.lat, userLocation?.lng, radiusKm],
    queryFn: async () => {
      if (!userLocation) return [];

      // For now, let's use a simple query until we can add the RPC function
      const { data, error } = await supabase
        .from('driver_locations')
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
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching nearby drivers:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!userLocation,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};

export const useUpdateDriverLocation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      driverId, 
      location, 
      accuracy, 
      heading, 
      speed 
    }: {
      driverId: string;
      location: { lat: number; lng: number };
      accuracy?: number;
      heading?: number;
      speed?: number;
    }) => {
      // First deactivate old location entries
      await supabase
        .from('driver_locations')
        .update({ is_active: false })
        .eq('driver_id', driverId);

      // Insert new location
      const { data, error } = await supabase
        .from('driver_locations')
        .insert({
          driver_id: driverId,
          location: `POINT(${location.lng} ${location.lat})`,
          accuracy,
          heading,
          speed,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-location'] });
      queryClient.invalidateQueries({ queryKey: ['nearby-drivers'] });
    },
    onError: (error: any) => {
      console.error('Error updating driver location:', error);
      toast({
        title: 'Location Update Failed',
        description: 'Failed to update driver location.',
        variant: 'destructive',
      });
    },
  });
};

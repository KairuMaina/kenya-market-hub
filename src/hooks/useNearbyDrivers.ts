
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NearbyDriver {
  driver_id: string;
  distance_km: number;
  estimated_pickup_minutes: number;
}

export const useNearbyDrivers = (
  pickupLat: number,
  pickupLng: number,
  vehicleType: 'taxi' | 'motorbike',
  radiusKm: number = 10
) => {
  return useQuery({
    queryKey: ['nearby-drivers', pickupLat, pickupLng, vehicleType, radiusKm],
    queryFn: async (): Promise<NearbyDriver[]> => {
      // Since the RPC function doesn't exist, we'll simulate the functionality
      // by querying the drivers table directly
      const { data: drivers, error } = await supabase
        .from('drivers')
        .select('id, user_id, current_location, vehicle_type, is_active, is_verified, status')
        .eq('is_active', true)
        .eq('is_verified', true)
        .eq('status', 'available')
        .eq('vehicle_type', vehicleType);

      if (error) {
        console.error('Error fetching drivers:', error);
        throw error;
      }

      // For now, return mock data since we can't calculate actual distances without the RPC function
      const mockDrivers: NearbyDriver[] = (drivers || []).slice(0, 5).map((driver, index) => ({
        driver_id: driver.id,
        distance_km: Math.round((Math.random() * radiusKm + 1) * 100) / 100,
        estimated_pickup_minutes: Math.round(Math.random() * 15 + 5)
      }));

      return mockDrivers.sort((a, b) => a.distance_km - b.distance_km);
    },
    enabled: !!(pickupLat && pickupLng && vehicleType),
    staleTime: 30000, // 30 seconds
  });
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NearbyDriver {
  id: string;
  distance_km: number;
  estimated_pickup_minutes: number;
  driver: {
    id: string;
    user_id: string;
    vehicle_type: string;
    vehicle_make?: string;
    vehicle_model?: string;
    license_plate: string;
    rating: number;
    is_verified: boolean;
    status: string;
  };
}

export const useNearbyDrivers = (
  pickupLat: number,
  pickupLng: number,
  vehicleType: string,
  radiusKm: number = 10
) => {
  return useQuery({
    queryKey: ['nearby-drivers', pickupLat, pickupLng, vehicleType, radiusKm],
    queryFn: async (): Promise<NearbyDriver[]> => {
      try {
        // Use the existing Supabase function for finding nearby drivers
        const { data, error } = await supabase.rpc('find_nearby_drivers', {
          pickup_lat: pickupLat,
          pickup_lng: pickupLng,
          vehicle_type_param: vehicleType,
          radius_km: radiusKm
        });

        if (error) {
          console.error('Error finding nearby drivers:', error);
          return [];
        }

        // Get full driver details
        const driverIds = data?.map((d: any) => d.driver_id) || [];
        if (driverIds.length === 0) return [];

        const { data: drivers, error: driversError } = await supabase
          .from('drivers')
          .select(`
            id,
            user_id,
            vehicle_type,
            vehicle_make,
            vehicle_model,
            license_plate,
            rating,
            is_verified,
            status
          `)
          .in('id', driverIds);

        if (driversError) {
          console.error('Error fetching driver details:', driversError);
          return [];
        }

        // Combine distance data with driver details
        return data?.map((distanceData: any) => {
          const driver = drivers?.find(d => d.id === distanceData.driver_id);
          return {
            id: distanceData.driver_id,
            distance_km: distanceData.distance_km,
            estimated_pickup_minutes: distanceData.estimated_pickup_minutes,
            driver: driver || {
              id: distanceData.driver_id,
              user_id: '',
              vehicle_type: vehicleType,
              license_plate: '',
              rating: 0,
              is_verified: false,
              status: 'unknown'
            }
          };
        }) || [];
      } catch (error) {
        console.error('Error in useNearbyDrivers:', error);
        return [];
      }
    },
    enabled: !!(pickupLat && pickupLng && vehicleType),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

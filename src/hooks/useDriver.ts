
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DriverProfile {
  id: string;
  user_id: string;
  license_number: string;
  license_plate: string;
  vehicle_type: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  phone_number: string;
  rating: number;
  total_rides: number;
  is_verified: boolean;
  is_active: boolean;
  status: string;
  availability_status: string;
  current_location?: any;
  documents?: any;
  created_at: string;
  updated_at: string;
}

export interface DriverEarnings {
  totalEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  completedRides: number;
  averageRating: number;
  earningsBreakdown: Array<{
    date: string;
    earnings: number;
    rides: number;
  }>;
}

export const useDriverProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['driver-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as DriverProfile | null;
    },
    enabled: !!user
  });
};

export const useDriverEarnings = (driverId?: string) => {
  return useQuery({
    queryKey: ['driver-earnings', driverId],
    queryFn: async (): Promise<DriverEarnings> => {
      if (!driverId) {
        return {
          totalEarnings: 0,
          weeklyEarnings: 0,
          monthlyEarnings: 0,
          completedRides: 0,
          averageRating: 0,
          earningsBreakdown: []
        };
      }

      // Get completed rides for this driver
      const { data: rides, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', driverId)
        .eq('status', 'completed');

      if (error) throw error;

      const completedRides = rides?.length || 0;
      const totalEarnings = rides?.reduce((sum, ride) => sum + (Number(ride.actual_fare) || 0), 0) || 0;

      // Calculate weekly earnings (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyRides = rides?.filter(ride => new Date(ride.completed_at) >= weekAgo) || [];
      const weeklyEarnings = weeklyRides.reduce((sum, ride) => sum + (Number(ride.actual_fare) || 0), 0);

      // Calculate monthly earnings (last 30 days)
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const monthlyRides = rides?.filter(ride => new Date(ride.completed_at) >= monthAgo) || [];
      const monthlyEarnings = monthlyRides.reduce((sum, ride) => sum + (Number(ride.actual_fare) || 0), 0);

      // Get average rating
      const ratingsSum = rides?.reduce((sum, ride) => sum + (ride.rating || 0), 0) || 0;
      const ratingsCount = rides?.filter(ride => ride.rating).length || 0;
      const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

      // Generate earnings breakdown for last 7 days
      const earningsBreakdown = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayRides = rides?.filter(ride => 
          ride.completed_at?.split('T')[0] === dateStr
        ) || [];
        
        return {
          date: dateStr,
          earnings: dayRides.reduce((sum, ride) => sum + (Number(ride.actual_fare) || 0), 0),
          rides: dayRides.length
        };
      }).reverse();

      return {
        totalEarnings,
        weeklyEarnings,
        monthlyEarnings,
        completedRides,
        averageRating,
        earningsBreakdown
      };
    },
    enabled: !!driverId
  });
};

export const useUpdateDriverStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ driverId, status }: { driverId: string; status: string }) => {
      const { error } = await supabase
        .from('drivers')
        .update({ status, availability_status: status })
        .eq('id', driverId);

      if (error) throw error;
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
        description: error.message || 'Failed to update driver status.',
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateDriverLocation = () => {
  return useMutation({
    mutationFn: async ({ driverId, location }: { driverId: string; location: { lat: number; lng: number } }) => {
      const { error } = await supabase
        .from('drivers')
        .update({ 
          current_location: `POINT(${location.lng} ${location.lat})`,
          last_location_update: new Date().toISOString()
        })
        .eq('id', driverId);

      if (error) throw error;
    }
  });
};

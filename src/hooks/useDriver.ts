
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useMyDriverProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-driver-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const driverPromise = supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const [{ data: driverData, error: driverError }, { data: profileData, error: profileError }] = await Promise.all([driverPromise, profilePromise]);
        
      if (driverError && driverError.code !== 'PGRST116') {
        console.error('Error fetching driver data:', driverError);
        throw driverError;
      }
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile data:', profileError);
        throw profileError;
      }
      
      if (!driverData || !profileData) return null;

      return {
        ...profileData,
        ...driverData,
        driver_id: driverData.id,
        phone: driverData.phone_number,
      };
    },
    enabled: !!user,
  });
};

export const useUpdateDriverProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: any) => {
      if (!user) throw new Error("User not authenticated");
      
      const { 
        full_name, email, address, phone,
        vehicle_make, vehicle_model, license_plate, vehicle_year 
      } = profileData;

      const profileUpdates = { full_name, email, address, phone };
      Object.keys(profileUpdates).forEach(key => profileUpdates[key as keyof typeof profileUpdates] === undefined && delete profileUpdates[key as keyof typeof profileUpdates]);
      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', user.id);
        if (profileUpdateError) throw profileUpdateError;
      }
      
      const driverUpdates = {
        vehicle_make,
        vehicle_model,
        license_plate,
        vehicle_year: vehicle_year ? parseInt(vehicle_year, 10) : null,
        phone_number: phone
      };
      Object.keys(driverUpdates).forEach(key => driverUpdates[key as keyof typeof driverUpdates] === undefined && delete driverUpdates[key as keyof typeof driverUpdates]);

      if (Object.keys(driverUpdates).length > 0) {
        const { error: driverUpdateError } = await supabase
          .from('drivers')
          .update(driverUpdates)
          .eq('user_id', user.id);
        if (driverUpdateError) throw driverUpdateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-driver-profile'] });
      toast({ title: "Profile updated successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useDriverDashboardData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['driver-dashboard-data', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id, rating, status')
        .eq('user_id', user.id)
        .single();

      if (driverError) throw driverError;
      if (!driver) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: ridesToday, error: ridesError } = await supabase
        .from('rides')
        .select('actual_fare')
        .eq('driver_id', driver.id)
        .eq('status', 'completed')
        .gte('completed_at', today.toISOString())
        .lt('completed_at', tomorrow.toISOString());

      if (ridesError) throw ridesError;

      const todaysEarnings = ridesToday?.reduce((sum, ride) => sum + (ride.actual_fare || 0), 0) || 0;
      const ridesCompletedToday = ridesToday?.length || 0;

      const { data: activeRides, error: activeRidesError } = await supabase
        .from('rides')
        .select('*, profiles:user_id(full_name)')
        .eq('driver_id', driver.id)
        .in('status', ['accepted', 'in_progress']);

      if (activeRidesError) throw activeRidesError;

      const { data: recentRides, error: recentRidesError } = await supabase
        .from('rides')
        .select('*, profiles:user_id(full_name)')
        .eq('driver_id', driver.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(3);

      if (recentRidesError) throw recentRidesError;
      
      return {
        stats: {
          todaysEarnings: todaysEarnings,
          ridesCompletedToday,
          averageRating: driver.rating,
        },
        activeRides: activeRides || [],
        recentRides: recentRides || [],
        status: driver.status,
      };
    },
    enabled: !!user,
  });
};

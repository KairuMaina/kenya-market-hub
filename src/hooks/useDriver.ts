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

export const useDriverEarnings = (timeframe: 'week' | 'month' | 'year') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['driver-earnings', user?.id, timeframe],
    queryFn: async () => {
      if (!user) return null;

      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (driverError) throw driverError;
      if (!driver) return null;

      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case 'week':
          const firstDayOfWeek = now.getDate() - now.getDay();
          startDate = new Date(now.setDate(firstDayOfWeek));
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      startDate.setHours(0, 0, 0, 0);

      const { data: rides, error: ridesError } = await supabase
        .from('rides')
        .select('actual_fare, duration_minutes, completed_at')
        .eq('driver_id', driver.id)
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString());

      if (ridesError) throw ridesError;

      if (!rides) return {
        total: 0,
        rides: 0,
        hours: 0,
        average: 0,
        dailyEarnings: []
      };
      
      const total = rides.reduce((sum, ride) => sum + (ride.actual_fare || 0), 0);
      const rideCount = rides.length;
      const hours = rides.reduce((sum, ride) => sum + (ride.duration_minutes || 0), 0) / 60;
      const average = rideCount > 0 ? total / rideCount : 0;

      const dailyEarningsMap = new Map<string, { amount: number; rides: number }>();
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (const ride of rides) {
          if (ride.completed_at) {
              const date = new Date(ride.completed_at);
              const day = daysOfWeek[date.getDay()];
              const entry = dailyEarningsMap.get(day) || { amount: 0, rides: 0 };
              entry.amount += ride.actual_fare || 0;
              entry.rides += 1;
              dailyEarningsMap.set(day, entry);
          }
      }

      const dailyEarnings = daysOfWeek.map(day => ({
        day,
        amount: dailyEarningsMap.get(day)?.amount || 0,
        rides: dailyEarningsMap.get(day)?.rides || 0,
      }));

      return {
        total,
        rides: rideCount,
        hours: parseFloat(hours.toFixed(1)),
        average: parseFloat(average.toFixed(2)),
        dailyEarnings
      };
    },
    enabled: !!user,
  });
};

export const useDriverRatings = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['driver-ratings', user?.id],
        queryFn: async () => {
            if (!user) return null;

            const { data: driver, error: driverError } = await supabase
                .from('drivers')
                .select('id, rating')
                .eq('user_id', user.id)
                .single();

            if (driverError) throw driverError;
            if (!driver) return null;

            const { data: reviewedRides, error: ridesError } = await supabase
                .from('rides')
                .select('id, rating, review, completed_at, profiles:user_id(full_name)')
                .eq('driver_id', driver.id)
                .eq('status', 'completed')
                .not('rating', 'is', null)
                .order('completed_at', { ascending: false });

            if (ridesError) throw ridesError;

            const totalReviews = reviewedRides?.length || 0;
            const fiveStarRides = reviewedRides?.filter(r => r.rating === 5).length || 0;
            const fiveStarPercentage = totalReviews > 0 ? (fiveStarRides / totalReviews) * 100 : 0;

            const recentReviews = (reviewedRides || []).slice(0, 3).map(ride => ({
                id: ride.id,
                passenger: (ride.profiles as any)?.full_name || 'A Passenger',
                rating: ride.rating,
                comment: ride.review,
                date: ride.completed_at!,
            }));

            return {
                overallRating: driver.rating || 0,
                totalReviews,
                fiveStarPercentage: Math.round(fiveStarPercentage),
                recentReviews
            };
        },
        enabled: !!user,
    });
};

export const useDriverRideHistory = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['driver-ride-history', user?.id],
        queryFn: async () => {
            if (!user) return null;

            const { data: driver, error: driverError } = await supabase
                .from('drivers')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (driverError) throw driverError;
            if (!driver) return null;

            const { data: rides, error: ridesError } = await supabase
                .from('rides')
                .select('*, profiles:user_id(full_name)')
                .eq('driver_id', driver.id)
                .in('status', ['completed', 'cancelled'])
                .order('created_at', { ascending: false });

            if (ridesError) throw ridesError;

            return rides || [];
        },
        enabled: !!user,
    });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Driver {
  id: string;
  user_id?: string;
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  license_plate?: string;
  license_number?: string;
  phone?: string;
  rating?: number;
  total_rides?: number;
  status?: string;
  availability_status?: string;
  is_verified?: boolean;
  is_active?: boolean;
  current_location?: any;
  address?: string;
  full_name?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export const useDriver = (userId?: string) => {
  return useQuery({
    queryKey: ['driver', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Driver;
    },
    enabled: !!userId
  });
};

export const useDriverProfile = () => {
  return useQuery({
    queryKey: ['driver-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Driver;
    }
  });
};

// Add alias for useMyDriverProfile
export const useMyDriverProfile = useDriverProfile;

export const useCreateDriverProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (driverData: Partial<Driver>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('drivers')
        .insert({
          user_id: user.id,
          vehicle_type: driverData.vehicle_type,
          vehicle_make: driverData.vehicle_make,
          vehicle_model: driverData.vehicle_model,
          vehicle_year: driverData.vehicle_year,
          license_plate: driverData.license_plate,
          license_number: driverData.license_number,
          phone: driverData.phone,
          address: driverData.address,
          full_name: driverData.full_name,
          email: driverData.email,
          status: 'offline',
          availability_status: 'offline',
          is_verified: false,
          is_active: false,
          rating: 0,
          total_rides: 0
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      toast({ title: 'Driver profile created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating driver profile',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateDriverProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (driverData: Partial<Driver>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('drivers')
        .update(driverData)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      toast({ title: 'Profile updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDriverRides = () => {
  return useQuery({
    queryKey: ['driver-rides'],
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
      
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', driver.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useDriverEarnings = (timeframe?: 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: ['driver-earnings', timeframe],
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
      
      const { data, error } = await supabase
        .from('rides')
        .select('actual_fare, duration_minutes, completed_at')
        .eq('driver_id', driver.id)
        .eq('status', 'completed');
      
      if (error) throw error;
      
      const totalEarnings = data?.reduce((sum, ride) => sum + (ride.actual_fare || 0), 0) || 0;
      const totalRides = data?.length || 0;
      const avgEarnings = totalRides > 0 ? totalEarnings / totalRides : 0;
      const totalHours = data?.reduce((sum, ride) => sum + (ride.duration_minutes || 0), 0) / 60 || 0;
      
      // Generate mock daily earnings for chart
      const dailyEarnings = Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        amount: Math.floor(Math.random() * 2000) + 500,
        rides: Math.floor(Math.random() * 10) + 1
      }));
      
      return {
        total: totalEarnings,
        rides: totalRides,
        hours: Math.round(totalHours),
        average: avgEarnings,
        dailyEarnings
      };
    }
  });
};

export const useDriverRatings = () => {
  return useQuery({
    queryKey: ['driver-ratings'],
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
      
      const { data, error } = await supabase
        .from('rides')
        .select(`
          rating,
          review,
          completed_at
        `)
        .eq('driver_id', driver.id)
        .not('rating', 'is', null)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      
      const ratings = data?.map(ride => ({
        id: `rating-${Math.random()}`,
        user_name: 'Anonymous User',
        rating: ride.rating || 0,
        comment: ride.review || '',
        date: ride.completed_at || ''
      })) || [];
      
      // Calculate aggregated stats
      const totalReviews = ratings.length;
      const overallRating = totalReviews > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      const fiveStarPercentage = totalReviews > 0 
        ? (ratings.filter(r => r.rating === 5).length / totalReviews) * 100 
        : 0;
      
      return Object.assign(ratings, {
        overallRating,
        totalReviews,
        fiveStarPercentage,
        recentReviews: ratings.slice(0, 5)
      });
    }
  });
};

export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (status: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('drivers')
        .update({ 
          availability_status: status,
          status: status === 'available' ? 'available' : 'offline'
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-profile'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDriverAnalytics = () => {
  return useQuery({
    queryKey: ['driver-analytics'],
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
      
      const { data, error } = await supabase.rpc('get_driver_analytics', {
        p_driver_id: driver.id
      });
      
      if (error) throw error;
      return data;
    }
  });
};

export const usePopularRoutes = () => {
  return useQuery({
    queryKey: ['popular-routes'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_popular_routes');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useDriverDashboardData = () => {
  return useQuery({
    queryKey: ['driver-dashboard-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: driver, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      // Get active rides
      const { data: activeRides } = await supabase
        .from('rides')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .eq('driver_id', driver.id)
        .in('status', ['accepted', 'started', 'arrived'])
        .order('created_at', { ascending: false });
      
      // Get recent completed rides
      const { data: recentRides } = await supabase
        .from('rides')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .eq('driver_id', driver.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);
      
      // Calculate today's stats
      const today = new Date().toISOString().split('T')[0];
      const { data: todayRides } = await supabase
        .from('rides')
        .select('actual_fare, fare')
        .eq('driver_id', driver.id)
        .eq('status', 'completed')
        .gte('completed_at', today);
      
      const todaysEarnings = todayRides?.reduce((sum, ride) => sum + (ride.actual_fare || ride.fare || 0), 0) || 0;
      const ridesCompletedToday = todayRides?.length || 0;
      
      return {
        driver,
        stats: {
          todaysEarnings,
          ridesCompletedToday,
          averageRating: driver.rating || 0,
          onlineTime: '6h 45m' // Mock data
        },
        activeRides: activeRides || [],
        recentRides: recentRides || []
      };
    }
  });
};

// Add alias for missing exports
export const useDriverRideHistory = useDriverRides;

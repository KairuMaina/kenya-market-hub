import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDriverLocation = () => {
  return useQuery({
    queryKey: ['driver-location'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('driver_locations')
        .select('*')
        .eq('driver_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000 // Refetch every 10 seconds
  });
};

export const useUpdateDriverLocation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Update driver location in driver_locations table
      const { error: locationError } = await supabase
        .from('driver_locations')
        .upsert({
          driver_id: user.id,
          location: `(${lat},${lng})`,
          timestamp: new Date().toISOString(),
          is_active: true
        });
      
      if (locationError) throw locationError;
      
      // Update driver profile without current_location field
      const { error: driverError } = await supabase
        .from('drivers')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (driverError) throw driverError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-location'] });
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

export const useRealtimeDriverLocation = (driverId: string) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!driverId) return;

    const channel = supabase.channel(`driver_location:${driverId}`);

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'driver_locations', filter: `driver_id=eq.${driverId}` },
      (payload) => {
        // Extract location data from the payload
        const newLocation = payload.new as { location: string };
        if (newLocation && newLocation.location) {
          const [lat, lng] = newLocation.location.slice(1, -1).split(',').map(Number);
          setLocation({ lat, lng });
        }
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);

  return location;
};

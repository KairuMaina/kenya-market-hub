
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateRideData {
  pickupAddress: string;
  destinationAddress: string;
  pickupLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
  vehicleType: 'taxi' | 'motorbike';
}

export const useCreateRide = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreateRideData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const rideData = {
        user_id: user.id,
        pickup_address: data.pickupAddress,
        destination_address: data.destinationAddress,
        pickup_location: `POINT(${data.pickupLocation.lng} ${data.pickupLocation.lat})`,
        destination_location: `POINT(${data.destinationLocation.lng} ${data.destinationLocation.lat})`,
        vehicle_type: data.vehicleType,
        status: 'requested' as const
      };
      
      const { data: ride, error } = await supabase
        .from('rides')
        .insert([rideData])
        .select()
        .single();
      
      if (error) throw error;
      return ride;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast({
        title: 'Ride booked',
        description: 'Your ride has been booked successfully. Looking for drivers...'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error booking ride',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

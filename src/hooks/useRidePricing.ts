
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NewFareData {
  vehicle_type: 'sedan' | 'suv' | 'van' | 'boda';
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
}

export const useAddFareCalculation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (fareData: NewFareData) => {
            const { error } = await supabase.from('fare_calculations').insert({ ...fareData, is_active: true });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-fare-calculations'] });
            toast({ title: "Success", description: "New fare has been added." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: `Failed to add fare: ${error.message}`,
                variant: "destructive"
            });
        }
    });
};

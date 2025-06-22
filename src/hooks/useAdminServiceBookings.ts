
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceBooking {
  id: string;
  customer_id: string;
  provider_id: string;
  service_type: string;
  service_category_id?: string;
  booking_date: string;
  status: string;
  price?: number;
  total_amount?: number;
  description: string;
  location?: string;
  booking_address?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  provider_name?: string;
}

export const useAdminServiceBookings = () => {
  return useQuery({
    queryKey: ['admin-service-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get customer and provider names from profiles
      const bookingsWithNames = await Promise.all(
        data.map(async (booking) => {
          const [customerProfile, providerProfile] = await Promise.all([
            supabase.from('profiles').select('full_name, email').eq('id', booking.customer_id).single(),
            supabase.from('profiles').select('full_name, email').eq('id', booking.provider_id).single()
          ]);
          
          return {
            ...booking,
            service_type: 'General Service',
            customer_name: customerProfile.data?.full_name || customerProfile.data?.email || 'Unknown',
            provider_name: providerProfile.data?.full_name || providerProfile.data?.email || 'Unknown',
          };
        })
      );
      
      return bookingsWithNames as ServiceBooking[];
    }
  });
};

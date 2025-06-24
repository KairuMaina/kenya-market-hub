
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminServiceBooking {
  id: string;
  customer_id: string;
  provider_id: string;
  service_type: string;
  service_description: string;
  booking_date: string;
  booking_time: string;
  booking_address: string;
  total_amount: number;
  status: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  provider_name: string;
}

export const useAdminServiceBookings = () => {
  return useQuery({
    queryKey: ['admin-service-bookings'],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from('service_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!bookings) return [];

      // Get customer and provider names
      const customerIds = [...new Set(bookings.map(b => b.customer_id))];
      const providerIds = [...new Set(bookings.map(b => b.provider_id))];

      const [customersRes, providersRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', customerIds),
        supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', providerIds)
      ]);

      const customers = customersRes.data || [];
      const providers = providersRes.data || [];

      return bookings.map(booking => ({
        ...booking,
        customer_name: customers.find(c => c.id === booking.customer_id)?.full_name || 'Unknown Customer',
        provider_name: providers.find(p => p.id === booking.provider_id)?.full_name || 'Unknown Provider'
      })) as AdminServiceBooking[];
    }
  });
};

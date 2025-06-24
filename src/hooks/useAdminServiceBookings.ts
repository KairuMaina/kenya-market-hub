
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
      const customerIds = [...new Set(bookings.map(b => b.customer_id).filter(Boolean))];
      const providerIds = [...new Set(bookings.map(b => b.provider_id).filter(Boolean))];

      const [customersRes, providersRes] = await Promise.all([
        customerIds.length > 0 ? supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', customerIds) : { data: [] },
        providerIds.length > 0 ? supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', providerIds) : { data: [] }
      ]);

      const customers = customersRes.data || [];
      const providers = providersRes.data || [];

      return bookings.map(booking => ({
        id: booking.id,
        customer_id: booking.customer_id,
        provider_id: booking.provider_id,
        service_type: booking.service_type || 'General Service',
        service_description: booking.service_description || booking.description || 'No description',
        booking_date: booking.booking_date,
        booking_time: booking.booking_time || '09:00',
        booking_address: booking.booking_address || 'No address provided',
        total_amount: booking.total_amount || 0,
        status: booking.status,
        payment_status: booking.payment_status || 'pending',
        notes: booking.notes,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        customer_name: customers.find(c => c.id === booking.customer_id)?.full_name || 'Unknown Customer',
        provider_name: providers.find(p => p.id === booking.provider_id)?.full_name || 'Unknown Provider'
      })) as AdminServiceBooking[];
    }
  });
};

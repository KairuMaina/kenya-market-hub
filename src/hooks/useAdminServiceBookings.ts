import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceBookingAdminView {
  id: string;
  booking_date: string;
  status: string;
  total_amount: number | null;
  description: string | null;
  customer_name: string | null;
  provider_name: string | null;
  service_type: string | null;
}

const getServiceBookings = async (): Promise<ServiceBookingAdminView[]> => {
    const { data: bookings, error: bookingsError } = await supabase
        .from('service_bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (bookingsError) {
        console.error("Error fetching service bookings:", bookingsError);
        throw bookingsError;
    }
    if (!bookings) return [];

    const customerIds = [...new Set(bookings.map(b => b.customer_id).filter(Boolean))] as string[];
    const providerIds = [...new Set(bookings.map(b => b.provider_id).filter(Boolean))] as string[];
    const categoryIds = [...new Set(bookings.map(b => b.service_category_id).filter(Boolean))] as string[];

    const [
        customersResponse,
        providersResponse,
        categoriesResponse
    ] = await Promise.all([
        customerIds.length > 0 ? supabase.from('profiles').select('id, full_name').in('id', customerIds) : Promise.resolve({ data: [], error: null }),
        providerIds.length > 0 ? supabase.from('service_provider_profiles').select('id, business_name').in('id', providerIds) : Promise.resolve({ data: [], error: null }),
        categoryIds.length > 0 ? supabase.from('service_categories').select('id, name').in('id', categoryIds) : Promise.resolve({ data: [], error: null })
    ]);

    const { data: customers, error: customerError } = customersResponse;
    const { data: providers, error: providerError } = providersResponse;
    const { data: categories, error: categoryError } = categoriesResponse;

    if (customerError) console.error("Error fetching customers:", customerError);
    if (providerError) console.error("Error fetching providers:", providerError);
    if (categoryError) console.error("Error fetching categories:", categoryError);
    
    const customersMap = new Map<string, string | null>();
    customers?.forEach(c => c.id && customersMap.set(c.id, c.full_name));
    
    const providersMap = new Map<string, string | null>();
    providers?.forEach(p => p.id && providersMap.set(p.id, p.business_name));
    
    const categoriesMap = new Map<string, string | null>();
    categories?.forEach(c => c.id && categoriesMap.set(c.id, c.name));

    return bookings.map(booking => ({
        id: booking.id,
        booking_date: booking.booking_date,
        status: booking.status || 'pending',
        total_amount: booking.total_amount,
        description: booking.description,
        customer_name: customersMap.get(booking.customer_id!) ?? null,
        provider_name: providersMap.get(booking.provider_id!) ?? null,
        service_type: categoriesMap.get(booking.service_category_id!) ?? null,
    }));
};

export const useAdminServiceBookings = () => {
    return useQuery<ServiceBookingAdminView[]>({
        queryKey: ['admin-service-bookings'],
        queryFn: getServiceBookings
    });
};

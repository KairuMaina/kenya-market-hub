
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  title: string;
  description?: string;
  property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'office';
  listing_type: 'sale' | 'rent';
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  location_address: string;
  county?: string;
  city?: string;
  amenities?: string[];
  features?: string[];
  images?: string[];
  is_featured: boolean;
  views_count?: number;
  contact_phone?: string;
  contact_email?: string;
  available_from?: string;
  status?: 'available' | 'rented' | 'sold' | 'under_maintenance';
  owner_id: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
  location_coordinates?: { lat: number; lng: number };
  virtual_tour_url?: string;
}

export interface PropertyFilters {
  property_type?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  city?: string;
  county?: string;
  bedrooms?: number;
  search?: string;
}

export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.property_type) {
          query = query.eq('property_type', filters.property_type as any);
        }
        if (filters.listing_type) {
          query = query.eq('listing_type', filters.listing_type as any);
        }
        if (filters.min_price) {
          query = query.gte('price', filters.min_price);
        }
        if (filters.max_price) {
          query = query.lte('price', filters.max_price);
        }
        if (filters.city) {
          query = query.ilike('city', `%${filters.city}%`);
        }
        if (filters.county) {
          query = query.ilike('county', `%${filters.county}%`);
        }
        if (filters.bedrooms) {
          query = query.eq('bedrooms', filters.bedrooms);
        }
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location_address.ilike.%${filters.search}%`);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data as Property[];
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }

      return data as Property;
    },
    enabled: !!id,
  });
};

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching featured properties:', error);
        throw error;
      }

      return data as Property[];
    },
  });
};

export const useIncrementPropertyViews = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase.rpc('increment_property_views', {
        property_id: propertyId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (error: any) => {
      console.error('Error incrementing property views:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property views',
        variant: 'destructive',
      });
    },
  });
};

export const useCreatePropertyInquiry = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inquiryData: {
      property_id: string;
      inquirer_name: string;
      inquirer_email: string;
      inquirer_phone?: string;
      message: string;
      inquiry_type: 'general' | 'viewing' | 'purchase' | 'rent';
      preferred_contact_method: 'email' | 'phone' | 'whatsapp';
    }) => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert(inquiryData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Inquiry Sent',
        description: 'Your inquiry has been sent successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

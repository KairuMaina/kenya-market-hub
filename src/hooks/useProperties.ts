
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  owner_id: string;
  agent_id?: string;
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
  status: 'available' | 'sold' | 'rented' | 'pending';
  is_featured: boolean;
  views_count: number;
  images?: string[];
  virtual_tour_url?: string;
  contact_phone?: string;
  contact_email?: string;
  available_from?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  property_type?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  county?: string;
  city?: string;
}

export interface PropertyInquiry {
  property_id: string;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_phone?: string;
  message: string;
  inquiry_type: 'general' | 'viewing' | 'purchase' | 'rent';
  preferred_contact_method: 'email' | 'phone' | 'whatsapp';
}

export interface PropertyViewing {
  property_id: string;
  viewer_name: string;
  viewer_email: string;
  viewer_phone?: string;
  viewing_date: string;
  viewing_time: string;
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

      if (filters?.property_type) {
        query = query.eq('property_type', filters.property_type);
      }
      if (filters?.listing_type) {
        query = query.eq('listing_type', filters.listing_type);
      }
      if (filters?.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters?.max_price) {
        query = query.lte('price', filters.max_price);
      }
      if (filters?.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      if (filters?.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms);
      }
      if (filters?.county) {
        query = query.eq('county', filters.county);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Property[];
    },
  });
};

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
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

      if (error) throw error;
      return data as Property;
    },
    enabled: !!id,
  });
};

export const useCreatePropertyInquiry = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiry: PropertyInquiry) => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert([inquiry])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent successfully. You'll hear from us soon!",
      });
      queryClient.invalidateQueries({ queryKey: ['property-inquiries'] });
    },
    onError: (error) => {
      console.error('Error creating property inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useScheduleViewing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (viewing: PropertyViewing) => {
      const { data, error } = await supabase
        .from('property_viewings')
        .insert([viewing])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Viewing Scheduled",
        description: "Your property viewing has been scheduled successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['property-viewings'] });
    },
    onError: (error) => {
      console.error('Error scheduling viewing:', error);
      toast({
        title: "Error",
        description: "Failed to schedule viewing. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useIncrementPropertyViews = () => {
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase.rpc('increment_property_views', {
        property_id: propertyId
      });
      if (error) throw error;
    },
  });
};

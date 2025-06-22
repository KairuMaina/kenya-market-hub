import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  listing_type: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  location_address: string;
  agent_id?: string;
  owner_id?: string;
  images?: string[];
  amenities?: string[];
  features?: string[];
  status?: string;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
  is_featured?: boolean;
  location_coordinates?: {
    lat: number;
    lng: number;
  };
  county?: string;
  city?: string;
  virtual_tour_url?: string;
  contact_phone?: string;
  contact_email?: string;
  available_from?: string;
}

export interface PropertyFilters {
  location?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available');

      // Apply filters
      if (filters?.location) {
        query = query.ilike('location_address', `%${filters.location}%`);
      }
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.propertyType && ['house', 'apartment', 'land', 'commercial', 'office'].includes(filters.propertyType)) {
        query = query.eq('property_type', filters.propertyType as 'house' | 'apartment' | 'land' | 'commercial' | 'office');
      }
      if (filters?.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      if (filters?.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms);
      }

      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match expected interface
      return data?.map(property => ({
        ...property,
        property_type: property.property_type || 'apartment',
        location_address: property.location_address || 'No address provided',
        is_featured: property.is_featured || false,
        area_sqm: property.area_sqm || 0,
        views_count: property.views_count || 0,
        location_coordinates: property.location_coordinates ? {
          lat: property.location_coordinates.x || property.location_coordinates[0],
          lng: property.location_coordinates.y || property.location_coordinates[1]
        } : undefined
      })) as Property[];
    }
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
        .order('views_count', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      // Transform data to match expected interface
      return data?.map(property => ({
        ...property,
        property_type: property.property_type || 'apartment',
        location_address: property.location_address || 'No address provided',
        is_featured: true,
        area_sqm: property.area_sqm || 0,
        views_count: property.views_count || 0
      })) as Property[];
    }
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
      
      // Transform data to match expected interface
      return {
        ...data,
        property_type: data.property_type || 'apartment',
        location_address: data.location_address || 'No address provided',
        is_featured: data.is_featured || false,
        area_sqm: data.area_sqm || 0,
        views_count: data.views_count || 0
      } as Property;
    },
    enabled: !!id
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
      message?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('property_inquiries')
        .insert({
          property_id: inquiryData.property_id,
          inquirer_name: inquiryData.inquirer_name,
          inquirer_email: inquiryData.inquirer_email,
          inquirer_phone: inquiryData.inquirer_phone,
          message: inquiryData.message || '',
          inquirer_id: user?.id,
          status: 'new'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Inquiry sent successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error sending inquiry',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

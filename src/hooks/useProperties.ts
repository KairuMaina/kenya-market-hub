import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  listing_type: string;
  property_type: string; // Make this required
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  location?: string;
  address?: string;
  agent_id?: string;
  owner_id?: string;
  images?: any;
  amenities?: any;
  status?: string;
  views?: number;
  created_at?: string;
  updated_at?: string;
  // Additional properties that components expect
  location_address: string;
  is_featured?: boolean;
  area_sqm?: number;
  views_count?: number;
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
        .eq('status', 'active');

      // Apply filters
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.city) {
        query = query.ilike('address', `%${filters.city}%`);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
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
        property_type: property.property_type || 'apartment', // Provide default value
        location_address: property.address || property.location || 'No address provided',
        is_featured: false, // Mock featured property
        area_sqm: property.area || 0,
        views_count: property.views || 0
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
        .eq('status', 'active')
        .order('views', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      // Transform data to match expected interface
      return data?.map(property => ({
        ...property,
        property_type: property.property_type || 'apartment', // Provide default value
        location_address: property.address || property.location || 'No address provided',
        is_featured: true,
        area_sqm: property.area || 0,
        views_count: property.views || 0
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
        property_type: data.property_type || 'apartment', // Provide default value
        location_address: data.address || data.location || 'No address provided',
        is_featured: false,
        area_sqm: data.area || 0,
        views_count: data.views || 0
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
      full_name: string;
      email: string;
      phone?: string;
      message?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('property_inquiries')
        .insert({
          ...inquiryData,
          user_id: user?.id,
          status: 'pending'
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

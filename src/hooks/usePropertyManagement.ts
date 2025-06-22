
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';

export interface PropertyFormData {
  title: string;
  description?: string;
  property_type: string;
  listing_type: string;
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
  virtual_tour_url?: string;
  contact_phone?: string;
  contact_email?: string;
  available_from?: string;
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (propertyData: PropertyFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          owner_id: user.id,
          status: 'available',
          is_featured: false,
          views_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({ title: 'Property created successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating property',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => {
      const { data: updatedProperty, error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({ title: 'Property updated successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating property',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({ title: 'Property deleted successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting property',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

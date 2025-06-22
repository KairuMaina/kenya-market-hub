
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Property, PropertyFormData } from '@/types/property';

export { type PropertyFormData } from '@/types/property';

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
          status: 'available' as const,
          is_featured: propertyData.is_featured || false,
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

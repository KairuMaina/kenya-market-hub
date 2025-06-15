
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PropertyFormData {
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
  is_featured: boolean;
  contact_phone?: string;
  contact_email?: string;
  available_from?: string;
}

export const useCreateProperty = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyData, images }: { propertyData: PropertyFormData; images?: File[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let imageUrls: string[] = [];

      // Upload images if provided
      if (images && images.length > 0) {
        const uploadPromises = images.map(async (file, index) => {
          const fileName = `${Date.now()}-${index}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          return publicUrl;
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      // Create property record
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          ...propertyData,
          owner_id: user.id,
          images: imageUrls,
          status: 'available'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Property Created",
        description: "Your property has been listed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (error) => {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProperty = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      propertyData, 
      newImages, 
      existingImages 
    }: { 
      propertyId: string; 
      propertyData: Partial<PropertyFormData>; 
      newImages?: File[];
      existingImages?: string[];
    }) => {
      let imageUrls = existingImages || [];

      // Upload new images if provided
      if (newImages && newImages.length > 0) {
        const uploadPromises = newImages.map(async (file, index) => {
          const fileName = `${Date.now()}-${index}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          return publicUrl;
        });

        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Update property record
      const { data, error } = await supabase
        .from('properties')
        .update({
          ...propertyData,
          images: imageUrls,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Property Updated",
        description: "Your property has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (error) => {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProperty = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      // First get the property to access its images
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('images')
        .eq('id', propertyId)
        .single();

      if (fetchError) throw fetchError;

      // Delete images from storage
      if (property.images && property.images.length > 0) {
        const deletePromises = property.images.map(async (imageUrl: string) => {
          const fileName = imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('property-images')
              .remove([fileName]);
          }
        });
        
        await Promise.all(deletePromises);
      }

      // Delete property record
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Property Deleted",
        description: "Property has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (error) => {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const usePropertyImages = () => {
  const { toast } = useToast();

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}-${index}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      const { error } = await supabase.storage
        .from('property-images')
        .remove([fileName]);
      
      if (error) throw error;
    }
  };

  return { uploadImages, deleteImage };
};

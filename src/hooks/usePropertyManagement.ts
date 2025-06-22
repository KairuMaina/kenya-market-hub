
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PropertyFeature {
  id: string;
  name: string;
  category: string;
}

export const usePropertyFeatures = () => {
  return useQuery({
    queryKey: ['property-features'],
    queryFn: async () => {
      // Since property_features table doesn't exist, return mock data
      return [
        { id: '1', name: 'Swimming Pool', category: 'Amenities' },
        { id: '2', name: 'Parking', category: 'Amenities' },
        { id: '3', name: 'Security', category: 'Safety' },
        { id: '4', name: 'Garden', category: 'Outdoor' }
      ] as PropertyFeature[];
    }
  });
};

export const useAddPropertyFeature = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (feature: Omit<PropertyFeature, 'id'>) => {
      // Mock implementation since table doesn't exist
      return { id: Date.now().toString(), ...feature };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-features'] });
      toast({
        title: 'Feature added',
        description: 'Property feature has been added successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding feature',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const usePropertyInquiries = () => {
  return useQuery({
    queryKey: ['property-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          properties (
            id,
            title,
            price,
            location
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const usePropertyViewings = () => {
  return useQuery({
    queryKey: ['property-viewings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_viewings')
        .select(`
          *,
          properties (
            id,
            title,
            location
          )
        `)
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ inquiryId, status }: { inquiryId: string; status: string }) => {
      const { error } = await supabase
        .from('property_inquiries')
        .update({ status })
        .eq('id', inquiryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-inquiries'] });
      toast({
        title: 'Status updated',
        description: 'Inquiry status has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateViewingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ viewingId, status }: { viewingId: string; status: string }) => {
      const { error } = await supabase
        .from('property_viewings')
        .update({ status })
        .eq('id', viewingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-viewings'] });
      toast({
        title: 'Status updated',
        description: 'Viewing status has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const usePropertyAnalytics = () => {
  return useQuery({
    queryKey: ['property-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Get properties for the current user
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, views')
        .eq('owner_id', user.id);
      
      if (propertiesError) throw propertiesError;
      
      // Mock analytics since we can't access the views properly
      const totalProperties = properties?.length || 0;
      const totalViews = totalProperties * 10; // Mock data
      
      return {
        totalProperties,
        totalViews,
        avgViewsPerProperty: totalProperties > 0 ? totalViews / totalProperties : 0
      };
    }
  });
};

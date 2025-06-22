
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
      const { data, error } = await supabase
        .from('property_features')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as PropertyFeature[];
    }
  });
};

export const useAddPropertyFeature = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (feature: Omit<PropertyFeature, 'id'>) => {
      const { data, error } = await supabase
        .from('property_features')
        .insert([feature])
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      
      // Since 'views' might be stored as JSON, handle it properly
      const totalViews = properties?.reduce((sum, property) => {
        const views = property.views;
        if (typeof views === 'number') {
          return sum + views;
        } else if (Array.isArray(views)) {
          return sum + views.length;
        }
        return sum;
      }, 0) || 0;
      
      const totalProperties = properties?.length || 0;
      
      return {
        totalProperties,
        totalViews,
        avgViewsPerProperty: totalProperties > 0 ? totalViews / totalProperties : 0
      };
    }
  });
};

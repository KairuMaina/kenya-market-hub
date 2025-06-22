
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ServiceProviderProfile {
  id: string;
  user_id: string;
  provider_type: 'vendor' | 'driver' | 'property_owner' | 'service_provider';
  business_name?: string;
  business_description?: string;
  phone_number?: string;
  email?: string;
  location_address?: string;
  location_coordinates?: { lat: number; lng: number };
  documents?: any;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useServiceProviderProfile = (providerType: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['service-provider-profile', user?.id, providerType],
    queryFn: async () => {
      if (!user) return null;

      // Mock implementation since service_provider_profiles table doesn't exist yet
      return null as ServiceProviderProfile | null;
    },
    enabled: !!user,
  });
};

export const useCreateServiceProviderProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: Omit<ServiceProviderProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Mock implementation since table doesn't exist
      return {
        id: Date.now().toString(),
        user_id: user.id,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as ServiceProviderProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      toast({
        title: 'Profile Created',
        description: 'Service provider profile created successfully!',
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

export const useUpdateServiceProviderProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ServiceProviderProfile> }) => {
      // Mock implementation since table doesn't exist
      return { id, ...updates, updated_at: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-provider-profile'] });
      toast({
        title: 'Profile Updated',
        description: 'Service provider profile updated successfully!',
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

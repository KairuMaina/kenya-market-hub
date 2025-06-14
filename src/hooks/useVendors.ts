
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  business_description?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  logo_url?: string;
  banner_url?: string;
  website_url?: string;
  social_media?: any;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

export interface VendorApplication {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_license?: string;
  tax_id?: string;
  bank_details?: any;
  documents?: any;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .eq('verification_status', 'approved')
        .order('business_name');
      
      if (error) throw error;
      return data as Vendor[];
    }
  });
};

export const useVendorApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationData: Omit<VendorApplication, 'id' | 'user_id' | 'status' | 'submitted_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('vendor_applications')
        .insert({
          ...applicationData,
          user_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      toast({ title: 'Vendor application submitted successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useMyVendorProfile = () => {
  return useQuery({
    queryKey: ['my-vendor-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Vendor | null;
    }
  });
};


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
  service_type?: string;
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
      
      return data?.map(vendor => ({
        ...vendor,
        commission_rate: 0,
      })) as Vendor[] || [];
    }
  });
};

export const useVendorApplications = () => {
  return useQuery({
    queryKey: ['vendor-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('status', 'pending')
        .eq('service_type', 'products')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending vendor applications:', error);
        return [];
      }

      return data?.map(app => ({
        id: app.id,
        user_id: app.user_id,
        business_name: app.business_name,
        business_description: app.business_description,
        business_address: app.business_address || '',
        business_phone: app.business_phone || '',  
        business_email: app.business_email || '',
        business_license: app.business_license || '',
        tax_id: app.tax_id || '',
        documents: app.documents,
        status: app.status,
        admin_notes: app.admin_notes || '',
        submitted_at: app.submitted_at,
        reviewed_at: app.reviewed_at || '',
        reviewed_by: app.reviewed_by || '',
        service_type: app.service_type,
      })) as VendorApplication[] || [];
    },
  });
};

export const useVendorApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationData: Omit<VendorApplication, 'id' | 'user_id' | 'status' | 'submitted_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      if (
        !applicationData.business_name ||
        !applicationData.business_description
      ) {
        throw new Error("One or more required fields are missing.");
      }

      const serviceType = applicationData.service_type || 'products';

      const { data, error } = await supabase
        .from('vendor_applications')
        .insert({
          business_name: applicationData.business_name,
          business_description: applicationData.business_description,
          business_email: applicationData.business_email,
          business_phone: applicationData.business_phone,
          business_address: applicationData.business_address,
          user_id: user.id,
          status: 'pending',
          submitted_at: new Date().toISOString(),
          service_type: serviceType
        });

      if (error) {
        console.error("Vendor application insert error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-vendor-profile'] });
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

      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (vendorError && vendorError.code !== 'PGRST116') {
        throw vendorError;
      }

      if (vendorProfile) {
        return {
          ...vendorProfile,
          commission_rate: 0,
        } as Vendor;
      }

      const { data: vendorApplication, error: vendorAppError } = await supabase
        .from('vendor_applications')
        .select('status, business_name, business_description, business_email, business_phone, submitted_at, service_type')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (vendorAppError) throw vendorAppError;
      
      if (vendorApplication && (vendorApplication.status === 'pending' || vendorApplication.status === 'rejected')) {
        return {
          id: '',
          user_id: user.id,
          verification_status: vendorApplication.status,
          business_name: vendorApplication.business_name,
          business_description: vendorApplication.business_description,
          business_email: vendorApplication.business_email,
          business_phone: vendorApplication.business_phone,
          is_active: false,
          commission_rate: 0,
          created_at: vendorApplication.submitted_at,
          updated_at: vendorApplication.submitted_at,
        } as Vendor;
      }
      
      return null;
    }
  });
};


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

export const useVendorApplications = () => {
  return useQuery({
    queryKey: ['vendor-applications'],
    queryFn: async () => {
      console.log('🔍 Starting vendor applications fetch...');
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('👤 Current user:', user?.email || 'Not logged in');
        console.log('👤 User error:', userError);

        console.log('🔧 Testing basic table access...');
        const { data: testData, error: testError } = await supabase
          .from('vendor_applications')
          .select('count', { count: 'exact', head: true });
        
        console.log('🔧 Test count result:', testData);
        console.log('🔧 Test count error:', testError);

        console.log('📊 Executing main query...');
        const { data, error, count } = await supabase
          .from('vendor_applications')
          .select('*', { count: 'exact' })
          .order('submitted_at', { ascending: false });
        
        console.log('📊 Raw Supabase response:', { data, error, count });
        console.log('📊 Applications count from Supabase:', count);
        console.log('📊 Data type:', typeof data);
        console.log('📊 Data is array:', Array.isArray(data));
        
        if (error) {
          console.error('❌ Supabase query error:', error);
          console.error('❌ Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        if (!data) {
          console.warn('⚠️ No data returned from Supabase');
          return [];
        }
        
        console.log('✅ Successfully fetched applications:', data.length);
        if (data.length > 0) {
          console.log('📝 First application sample:', data[0]);
          console.log('📝 All application IDs:', data.map(app => app.id));
        }
        
        return data as VendorApplication[];
      } catch (err) {
        console.error('💥 Vendor applications fetch failed:', err);
        console.error('💥 Error type:', typeof err);
        console.error('💥 Error constructor:', err?.constructor?.name);
        if (err instanceof Error) {
          console.error('💥 Error message:', err.message);
          console.error('💥 Error stack:', err.stack);
        }
        throw err;
      }
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
      
      if (
        !applicationData.business_name ||
        !applicationData.business_description ||
        !applicationData.business_address ||
        !applicationData.business_phone ||
        !applicationData.business_email
      ) {
        throw new Error("One or more required fields are missing.");
      }

      const { data, error } = await supabase
        .from('vendor_applications')
        .insert({
          ...applicationData,
          user_id: user.id,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (error) {
        console.error("Vendor application insert error:", error);
        throw error;
      } else {
        console.log("Vendor application insert result:", data);
      }

      return data;
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

export const useApproveVendorApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      console.log('✅ Approving vendor application:', applicationId);

      const { data, error } = await supabase.rpc('approve_vendor_application', {
        application_id: applicationId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Vendor application approved successfully' });
    },
    onError: (error: any) => {
      console.error('❌ Error approving vendor application:', error);
      toast({
        title: 'Error approving application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useRejectVendorApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      console.log('❌ Rejecting vendor application:', applicationId);

      const { data, error } = await supabase.rpc('reject_vendor_application', {
        application_id: applicationId,
        rejection_notes: notes
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Vendor application rejected' });
    },
    onError: (error: any) => {
      console.error('❌ Error rejecting vendor application:', error);
      toast({
        title: 'Error rejecting application',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  user_usage_limit?: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = data?.map(coupon => ({
        ...coupon,
        name: coupon.name || coupon.code,
        discount_amount: coupon.discount_value,
        usage_count: coupon.usage_count || 0,
        user_usage_limit: coupon.user_usage_limit || 1,
        maximum_discount_amount: coupon.maximum_discount_amount || null,
        expires_at: coupon.end_date
      })) || [];
      
      return transformedData as Coupon[];
    }
  });
};

export const useValidateCoupon = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ code, orderAmount }: { code: string; orderAmount: number }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('calculate_coupon_discount', {
        p_coupon_code: code,
        p_order_amount: orderAmount,
        p_user_id: user.id
      });
      
      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      toast({
        title: 'Error validating coupon',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (coupon: Partial<Coupon>) => {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: coupon.code,
          name: coupon.name,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          minimum_order_amount: coupon.minimum_order_amount,
          usage_limit: coupon.usage_limit,
          start_date: new Date().toISOString(),
          end_date: coupon.expires_at,
          is_active: coupon.is_active
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast({ title: 'Coupon created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating coupon',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useUseCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ couponId, userId, orderId, discountApplied }: {
      couponId: string;
      userId: string;
      orderId: string;
      discountApplied: number;
    }) => {
      const { error } = await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: couponId,
          user_id: userId,
          order_id: orderId,
          used_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });
};

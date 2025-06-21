
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
        name: coupon.code, // Use code as name if name doesn't exist
        discount_value: coupon.discount_amount,
        usage_count: coupon.used_count || 0,
        user_usage_limit: 1, // Default value
        maximum_discount_amount: null
      })) || [];
      
      return transformedData as Coupon[];
    }
  });
};

export const useValidateCoupon = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ code, orderAmount }: { code: string; orderAmount: number }) => {
      const { data, error } = await supabase.rpc('calculate_coupon_discount', {
        p_coupon_code: code,
        p_order_amount: orderAmount
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
          discount_type: coupon.discount_type,
          discount_amount: coupon.discount_value,
          minimum_order_amount: coupon.minimum_order_amount,
          usage_limit: coupon.usage_limit,
          expires_at: coupon.expires_at,
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
          discount_applied: discountApplied
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });
};

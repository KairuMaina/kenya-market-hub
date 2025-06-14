
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  user_usage_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_categories?: string[];
  applicable_products?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useActiveCoupons = () => {
  return useQuery({
    queryKey: ['active-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Coupon[];
    }
  });
};

export const useValidateCoupon = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      code, 
      orderAmount, 
      productCategories 
    }: { 
      code: string; 
      orderAmount: number; 
      productCategories?: string[] 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('calculate_coupon_discount', {
        p_coupon_code: code,
        p_order_amount: orderAmount,
        p_user_id: user.id,
        p_product_categories: productCategories
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

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      couponId, 
      orderId 
    }: { 
      couponId: string; 
      orderId: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: couponId,
          user_id: user.id,
          order_id: orderId
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupon-usage'] });
      toast({ title: 'Coupon applied successfully!' });
    }
  });
};

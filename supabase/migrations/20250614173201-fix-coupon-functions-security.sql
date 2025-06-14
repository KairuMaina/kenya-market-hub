
-- Fix security warnings for coupon-related functions
-- This migration sets proper search_path for coupon functions

-- Fix calculate_coupon_discount function
CREATE OR REPLACE FUNCTION public.calculate_coupon_discount(p_coupon_code text, p_order_amount numeric, p_user_id uuid, p_product_categories text[] DEFAULT NULL::text[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_coupon public.coupons%ROWTYPE;
  v_discount_amount DECIMAL := 0;
  v_usage_count INTEGER := 0;
BEGIN
  -- Get coupon details
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE code = p_coupon_code
    AND is_active = true
    AND start_date <= now()
    AND end_date >= now();
    
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired coupon');
  END IF;
  
  -- Check minimum order amount
  IF p_order_amount < v_coupon.minimum_order_amount THEN
    RETURN jsonb_build_object(
      'valid', false, 
      'error', 'Minimum order amount not met',
      'minimum_amount', v_coupon.minimum_order_amount
    );
  END IF;
  
  -- Check usage limits
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon usage limit exceeded');
  END IF;
  
  -- Check user usage limit
  SELECT COUNT(*) INTO v_usage_count
  FROM public.coupon_usage
  WHERE coupon_id = v_coupon.id AND user_id = p_user_id;
  
  IF v_coupon.user_usage_limit IS NOT NULL AND v_usage_count >= v_coupon.user_usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'You have already used this coupon');
  END IF;
  
  -- Calculate discount
  IF v_coupon.discount_type = 'percentage' THEN
    v_discount_amount := (p_order_amount * v_coupon.discount_value / 100);
  ELSE
    v_discount_amount := v_coupon.discount_value;
  END IF;
  
  -- Apply maximum discount limit
  IF v_coupon.maximum_discount_amount IS NOT NULL AND v_discount_amount > v_coupon.maximum_discount_amount THEN
    v_discount_amount := v_coupon.maximum_discount_amount;
  END IF;
  
  -- Ensure discount doesn't exceed order amount
  IF v_discount_amount > p_order_amount THEN
    v_discount_amount := p_order_amount;
  END IF;
  
  RETURN jsonb_build_object(
    'valid', true,
    'discount_amount', v_discount_amount,
    'coupon_id', v_coupon.id,
    'coupon_name', v_coupon.name
  );
END;
$function$;

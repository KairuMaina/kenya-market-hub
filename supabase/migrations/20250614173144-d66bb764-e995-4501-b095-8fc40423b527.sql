
-- Fix security warnings by setting proper search_path for all functions
-- This prevents potential security issues with mutable search paths

-- Fix update_product_rating function
CREATE OR REPLACE FUNCTION public.update_product_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.products 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix upsert_recently_viewed function
CREATE OR REPLACE FUNCTION public.upsert_recently_viewed(p_user_id uuid, p_product_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.recently_viewed (user_id, product_id, viewed_at)
  VALUES (p_user_id, p_product_id, now())
  ON CONFLICT (user_id, product_id) 
  DO UPDATE SET viewed_at = now();
  
  -- Keep only the latest 20 items per user
  DELETE FROM public.recently_viewed 
  WHERE user_id = p_user_id 
  AND id NOT IN (
    SELECT id FROM public.recently_viewed 
    WHERE user_id = p_user_id 
    ORDER BY viewed_at DESC 
    LIMIT 20
  );
END;
$function$;

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

-- Fix ensure_single_primary_image function
CREATE OR REPLACE FUNCTION public.ensure_single_primary_image()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE public.product_images 
    SET is_primary = false 
    WHERE product_id = NEW.product_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix has_role function (first version)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE 
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix find_nearby_drivers function (already has SECURITY DEFINER, just need SET search_path)
CREATE OR REPLACE FUNCTION public.find_nearby_drivers(pickup_lat double precision, pickup_lng double precision, vehicle_type_param vehicle_type, radius_km double precision DEFAULT 10)
 RETURNS TABLE(driver_id uuid, distance_km numeric, estimated_pickup_minutes integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    ROUND(
      ST_Distance(
        ST_GeogFromText('POINT(' || pickup_lng || ' ' || pickup_lat || ')'),
        COALESCE(d.current_location, ST_GeogFromText('POINT(36.8219 -1.2921)'))
      ) / 1000, 2
    )::NUMERIC(8,2) as distance_km,
    ROUND(
      ST_Distance(
        ST_GeogFromText('POINT(' || pickup_lng || ' ' || pickup_lat || ')'),
        COALESCE(d.current_location, ST_GeogFromText('POINT(36.8219 -1.2921)'))
      ) / 1000 * 2.5
    )::INTEGER as estimated_pickup_minutes
  FROM public.drivers d
  WHERE 
    d.is_active = true 
    AND d.is_verified = true
    AND d.status = 'available'
    AND d.vehicle_type = vehicle_type_param
    AND ST_DWithin(
      ST_GeogFromText('POINT(' || pickup_lng || ' ' || pickup_lat || ')'),
      COALESCE(d.current_location, ST_GeogFromText('POINT(36.8219 -1.2921)')),
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 5;
END;
$function$;

-- Fix expire_old_ride_requests function (already has SECURITY DEFINER, just need SET search_path)
CREATE OR REPLACE FUNCTION public.expire_old_ride_requests()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.driver_ride_requests 
  SET status = 'expired'
  WHERE status = 'pending' 
    AND expires_at < now();
END;
$function$;

-- Remove the duplicate has_role function (the one with bigint parameter appears to be outdated)
DROP FUNCTION IF EXISTS public.has_role(bigint, text);


-- Fix security warnings for product-related functions
-- This migration sets proper search_path for product functions

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

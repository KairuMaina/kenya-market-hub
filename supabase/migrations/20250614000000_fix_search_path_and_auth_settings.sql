-- Fix mutable search_path in functions by setting stable search_path

ALTER FUNCTION public.get_driver_analytics()
  SET search_path = public, pg_catalog;

ALTER FUNCTION public.get_popular_routes()
  SET search_path = public, pg_catalog;

ALTER FUNCTION public.reject_vendor_application()
  SET search_path = public, pg_catalog;

ALTER FUNCTION public.approve_vendor_application()
  SET search_path = public, pg_catalog;

-- Adjust OTP expiry to less than 1 hour (e.g., 30 minutes)
-- This assumes you have a way to update the auth config via SQL or API
-- Supabase does not provide direct SQL for this, so you may need to update via dashboard or API

-- Enable leaked password protection
-- This is also typically enabled via Supabase dashboard or API, not SQL
-- Provide instructions for manual enablement below

-- Instructions:
-- 1. Go to Supabase Dashboard > Authentication > Settings > Password Policy
-- 2. Set OTP expiry to 30 minutes or less
-- 3. Enable Leaked Password Protection toggle

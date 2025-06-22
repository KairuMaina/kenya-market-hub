
-- Fix mutable search_path security warnings for database functions
-- Set proper search_path for security compliance

-- Fix get_driver_analytics function
ALTER FUNCTION public.get_driver_analytics(uuid) 
  SET search_path = 'public';

-- Fix get_popular_routes function  
ALTER FUNCTION public.get_popular_routes(integer)
  SET search_path = 'public';

-- Fix reject_vendor_application function
ALTER FUNCTION public.reject_vendor_application(uuid, text)
  SET search_path = 'public';

-- Fix approve_vendor_application function
ALTER FUNCTION public.approve_vendor_application(uuid)
  SET search_path = 'public';

-- Note: OTP expiry and leaked password protection settings cannot be changed via SQL
-- These must be updated manually in the Supabase Dashboard:
-- 1. Go to Authentication > Settings > Password Policy
-- 2. Set OTP expiry to 30 minutes or less (currently over 1 hour)
-- 3. Enable "Leaked Password Protection" toggle

-- The above dashboard settings are required to resolve the remaining security warnings:
-- - auth_otp_long_expiry
-- - auth_leaked_password_protection

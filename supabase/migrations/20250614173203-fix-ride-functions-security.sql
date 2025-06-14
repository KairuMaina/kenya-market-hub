
-- Fix security warnings for ride-related functions
-- This migration sets proper search_path for ride functions

-- Fix find_nearby_drivers function
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

-- Fix expire_old_ride_requests function
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

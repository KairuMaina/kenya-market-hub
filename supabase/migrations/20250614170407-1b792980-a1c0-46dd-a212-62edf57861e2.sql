
-- Add driver availability and location tracking enhancements
UPDATE public.fare_calculations 
SET base_fare = 200, per_km_rate = 60, per_minute_rate = 8, minimum_fare = 200 
WHERE vehicle_type = 'taxi';

UPDATE public.fare_calculations 
SET base_fare = 100, per_km_rate = 40, per_minute_rate = 5, minimum_fare = 100 
WHERE vehicle_type = 'motorbike';

-- Create driver_ride_requests table for matching system
CREATE TABLE IF NOT EXISTS public.driver_ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  distance_km NUMERIC(8,2),
  estimated_pickup_minutes INTEGER,
  sent_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '2 minutes'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_driver_ride_requests_ride_id ON public.driver_ride_requests(ride_id);
CREATE INDEX IF NOT EXISTS idx_driver_ride_requests_driver_id ON public.driver_ride_requests(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_ride_requests_status ON public.driver_ride_requests(status);
CREATE INDEX IF NOT EXISTS idx_driver_ride_requests_expires ON public.driver_ride_requests(expires_at) WHERE status = 'pending';

-- Enable RLS on driver_ride_requests
ALTER TABLE public.driver_ride_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for driver_ride_requests
CREATE POLICY "Drivers can view their ride requests" ON public.driver_ride_requests
  FOR SELECT USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "System can manage ride requests" ON public.driver_ride_requests
  FOR ALL USING (true);

-- Enable realtime for driver_ride_requests
ALTER TABLE public.driver_ride_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_ride_requests;

-- Function to find nearby available drivers
CREATE OR REPLACE FUNCTION find_nearby_drivers(
  pickup_lat FLOAT,
  pickup_lng FLOAT,
  vehicle_type_param vehicle_type,
  radius_km FLOAT DEFAULT 10
)
RETURNS TABLE (
  driver_id UUID,
  distance_km NUMERIC,
  estimated_pickup_minutes INTEGER
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically expire old ride requests
CREATE OR REPLACE FUNCTION expire_old_ride_requests()
RETURNS void AS $$
BEGIN
  UPDATE public.driver_ride_requests 
  SET status = 'expired'
  WHERE status = 'pending' 
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

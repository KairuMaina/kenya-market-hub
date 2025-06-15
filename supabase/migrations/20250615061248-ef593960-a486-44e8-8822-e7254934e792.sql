
-- Create a table to store routes saved by drivers
CREATE TABLE public.driver_saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security for the new table
ALTER TABLE public.driver_saved_routes ENABLE ROW LEVEL SECURITY;

-- Create a policy to ensure drivers can only access their own saved routes
CREATE POLICY "Drivers can manage their own saved routes" ON public.driver_saved_routes
  FOR ALL
  USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

-- Create a function to get analytics data for a specific driver
CREATE OR REPLACE FUNCTION get_driver_analytics(p_driver_id UUID)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    peak_hours_result jsonb;
    best_day_result jsonb;
    top_destination_result jsonb;
    avg_rating_result NUMERIC;
BEGIN
    -- Peak Hours (hour of day with most rides)
    SELECT jsonb_build_object('hour', EXTRACT(HOUR FROM completed_at), 'rides', COUNT(*))
    INTO peak_hours_result
    FROM rides
    WHERE driver_id = p_driver_id AND status = 'completed'
    GROUP BY EXTRACT(HOUR FROM completed_at)
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Best Day (day of week with most rides)
    SELECT jsonb_build_object('day_index', EXTRACT(ISODOW FROM completed_at), 'day_name', TRIM(TO_CHAR(completed_at, 'Day')), 'rides', COUNT(*))
    INTO best_day_result
    FROM rides
    WHERE driver_id = p_driver_id AND status = 'completed'
    GROUP BY EXTRACT(ISODOW FROM completed_at), TO_CHAR(completed_at, 'Day')
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Top Destination Area
    SELECT jsonb_build_object('address', destination_address, 'rides', COUNT(*))
    INTO top_destination_result
    FROM rides
    WHERE driver_id = p_driver_id AND status = 'completed' AND destination_address IS NOT NULL
    GROUP BY destination_address
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Average Rating from drivers table
    SELECT rating INTO avg_rating_result FROM drivers WHERE id = p_driver_id;

    result := jsonb_build_object(
        'peak_hours', peak_hours_result,
        'best_day', best_day_result,
        'top_destination', top_destination_result,
        'average_rating', avg_rating_result
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the most popular routes across the platform
CREATE OR REPLACE FUNCTION get_popular_routes(limit_count INT)
RETURNS TABLE (
    from_address TEXT,
    to_address TEXT,
    ride_count BIGINT,
    avg_fare NUMERIC,
    avg_duration_minutes INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.pickup_address AS from_address,
        r.destination_address AS to_address,
        COUNT(*) AS ride_count,
        ROUND(AVG(r.actual_fare)) AS avg_fare,
        ROUND(AVG(r.duration_minutes))::INT AS avg_duration_minutes
    FROM rides r
    WHERE r.status = 'completed' AND r.pickup_address IS NOT NULL AND r.destination_address IS NOT NULL
    GROUP BY r.pickup_address, r.destination_address
    HAVING COUNT(*) > 1
    ORDER BY ride_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

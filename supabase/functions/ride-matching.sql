
-- Function to get nearby drivers for ride matching
CREATE OR REPLACE FUNCTION get_nearby_drivers(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT DEFAULT 10
)
RETURNS TABLE (
  driver_id UUID,
  driver_name TEXT,
  phone_number TEXT,
  vehicle_type vehicle_type,
  vehicle_make TEXT,
  vehicle_model TEXT,
  license_plate TEXT,
  rating NUMERIC,
  distance_km FLOAT,
  location_lat FLOAT,
  location_lng FLOAT,
  last_update TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id as driver_id,
    d.phone_number as driver_name,
    d.phone_number,
    d.vehicle_type,
    d.vehicle_make,
    d.vehicle_model,
    d.license_plate,
    d.rating,
    ST_Distance(
      ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
      ST_GeogFromText('POINT(' || ST_X(dl.location) || ' ' || ST_Y(dl.location) || ')')
    ) / 1000 as distance_km,
    ST_Y(dl.location) as location_lat,
    ST_X(dl.location) as location_lng,
    dl.timestamp as last_update
  FROM drivers d
  JOIN driver_locations dl ON d.id = dl.driver_id
  WHERE 
    d.is_verified = true 
    AND d.is_active = true
    AND d.status = 'available'
    AND dl.is_active = true
    AND ST_DWithin(
      ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
      ST_GeogFromText('POINT(' || ST_X(dl.location) || ' ' || ST_Y(dl.location) || ')'),
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate enhanced fare with surge pricing
CREATE OR REPLACE FUNCTION calculate_enhanced_fare(
  vehicle_type vehicle_type,
  pickup_lat FLOAT,
  pickup_lng FLOAT,
  dest_lat FLOAT,
  dest_lng FLOAT
)
RETURNS TABLE (
  estimated_fare NUMERIC,
  base_fare NUMERIC,
  distance_fare NUMERIC,
  surge_multiplier NUMERIC,
  distance_km FLOAT
) AS $$
DECLARE
  fare_calc RECORD;
  surge_rate NUMERIC := 1.0;
  calc_distance FLOAT;
  pickup_point GEOMETRY;
  current_time TIME;
  current_day INTEGER;
BEGIN
  -- Get base fare calculation
  SELECT * INTO fare_calc 
  FROM fare_calculations 
  WHERE fare_calculations.vehicle_type = calculate_enhanced_fare.vehicle_type
    AND is_active = true 
  LIMIT 1;
  
  IF fare_calc IS NULL THEN
    RAISE EXCEPTION 'No fare calculation found for vehicle type %', vehicle_type;
  END IF;
  
  -- Calculate distance using PostGIS
  pickup_point := ST_GeogFromText('POINT(' || pickup_lng || ' ' || pickup_lat || ')');
  calc_distance := ST_Distance(
    pickup_point,
    ST_GeogFromText('POINT(' || dest_lng || ' ' || dest_lat || ')')
  ) / 1000; -- Convert to kilometers
  
  -- Check for surge pricing
  current_time := CURRENT_TIME;
  current_day := EXTRACT(DOW FROM CURRENT_DATE) + 1; -- Convert to 1-7 format
  
  SELECT surge_pricing.surge_multiplier INTO surge_rate
  FROM surge_pricing
  WHERE 
    surge_pricing.vehicle_type = calculate_enhanced_fare.vehicle_type
    AND is_active = true
    AND (
      start_time IS NULL OR end_time IS NULL OR
      (current_time >= start_time AND current_time <= end_time)
    )
    AND current_day = ANY(days_of_week)
    AND ST_Within(
      pickup_point::geometry,
      ST_GeomFromGeoJSON(location_bounds::text)
    )
  ORDER BY surge_pricing.surge_multiplier DESC
  LIMIT 1;
  
  IF surge_rate IS NULL THEN
    surge_rate := 1.0;
  END IF;
  
  -- Calculate total fare
  RETURN QUERY SELECT 
    GREATEST(
      (fare_calc.base_fare + (calc_distance * fare_calc.per_km_rate)) * surge_rate,
      fare_calc.minimum_fare * surge_rate
    ) as estimated_fare,
    fare_calc.base_fare,
    calc_distance * fare_calc.per_km_rate as distance_fare,
    surge_rate as surge_multiplier,
    calc_distance as distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

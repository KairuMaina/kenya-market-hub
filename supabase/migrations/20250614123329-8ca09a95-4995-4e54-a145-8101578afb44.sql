
-- Create enum for vehicle types
CREATE TYPE public.vehicle_type AS ENUM ('taxi', 'motorbike');

-- Create enum for ride status
CREATE TYPE public.ride_status AS ENUM ('requested', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Create enum for driver status
CREATE TYPE public.driver_status AS ENUM ('offline', 'available', 'busy');

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  license_plate TEXT NOT NULL,
  license_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0,
  total_rides INTEGER DEFAULT 0,
  status driver_status DEFAULT 'offline',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  current_location POINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create rides table
CREATE TABLE public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  pickup_location POINT NOT NULL,
  pickup_address TEXT NOT NULL,
  destination_location POINT NOT NULL,
  destination_address TEXT NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  estimated_fare NUMERIC(10,2),
  actual_fare NUMERIC(10,2),
  distance_km NUMERIC(8,2),
  duration_minutes INTEGER,
  status ride_status DEFAULT 'requested',
  requested_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create ride_requests table for real-time matching
CREATE TABLE public.ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create fare_calculations table
CREATE TABLE public.fare_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type vehicle_type NOT NULL,
  base_fare NUMERIC(8,2) NOT NULL,
  per_km_rate NUMERIC(8,2) NOT NULL,
  per_minute_rate NUMERIC(8,2) NOT NULL,
  minimum_fare NUMERIC(8,2) NOT NULL,
  surge_multiplier NUMERIC(3,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fare_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drivers
CREATE POLICY "Drivers can view their own profile" ON public.drivers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Drivers can update their own profile" ON public.drivers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can view active drivers" ON public.drivers
  FOR SELECT USING (is_active = true AND is_verified = true);

-- RLS Policies for rides
CREATE POLICY "Users can view their own rides" ON public.rides
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Drivers can view their assigned rides" ON public.rides
  FOR SELECT USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "Users can create rides" ON public.rides
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Drivers can update assigned rides" ON public.rides
  FOR UPDATE USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

-- RLS Policies for ride_requests
CREATE POLICY "Drivers can view their ride requests" ON public.ride_requests
  FOR SELECT USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "System can manage ride requests" ON public.ride_requests
  FOR ALL USING (true);

-- RLS Policies for fare_calculations
CREATE POLICY "Anyone can view active fare calculations" ON public.fare_calculations
  FOR SELECT USING (is_active = true);

-- Insert default fare calculations
INSERT INTO public.fare_calculations (vehicle_type, base_fare, per_km_rate, per_minute_rate, minimum_fare) VALUES
('taxi', 150, 80, 5, 150),
('motorbike', 80, 50, 3, 80);

-- Create indexes for performance
CREATE INDEX idx_drivers_location ON public.drivers USING GIST(current_location) WHERE is_active = true AND is_verified = true;
CREATE INDEX idx_drivers_status ON public.drivers (status, vehicle_type) WHERE is_active = true;
CREATE INDEX idx_rides_user_id ON public.rides (user_id);
CREATE INDEX idx_rides_driver_id ON public.rides (driver_id);
CREATE INDEX idx_rides_status ON public.rides (status);
CREATE INDEX idx_ride_requests_driver_expires ON public.ride_requests (driver_id, expires_at);

-- Enable realtime for rides table
ALTER TABLE public.rides REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rides;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON public.rides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fare_calculations_updated_at BEFORE UPDATE ON public.fare_calculations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Phase 1: Database & User Role Enhancements

-- Add new user roles for service providers
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'vendor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'driver';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'property_owner';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'rider';

-- Create service provider profiles table
CREATE TABLE public.service_provider_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('vendor', 'driver', 'property_owner')),
  business_name TEXT,
  business_description TEXT,
  phone_number TEXT,
  email TEXT,
  location_address TEXT,
  location_coordinates POINT,
  documents JSONB DEFAULT '{}',
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, provider_type)
);

-- Enable RLS for service provider profiles
ALTER TABLE public.service_provider_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for service provider profiles
CREATE POLICY "Users can view their own service provider profiles" 
  ON public.service_provider_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own service provider profiles" 
  ON public.service_provider_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service provider profiles" 
  ON public.service_provider_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create driver locations table for real-time tracking
CREATE TABLE public.driver_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  location POINT NOT NULL,
  accuracy NUMERIC,
  heading NUMERIC,
  speed NUMERIC,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for driver locations
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;

-- RLS policies for driver locations
CREATE POLICY "Drivers can manage their own locations" 
  ON public.driver_locations 
  FOR ALL 
  USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "Users can view active driver locations for matching" 
  ON public.driver_locations 
  FOR SELECT 
  USING (is_active = true);

-- Add geospatial index for efficient location queries
CREATE INDEX idx_driver_locations_geom ON public.driver_locations USING GIST (location);
CREATE INDEX idx_driver_locations_active ON public.driver_locations (is_active, timestamp DESC);

-- Update drivers table with additional fields
ALTER TABLE public.drivers 
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'offline' CHECK (availability_status IN ('online', 'offline', 'busy')),
ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP WITH TIME ZONE;

-- Create enhanced ride requests table for driver matching
CREATE TABLE public.ride_matching_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  distance_km NUMERIC,
  estimated_time_minutes INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(ride_id, driver_id)
);

-- Enable RLS for ride matching requests
ALTER TABLE public.ride_matching_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for ride matching requests
CREATE POLICY "Drivers can view their ride requests" 
  ON public.ride_matching_requests 
  FOR SELECT 
  USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "Drivers can update their ride requests" 
  ON public.ride_matching_requests 
  FOR UPDATE 
  USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));

CREATE POLICY "Riders can view requests for their rides" 
  ON public.ride_matching_requests 
  FOR SELECT 
  USING (ride_id IN (SELECT id FROM public.rides WHERE user_id = auth.uid()));

-- Update fare calculations with Kenyan-specific rates
INSERT INTO public.fare_calculations (vehicle_type, base_fare, per_km_rate, per_minute_rate, minimum_fare, is_active) 
VALUES 
  ('taxi', 100.00, 50.00, 5.00, 150.00, true),
  ('motorbike', 50.00, 30.00, 3.00, 80.00, true)
ON CONFLICT DO NOTHING;

-- Create surge pricing table
CREATE TABLE public.surge_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_name TEXT NOT NULL,
  location_bounds JSONB NOT NULL, -- GeoJSON polygon
  vehicle_type vehicle_type NOT NULL,
  surge_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Monday, 7=Sunday
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert sample surge pricing for Nairobi CBD
INSERT INTO public.surge_pricing (location_name, location_bounds, vehicle_type, surge_multiplier, start_time, end_time) 
VALUES 
  ('Nairobi CBD', '{"type":"Polygon","coordinates":[[[36.8089,-1.2921],[36.8300,-1.2921],[36.8300,-1.2750],[36.8089,-1.2750],[36.8089,-1.2921]]]}', 'taxi', 1.5, '07:00:00', '09:00:00'),
  ('Nairobi CBD', '{"type":"Polygon","coordinates":[[[36.8089,-1.2921],[36.8300,-1.2921],[36.8300,-1.2750],[36.8089,-1.2750],[36.8089,-1.2921]]]}', 'taxi', 1.8, '17:00:00', '19:00:00'),
  ('Nairobi CBD', '{"type":"Polygon","coordinates":[[[36.8089,-1.2921],[36.8300,-1.2921],[36.8300,-1.2750],[36.8089,-1.2750],[36.8089,-1.2921]]]}', 'motorbike', 1.3, '07:00:00', '09:00:00'),
  ('Nairobi CBD', '{"type":"Polygon","coordinates":[[[36.8089,-1.2921],[36.8300,-1.2921],[36.8300,-1.2750],[36.8089,-1.2750],[36.8089,-1.2921]]]}', 'motorbike', 1.5, '17:00:00', '19:00:00');

-- Update vendor applications to support service types
ALTER TABLE public.vendor_applications 
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'products' CHECK (service_type IN ('products', 'rides', 'properties', 'services'));

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to relevant tables
CREATE TRIGGER update_service_provider_profiles_updated_at 
  BEFORE UPDATE ON public.service_provider_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_surge_pricing_updated_at 
  BEFORE UPDATE ON public.surge_pricing 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

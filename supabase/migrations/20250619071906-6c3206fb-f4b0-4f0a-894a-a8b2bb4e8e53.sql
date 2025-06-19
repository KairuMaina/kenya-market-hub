
-- Create missing tables that are referenced in the code but don't exist

-- Real Estate Agents table
CREATE TABLE public.real_estate_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL,
  license_number TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  specialization TEXT,
  experience_years INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Service Bookings table
CREATE TABLE public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  booking_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  price NUMERIC,
  description TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Properties table (referenced by property_inquiries)
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  listing_type TEXT NOT NULL, -- 'sale' or 'rent'
  property_type TEXT, -- 'apartment', 'house', etc.
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC,
  location TEXT,
  address TEXT,
  agent_id UUID REFERENCES real_estate_agents(id),
  owner_id UUID REFERENCES auth.users(id),
  images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns to existing tables

-- Add missing columns to medical_providers
ALTER TABLE public.medical_providers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add missing columns to drivers table
ALTER TABLE public.drivers 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS vehicle_year INTEGER,
ADD COLUMN IF NOT EXISTS total_rides INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Driver saved routes table
CREATE TABLE public.driver_saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update property_inquiries to reference properties
ALTER TABLE public.property_inquiries 
ADD CONSTRAINT fk_property_inquiries_property 
FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

-- Commissions table for tracking app commissions
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  order_id UUID REFERENCES orders(id),
  commission_rate NUMERIC DEFAULT 0.10, -- 10% default
  commission_amount NUMERIC NOT NULL,
  recipient_type TEXT NOT NULL, -- 'vendor', 'driver', 'service_provider', 'insurance'
  recipient_id UUID NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Coupons table for discount functionality
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_amount NUMERIC NOT NULL,
  minimum_order_amount NUMERIC DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.real_estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_saved_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Users can view their own agent profile" ON real_estate_agents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own agent profile" ON real_estate_agents
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view their service bookings" ON service_bookings
  FOR SELECT USING (customer_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Users can create service bookings" ON service_bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Properties are publicly viewable" ON properties
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Property owners can manage their properties" ON properties
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Agents can manage their properties" ON properties
  FOR ALL USING (agent_id IN (SELECT id FROM real_estate_agents WHERE user_id = auth.uid()));

CREATE POLICY "Drivers can manage their saved routes" ON driver_saved_routes
  FOR ALL USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all commissions" ON commissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT TO authenticated, anon USING (is_active = true);

-- Create function to increment property views
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET views = views + 1 
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

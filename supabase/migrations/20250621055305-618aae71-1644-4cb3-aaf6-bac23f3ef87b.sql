
-- Create missing employers table
CREATE TABLE IF NOT EXISTS public.employers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  website TEXT,
  description TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing service_type column to vendor_applications
ALTER TABLE public.vendor_applications ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'products';

-- Add missing business_email column to vendors (rename contact_email if it exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'business_email') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'contact_email') THEN
      ALTER TABLE public.vendors RENAME COLUMN contact_email TO business_email;
    ELSE
      ALTER TABLE public.vendors ADD COLUMN business_email TEXT;
    END IF;
  END IF;
END $$;

-- Add missing business_phone column to vendors (rename contact_phone if it exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'business_phone') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'contact_phone') THEN
      ALTER TABLE public.vendors RENAME COLUMN contact_phone TO business_phone;
    ELSE
      ALTER TABLE public.vendors ADD COLUMN business_phone TEXT;
    END IF;
  END IF;
END $$;

-- Add missing is_verified column to medical_providers
ALTER TABLE public.medical_providers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Add missing documents column to medical_provider_applications
ALTER TABLE public.medical_provider_applications ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Add missing vehicle_type column to rides
ALTER TABLE public.rides ADD COLUMN IF NOT EXISTS vehicle_type TEXT DEFAULT 'taxi';

-- Create missing driver_ride_requests table
CREATE TABLE IF NOT EXISTS public.driver_ride_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id uuid REFERENCES public.rides(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  distance_km NUMERIC,
  estimated_pickup_minutes INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create proper foreign key relationship between profiles and user_roles
-- First check if the foreign key exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_roles' 
    AND constraint_name = 'user_roles_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_roles 
    ADD CONSTRAINT user_roles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_ride_requests ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for employers (admin only access)
CREATE POLICY "Only admins can access employers" ON public.employers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create basic RLS policies for driver_ride_requests
CREATE POLICY "Drivers can view their own ride requests" ON public.driver_ride_requests
  FOR SELECT USING (
    driver_id IN (
      SELECT id FROM public.drivers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can update their own ride requests" ON public.driver_ride_requests
  FOR UPDATE USING (
    driver_id IN (
      SELECT id FROM public.drivers WHERE user_id = auth.uid()
    )
  );


-- Phase 1: Medical Module Core Infrastructure

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- 1. Create ENUM types for medical services
CREATE TYPE public.medical_facility_type AS ENUM ('hospital', 'clinic', 'pharmacy', 'laboratory');
CREATE TYPE public.medical_provider_type AS ENUM ('doctor', 'nurse', 'pharmacist', 'lab_technician', 'ambulance_driver');

-- 2. Create table for medical specializations
CREATE TABLE public.medical_specializations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for medical_specializations (publicly readable, admin managed)
ALTER TABLE public.medical_specializations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read medical specializations" ON public.medical_specializations FOR SELECT USING (true);
CREATE POLICY "Admins can manage specializations" ON public.medical_specializations FOR ALL USING ((SELECT profiles.email FROM public.profiles WHERE profiles.id = auth.uid()) = 'gmaina424@gmail.com');

-- 3. Create table for medical facilities
CREATE TABLE public.medical_facilities (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    facility_type public.medical_facility_type NOT NULL,
    address text NOT NULL,
    phone text,
    email text,
    location_coordinates geography(Point, 4326),
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for medical_facilities (publicly readable, admin managed)
ALTER TABLE public.medical_facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read medical facilities" ON public.medical_facilities FOR SELECT USING (true);
CREATE POLICY "Admins can manage facilities" ON public.medical_facilities FOR ALL USING ((SELECT profiles.email FROM public.profiles WHERE profiles.id = auth.uid()) = 'gmaina424@gmail.com');

-- Trigger to update 'updated_at' column
CREATE TRIGGER handle_updated_at_medical_facilities BEFORE UPDATE ON public.medical_facilities
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 4. Create table for medical provider applications
CREATE TABLE public.medical_provider_applications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    provider_type public.medical_provider_type NOT NULL,
    specialization_id uuid REFERENCES public.medical_specializations(id),
    license_number text NOT NULL,
    documents jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    admin_notes text,
    CONSTRAINT application_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- RLS for medical_provider_applications
ALTER TABLE public.medical_provider_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create and see their own applications" ON public.medical_provider_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all applications" ON public.medical_provider_applications FOR ALL USING ((SELECT profiles.email FROM public.profiles WHERE profiles.id = auth.uid()) = 'gmaina424@gmail.com');

-- 5. Create table for approved medical providers
CREATE TABLE public.medical_providers (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name text NOT NULL,
    provider_type public.medical_provider_type NOT NULL,
    specialization_id uuid REFERENCES public.medical_specializations(id),
    facility_id uuid REFERENCES public.medical_facilities(id),
    is_verified boolean DEFAULT true,
    is_active boolean DEFAULT true,
    rating numeric(2,1) DEFAULT 0.0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for medical_providers
ALTER TABLE public.medical_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved providers" ON public.medical_providers FOR SELECT USING (is_active = true AND is_verified = true);
CREATE POLICY "Providers can manage their own profile" ON public.medical_providers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage providers" ON public.medical_providers FOR ALL USING ((SELECT profiles.email FROM public.profiles WHERE profiles.id = auth.uid()) = 'gmaina424@gmail.com');

-- Trigger to update 'updated_at' column
CREATE TRIGGER handle_updated_at_medical_providers BEFORE UPDATE ON public.medical_providers
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 6. Create table for medications
CREATE TABLE public.medications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    requires_prescription boolean DEFAULT false,
    price numeric(10, 2) NOT NULL,
    stock_quantity integer DEFAULT 0,
    image_url text,
    pharmacy_id uuid NOT NULL REFERENCES public.medical_facilities(id),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS for medications
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read medications" ON public.medications FOR SELECT USING (true);
CREATE POLICY "Admins can manage medications" ON public.medications FOR ALL USING ((SELECT profiles.email FROM public.profiles WHERE profiles.id = auth.uid()) = 'gmaina424@gmail.com');

-- Trigger to update 'updated_at' column
CREATE TRIGGER handle_updated_at_medications BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

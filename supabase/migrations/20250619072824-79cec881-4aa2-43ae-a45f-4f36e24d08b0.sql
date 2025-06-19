
-- Create missing tables that are referenced in the hooks

-- Admin Settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Roles table  
CREATE TYPE public.app_role AS ENUM ('admin', 'customer', 'vendor', 'driver', 'property_owner', 'rider');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Service Provider Profiles table
CREATE TABLE public.service_provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  business_name TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  verification_status TEXT DEFAULT 'pending',
  rating NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing column to property_inquiries for inquirer_name
ALTER TABLE public.property_inquiries 
ADD COLUMN IF NOT EXISTS inquirer_name TEXT;

-- Update inquirer_name from full_name where it's null
UPDATE public.property_inquiries 
SET inquirer_name = full_name 
WHERE inquirer_name IS NULL AND full_name IS NOT NULL;

-- Enable RLS on new tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_provider_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage all settings" ON admin_settings
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service providers can manage their own profile" ON service_provider_profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public can view active service providers" ON service_provider_profiles
  FOR SELECT TO authenticated, anon USING (is_active = true);

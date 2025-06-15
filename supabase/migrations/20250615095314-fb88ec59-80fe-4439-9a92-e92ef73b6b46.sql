
-- Drop the existing constraint on provider_type
ALTER TABLE public.service_provider_profiles DROP CONSTRAINT IF EXISTS service_provider_profiles_provider_type_check;

-- Add a new, less restrictive constraint that includes 'service_provider'
ALTER TABLE public.service_provider_profiles 
ADD CONSTRAINT service_provider_profiles_provider_type_check 
CHECK (provider_type IN ('vendor', 'driver', 'property_owner', 'service_provider'));


-- First, let's see what values are currently allowed and fix the constraint
-- Drop the existing constraint
ALTER TABLE public.vendor_applications DROP CONSTRAINT IF EXISTS vendor_applications_service_type_check;

-- Add a new constraint that allows the correct service types
ALTER TABLE public.vendor_applications ADD CONSTRAINT vendor_applications_service_type_check 
CHECK (service_type IN ('products', 'driver', 'property_owner', 'service_provider'));


-- First, let's see what the current constraint allows and update it
-- Drop the existing constraint
ALTER TABLE public.vendor_applications DROP CONSTRAINT IF EXISTS vendor_applications_service_type_check;

-- Add a comprehensive constraint that includes all service types used in the app
ALTER TABLE public.vendor_applications ADD CONSTRAINT vendor_applications_service_type_check 
CHECK (service_type IN (
  'products', 
  'driver', 
  'property_owner', 
  'plumber', 
  'electrician', 
  'painter', 
  'carpenter', 
  'barber', 
  'doctor', 
  'tutor', 
  'photographer', 
  'caterer',
  'restaurant',
  'medical',
  'event_organizer',
  'agent',
  'employer',
  'service_provider'
));

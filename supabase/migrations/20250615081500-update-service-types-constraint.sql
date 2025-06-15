
-- Update the service_type constraint to include all supported service types
ALTER TABLE public.vendor_applications DROP CONSTRAINT IF EXISTS vendor_applications_service_type_check;

-- Add comprehensive constraint that includes all service types used in the app
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
  'service_provider'
));

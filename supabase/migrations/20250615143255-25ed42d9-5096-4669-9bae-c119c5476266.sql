
-- Add new values to the medical_facility_type enum
-- This is necessary because the previous data population script failed due to these types not being recognized.
-- By adding them, we can ensure the database accepts the new facility data.
ALTER TYPE public.medical_facility_type ADD VALUE 'Hospital';
ALTER TYPE public.medical_facility_type ADD VALUE 'Clinic';
ALTER TYPE public.medical_facility_type ADD VALUE 'Pharmacy';
ALTER TYPE public.medical_facility_type ADD VALUE 'Laboratory';

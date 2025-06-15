
-- Add business_license column to vendors table
ALTER TABLE public.vendors
ADD COLUMN business_license TEXT;

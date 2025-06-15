
-- Allow medical providers to be created without an associated user account
ALTER TABLE public.medical_providers ALTER COLUMN user_id DROP NOT NULL;

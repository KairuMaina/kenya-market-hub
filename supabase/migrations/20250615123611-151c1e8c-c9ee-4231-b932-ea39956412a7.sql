
-- Function to approve a medical provider application
CREATE OR REPLACE FUNCTION public.approve_medical_provider_application(p_application_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app_record public.medical_provider_applications%ROWTYPE;
  new_provider_id UUID;
BEGIN
  -- 1. Get the application record
  SELECT * INTO app_record
  FROM public.medical_provider_applications
  WHERE id = p_application_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending application not found for ID: %', p_application_id;
  END IF;

  -- 2. Create a new record in medical_providers
  INSERT INTO public.medical_providers (
    user_id,
    full_name,
    provider_type,
    specialization_id,
    is_verified,
    is_active
  ) VALUES (
    app_record.user_id,
    app_record.full_name,
    app_record.provider_type,
    app_record.specialization_id,
    true,
    true
  ) RETURNING id INTO new_provider_id;

  -- 3. Update the application status
  UPDATE public.medical_provider_applications
  SET
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = p_application_id;

  RETURN new_provider_id;
END;
$$;

-- Function to reject a medical provider application
CREATE OR REPLACE FUNCTION public.reject_medical_provider_application(p_application_id uuid, p_admin_notes text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.medical_provider_applications
  SET
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    admin_notes = p_admin_notes
  WHERE id = p_application_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending application not found for ID: %', p_application_id;
  END IF;
END;
$$;

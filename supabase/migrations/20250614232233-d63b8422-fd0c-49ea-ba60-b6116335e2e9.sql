
-- Add RLS policies for admin access to all vendor, driver, and service provider tables

-- Admin policies for vendors table
CREATE POLICY "Admin can view all vendors" 
  ON public.vendors FOR SELECT 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update all vendors" 
  ON public.vendors FOR UPDATE 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can insert vendors" 
  ON public.vendors FOR INSERT 
  WITH CHECK (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admin policies for vendor_applications table
CREATE POLICY "Admin can view all vendor applications" 
  ON public.vendor_applications FOR SELECT 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update vendor applications" 
  ON public.vendor_applications FOR UPDATE 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admin policies for drivers table
CREATE POLICY "Admin can view all drivers" 
  ON public.drivers FOR SELECT 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update all drivers" 
  ON public.drivers FOR UPDATE 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admin policies for service_provider_profiles table
CREATE POLICY "Admin can view all service providers" 
  ON public.service_provider_profiles FOR SELECT 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update all service providers" 
  ON public.service_provider_profiles FOR UPDATE 
  USING (EXISTS(SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Function to create vendor from approved application
CREATE OR REPLACE FUNCTION public.approve_vendor_application(application_id UUID)
RETURNS UUID AS $$
DECLARE
  app_record public.vendor_applications%ROWTYPE;
  new_vendor_id UUID;
BEGIN
  -- Get the application
  SELECT * INTO app_record
  FROM public.vendor_applications
  WHERE id = application_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found or not pending';
  END IF;
  
  -- Create vendor record
  INSERT INTO public.vendors (
    user_id,
    business_name,
    business_description,
    business_address,
    business_phone,
    business_email,
    business_license,
    verification_status,
    is_active
  ) VALUES (
    app_record.user_id,
    app_record.business_name,
    app_record.business_description,
    app_record.business_address,
    app_record.business_phone,
    app_record.business_email,
    app_record.business_license,
    'approved',
    true
  ) RETURNING id INTO new_vendor_id;
  
  -- Update application status
  UPDATE public.vendor_applications
  SET 
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = application_id;
  
  RETURN new_vendor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject vendor application
CREATE OR REPLACE FUNCTION public.reject_vendor_application(application_id UUID, rejection_notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.vendor_applications
  SET 
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    admin_notes = rejection_notes
  WHERE id = application_id AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

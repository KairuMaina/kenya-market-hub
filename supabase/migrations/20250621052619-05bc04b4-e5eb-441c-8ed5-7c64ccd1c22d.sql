
-- Add missing columns to vendors table (if not already added)
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- Add missing columns to drivers table (if not already added)
ALTER TABLE public.drivers 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- Add missing columns to rides table (if not already added)
ALTER TABLE public.rides 
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS review TEXT;

-- Add missing columns to driver_locations table (if not already added)
ALTER TABLE public.driver_locations 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create coupon_usage table (if not already created)
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  discount_applied NUMERIC NOT NULL,
  UNIQUE(coupon_id, user_id, order_id)
);

-- Enable RLS on coupon_usage table
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for coupon_usage (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coupon_usage' 
    AND policyname = 'Users can view their own coupon usage'
  ) THEN
    CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage
      FOR SELECT USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coupon_usage' 
    AND policyname = 'Users can create their own coupon usage'
  ) THEN
    CREATE POLICY "Users can create their own coupon usage" ON public.coupon_usage
      FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Create database functions (these will replace existing ones if they exist)
CREATE OR REPLACE FUNCTION public.approve_medical_provider_application(p_application_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Move application data to medical_providers table
  INSERT INTO public.medical_providers (
    user_id, full_name, email, phone, provider_type, 
    license_number, address, specialization_id, 
    verification_status, is_active
  )
  SELECT 
    user_id, full_name, email, phone, provider_type,
    license_number, address, specialization_id,
    'approved', true
  FROM public.medical_provider_applications 
  WHERE id = p_application_id;
  
  -- Update application status
  UPDATE public.medical_provider_applications 
  SET status = 'approved', reviewed_at = now()
  WHERE id = p_application_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_medical_provider_application(p_application_id UUID, p_admin_notes TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.medical_provider_applications 
  SET status = 'rejected', reviewed_at = now(), reviewer_notes = p_admin_notes
  WHERE id = p_application_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_vendor_application(p_application_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Move application data to vendors table
  INSERT INTO public.vendors (
    user_id, business_name, business_description, 
    contact_email, contact_phone, verification_status, is_active
  )
  SELECT 
    user_id, business_name, business_description,
    contact_email, contact_phone, 'approved', true
  FROM public.vendor_applications 
  WHERE id = p_application_id;
  
  -- Update application status
  UPDATE public.vendor_applications 
  SET status = 'approved'
  WHERE id = p_application_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_vendor_application(p_application_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.vendor_applications 
  SET status = 'rejected'
  WHERE id = p_application_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_coupon_discount(p_coupon_code TEXT, p_order_amount NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_discount NUMERIC := 0;
  v_coupon RECORD;
BEGIN
  SELECT * INTO v_coupon 
  FROM public.coupons 
  WHERE code = p_coupon_code 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
    AND (minimum_order_amount IS NULL OR p_order_amount >= minimum_order_amount);
  
  IF FOUND THEN
    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := p_order_amount * (v_coupon.discount_amount / 100);
    ELSE
      v_discount := v_coupon.discount_amount;
    END IF;
  END IF;
  
  RETURN v_discount;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_driver_analytics(p_driver_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_rides', COUNT(*),
    'total_earnings', COALESCE(SUM(actual_fare), 0),
    'avg_rating', COALESCE(AVG(rating), 0),
    'completed_rides', COUNT(*) FILTER (WHERE status = 'completed')
  ) INTO v_result
  FROM public.rides 
  WHERE driver_id = p_driver_id;
  
  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_popular_routes()
RETURNS TABLE(
  pickup_address TEXT,
  destination_address TEXT,
  ride_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.pickup_address,
    r.destination_address,
    COUNT(*) as ride_count
  FROM public.rides r
  WHERE r.status = 'completed'
  GROUP BY r.pickup_address, r.destination_address
  ORDER BY ride_count DESC
  LIMIT 10;
END;
$$;

CREATE OR REPLACE FUNCTION public.find_nearby_drivers(p_pickup_lat NUMERIC, p_pickup_lng NUMERIC, p_radius_km NUMERIC DEFAULT 10)
RETURNS TABLE(
  driver_id UUID,
  distance_km NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id as driver_id,
    1.0 as distance_km -- Simplified distance calculation
  FROM public.drivers d
  WHERE d.availability_status = 'available'
    AND d.is_active = true
  LIMIT 10;
END;
$$;

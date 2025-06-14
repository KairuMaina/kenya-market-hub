
-- Create vendors table for multi-vendor system
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  logo_url TEXT,
  banner_url TEXT,
  website_url TEXT,
  social_media JSONB,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  is_active BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create vendor_applications table for registration process
CREATE TABLE public.vendor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT NOT NULL,
  business_address TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_license TEXT,
  tax_id TEXT,
  bank_details JSONB,
  documents JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Create coupons table for discount system
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2) DEFAULT 0,
  maximum_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  user_usage_limit INTEGER DEFAULT 1,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  applicable_categories TEXT[],
  applicable_products UUID[],
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coupon_usage table to track usage
CREATE TABLE public.coupon_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coupon_id, user_id, order_id)
);

-- Create email_campaigns table for email marketing
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_type TEXT DEFAULT 'newsletter' CHECK (template_type IN ('newsletter', 'promotional', 'welcome', 'abandoned_cart')),
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'customers', 'vendors', 'segments')),
  audience_segments JSONB,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  total_recipients INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_subscribers table
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id UUID,
  is_subscribed BOOLEAN DEFAULT true,
  subscription_source TEXT DEFAULT 'website',
  tags TEXT[],
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Update products table to include vendor reference
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id);

-- Update orders table to include coupon information
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Add RLS policies for vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vendors" 
  ON public.vendors 
  FOR SELECT 
  USING (is_active = true AND verification_status = 'approved');

CREATE POLICY "Users can view their own vendor profile" 
  ON public.vendors 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor profile" 
  ON public.vendors 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for vendor applications
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create vendor applications" 
  ON public.vendor_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" 
  ON public.vendor_applications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add RLS policies for coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" 
  ON public.coupons 
  FOR SELECT 
  USING (is_active = true AND start_date <= now() AND end_date >= now());

-- Add RLS policies for coupon usage
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coupon usage" 
  ON public.coupon_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create coupon usage records" 
  ON public.coupon_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for email subscribers
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscription" 
  ON public.email_subscribers 
  FOR ALL 
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create function to calculate coupon discount
CREATE OR REPLACE FUNCTION calculate_coupon_discount(
  p_coupon_code TEXT,
  p_order_amount DECIMAL,
  p_user_id UUID,
  p_product_categories TEXT[] DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_coupon public.coupons%ROWTYPE;
  v_discount_amount DECIMAL := 0;
  v_usage_count INTEGER := 0;
BEGIN
  -- Get coupon details
  SELECT * INTO v_coupon
  FROM public.coupons
  WHERE code = p_coupon_code
    AND is_active = true
    AND start_date <= now()
    AND end_date >= now();
    
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired coupon');
  END IF;
  
  -- Check minimum order amount
  IF p_order_amount < v_coupon.minimum_order_amount THEN
    RETURN jsonb_build_object(
      'valid', false, 
      'error', 'Minimum order amount not met',
      'minimum_amount', v_coupon.minimum_order_amount
    );
  END IF;
  
  -- Check usage limits
  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Coupon usage limit exceeded');
  END IF;
  
  -- Check user usage limit
  SELECT COUNT(*) INTO v_usage_count
  FROM public.coupon_usage
  WHERE coupon_id = v_coupon.id AND user_id = p_user_id;
  
  IF v_coupon.user_usage_limit IS NOT NULL AND v_usage_count >= v_coupon.user_usage_limit THEN
    RETURN jsonb_build_object('valid', false, 'error', 'You have already used this coupon');
  END IF;
  
  -- Calculate discount
  IF v_coupon.discount_type = 'percentage' THEN
    v_discount_amount := (p_order_amount * v_coupon.discount_value / 100);
  ELSE
    v_discount_amount := v_coupon.discount_value;
  END IF;
  
  -- Apply maximum discount limit
  IF v_coupon.maximum_discount_amount IS NOT NULL AND v_discount_amount > v_coupon.maximum_discount_amount THEN
    v_discount_amount := v_coupon.maximum_discount_amount;
  END IF;
  
  -- Ensure discount doesn't exceed order amount
  IF v_discount_amount > p_order_amount THEN
    v_discount_amount := p_order_amount;
  END IF;
  
  RETURN jsonb_build_object(
    'valid', true,
    'discount_amount', v_discount_amount,
    'coupon_id', v_coupon.id,
    'coupon_name', v_coupon.name
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update vendor updated_at
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update coupons updated_at
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update email_campaigns updated_at
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

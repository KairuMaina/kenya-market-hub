
-- Add missing columns to service_bookings table
ALTER TABLE public.service_bookings 
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS service_description TEXT,
ADD COLUMN IF NOT EXISTS booking_time TEXT DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update user_role enum to include service_provider
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'service_provider';

-- Update service_booking_status enum to include confirmed
ALTER TYPE public.service_booking_status ADD VALUE IF NOT EXISTS 'confirmed';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON public.service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_provider_id ON public.service_bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);


-- Create enum for service booking status
CREATE TYPE public.service_booking_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rejected');

-- Create service categories table
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for service_categories
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read service categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage service categories" ON public.service_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert some default service categories
INSERT INTO public.service_categories (name, description) VALUES
('Plumbing', 'All plumbing related services'),
('Cleaning', 'Home and office cleaning services'),
('Electrical', 'Electrical wiring and repairs'),
('Carpentry', 'Woodwork and furniture services'),
('Moving', 'Relocation and moving services');

-- Create service_bookings table
CREATE TABLE public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES public.service_provider_profiles(id) ON DELETE CASCADE,
  service_category_id UUID REFERENCES public.service_categories(id),
  booking_date TIMESTAMPTZ NOT NULL,
  status public.service_booking_status DEFAULT 'pending',
  total_amount NUMERIC(10,2),
  description TEXT,
  booking_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for service_bookings
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all service bookings" ON public.service_bookings FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can view their own bookings" ON public.service_bookings FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Providers can view their bookings" ON public.service_bookings FOR SELECT USING (provider_id IN (SELECT id FROM public.service_provider_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Customers can create bookings" ON public.service_bookings FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Trigger for updated_at on service_bookings
CREATE TRIGGER update_service_bookings_updated_at BEFORE UPDATE ON public.service_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

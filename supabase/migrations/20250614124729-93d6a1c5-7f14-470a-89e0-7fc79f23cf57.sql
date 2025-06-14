
-- Create enum for property types
CREATE TYPE public.property_type AS ENUM ('house', 'apartment', 'land', 'commercial', 'office');

-- Create enum for property status
CREATE TYPE public.property_status AS ENUM ('available', 'sold', 'rented', 'pending');

-- Create enum for listing type
CREATE TYPE public.listing_type AS ENUM ('sale', 'rent');

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  listing_type listing_type NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm NUMERIC(10,2),
  location_address TEXT NOT NULL,
  location_coordinates POINT,
  county TEXT,
  city TEXT,
  amenities TEXT[],
  features TEXT[],
  status property_status DEFAULT 'available',
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  images TEXT[],
  virtual_tour_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  available_from DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create property_inquiries table
CREATE TABLE public.property_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  inquirer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  inquirer_name TEXT NOT NULL,
  inquirer_email TEXT NOT NULL,
  inquirer_phone TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'viewing', 'purchase', 'rent')),
  preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create property_viewings table
CREATE TABLE public.property_viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  viewer_name TEXT NOT NULL,
  viewer_email TEXT NOT NULL,
  viewer_phone TEXT,
  viewing_date DATE NOT NULL,
  viewing_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create real_estate_agents table
CREATE TABLE public.real_estate_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agency_name TEXT,
  license_number TEXT,
  specializations TEXT[],
  bio TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website_url TEXT,
  social_media JSONB,
  rating NUMERIC(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Anyone can view available properties" ON public.properties
  FOR SELECT USING (status = 'available' OR auth.uid() = owner_id);

CREATE POLICY "Property owners can manage their properties" ON public.properties
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Agents can manage assigned properties" ON public.properties
  FOR ALL USING (agent_id = auth.uid());

-- RLS Policies for property_inquiries
CREATE POLICY "Property owners can view inquiries for their properties" ON public.property_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own inquiries" ON public.property_inquiries
  FOR SELECT USING (inquirer_id = auth.uid());

CREATE POLICY "Anyone can create inquiries" ON public.property_inquiries
  FOR INSERT WITH CHECK (true);

-- RLS Policies for property_viewings
CREATE POLICY "Property owners can view viewings for their properties" ON public.property_viewings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own viewings" ON public.property_viewings
  FOR SELECT USING (viewer_id = auth.uid());

CREATE POLICY "Anyone can schedule viewings" ON public.property_viewings
  FOR INSERT WITH CHECK (true);

-- RLS Policies for real_estate_agents
CREATE POLICY "Anyone can view active agents" ON public.real_estate_agents
  FOR SELECT USING (is_active = true);

CREATE POLICY "Agents can manage their own profile" ON public.real_estate_agents
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_properties_location ON public.properties USING GIST(location_coordinates);
CREATE INDEX idx_properties_type_price ON public.properties (property_type, listing_type, price);
CREATE INDEX idx_properties_status ON public.properties (status) WHERE status = 'available';
CREATE INDEX idx_properties_featured ON public.properties (is_featured) WHERE is_featured = true;
CREATE INDEX idx_property_inquiries_property ON public.property_inquiries (property_id);
CREATE INDEX idx_property_viewings_property ON public.property_viewings (property_id);
CREATE INDEX idx_property_viewings_date ON public.property_viewings (viewing_date);

-- Enable realtime for property inquiries and viewings
ALTER TABLE public.property_inquiries REPLICA IDENTITY FULL;
ALTER TABLE public.property_viewings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_inquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_viewings;

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_real_estate_agents_updated_at BEFORE UPDATE ON public.real_estate_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO public.properties (
  owner_id, title, description, property_type, listing_type, price, 
  bedrooms, bathrooms, area_sqm, location_address, county, city, 
  amenities, features, images, contact_phone, contact_email
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Modern 3BR Apartment in Westlands',
  'Beautiful modern apartment with stunning city views, fully furnished with contemporary amenities.',
  'apartment', 'rent', 85000,
  3, 2, 120.5,
  'Westlands, Nairobi', 'Nairobi', 'Nairobi',
  ARRAY['Swimming Pool', 'Gym', 'Parking', 'Security', 'Generator'],
  ARRAY['Balcony', 'Built-in Wardrobes', 'Modern Kitchen', 'High-speed Internet'],
  ARRAY['/placeholder.svg', '/placeholder.svg'],
  '+254712345678', 'contact@example.com'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Executive 4BR House in Karen',
  'Spacious family home in the prestigious Karen area with large garden and mature trees.',
  'house', 'sale', 18500000,
  4, 3, 280.0,
  'Karen, Nairobi', 'Nairobi', 'Nairobi',
  ARRAY['Garden', 'Garage', 'Security System', 'Borehole'],
  ARRAY['Master En-suite', 'Study Room', 'Fireplace', 'Servant Quarter'],
  ARRAY['/placeholder.svg', '/placeholder.svg'],
  '+254723456789', 'karen@example.com'
);

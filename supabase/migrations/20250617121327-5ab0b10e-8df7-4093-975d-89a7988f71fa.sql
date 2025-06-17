
-- Create vendors table
CREATE TABLE public.vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  business_address TEXT,
  business_description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  brand TEXT,
  vendor_id UUID REFERENCES public.vendors(id),
  vendor TEXT,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  condition TEXT DEFAULT 'new',
  location TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_images table
CREATE TABLE public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_type TEXT,
  license_plate TEXT,
  rating DECIMAL(3,2),
  status TEXT DEFAULT 'offline',
  availability_status TEXT DEFAULT 'offline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rides table
CREATE TABLE public.rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  driver_id UUID REFERENCES public.drivers(id),
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  pickup_location TEXT,
  destination_location TEXT,
  status TEXT DEFAULT 'pending',
  fare DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  payment_method TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create driver_locations table
CREATE TABLE public.driver_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  location POINT,
  heading DECIMAL(5,2),
  speed DECIMAL(5,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fare_calculations table
CREATE TABLE public.fare_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_type TEXT NOT NULL,
  base_fare DECIMAL(10,2) NOT NULL,
  per_km_rate DECIMAL(10,2) NOT NULL,
  minimum_fare DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fare_calculations ENABLE ROW LEVEL SECURITY;

-- Create basic policies for vendors (public read)
CREATE POLICY "Anyone can view vendors" ON public.vendors FOR SELECT USING (true);

-- Create basic policies for products (public read)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Create basic policies for product_images (public read)
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);

-- Create policies for drivers (users can view their own)
CREATE POLICY "Users can view their own driver profile" ON public.drivers 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own driver profile" ON public.drivers 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for rides (users can view their own)
CREATE POLICY "Users can view their own rides" ON public.rides 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create rides" ON public.rides 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for notifications (users can view their own)
CREATE POLICY "Users can view their own notifications" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for orders (users can view their own)
CREATE POLICY "Users can view their own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for order_items (inherit from orders)
CREATE POLICY "Users can view order items for their orders" ON public.order_items 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create policies for transactions (inherit from orders)
CREATE POLICY "Users can view transactions for their orders" ON public.transactions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = transactions.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create policies for driver_locations (drivers can view/update their own)
CREATE POLICY "Drivers can manage their own locations" ON public.driver_locations 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.drivers 
      WHERE drivers.id = driver_locations.driver_id 
      AND drivers.user_id = auth.uid()
    )
  );

-- Create policies for fare_calculations (public read)
CREATE POLICY "Anyone can view fare calculations" ON public.fare_calculations FOR SELECT USING (true);

-- Insert some sample fare calculations
INSERT INTO public.fare_calculations (vehicle_type, base_fare, per_km_rate, minimum_fare) VALUES
  ('taxi', 100.00, 50.00, 200.00),
  ('motorbike', 50.00, 30.00, 100.00);

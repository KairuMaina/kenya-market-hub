
-- Create reviews table for product reviews and ratings
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist table for user favorites
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create recently viewed products table
CREATE TABLE public.recently_viewed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create delivery schedules table
CREATE TABLE public.delivery_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  special_instructions TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist" 
  ON public.wishlist 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist" 
  ON public.wishlist 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist" 
  ON public.wishlist 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for recently viewed
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their recently viewed products" 
  ON public.recently_viewed 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to recently viewed" 
  ON public.recently_viewed 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for delivery schedules
ALTER TABLE public.delivery_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view delivery schedules for their orders" 
  ON public.delivery_schedules 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = delivery_schedules.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create delivery schedules for their orders" 
  ON public.delivery_schedules 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = delivery_schedules.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Update products table to include better search capabilities
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'new';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS location TEXT;

-- Create function to update product ratings based on reviews
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update product ratings
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Create function to handle recently viewed (upsert behavior)
CREATE OR REPLACE FUNCTION upsert_recently_viewed(p_user_id UUID, p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.recently_viewed (user_id, product_id, viewed_at)
  VALUES (p_user_id, p_product_id, now())
  ON CONFLICT (user_id, product_id) 
  DO UPDATE SET viewed_at = now();
  
  -- Keep only the latest 20 items per user
  DELETE FROM public.recently_viewed 
  WHERE user_id = p_user_id 
  AND id NOT IN (
    SELECT id FROM public.recently_viewed 
    WHERE user_id = p_user_id 
    ORDER BY viewed_at DESC 
    LIMIT 20
  );
END;
$$ LANGUAGE plpgsql;

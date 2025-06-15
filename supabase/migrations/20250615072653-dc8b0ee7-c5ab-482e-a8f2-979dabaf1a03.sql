
-- Enable Row Level Security on the products table.
-- This is a security best practice to ensure data is protected.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read products.
-- This is needed for your shop to display products to visitors.
CREATE POLICY "Allow public read access to products"
ON public.products
FOR SELECT
USING (true);


-- Create function to increment property views
CREATE OR REPLACE FUNCTION public.increment_property_views(property_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.properties 
  SET views_count = views_count + 1 
  WHERE id = property_id;
END;
$$;

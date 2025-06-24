
-- Create the increment_post_views function
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.forum_posts 
  SET view_count = view_count + 1 
  WHERE id = post_id;
END;
$function$

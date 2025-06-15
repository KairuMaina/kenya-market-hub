
-- Add a foreign key constraint to link user_roles with profiles
ALTER TABLE public.user_roles
ADD CONSTRAINT fk_user_roles_to_profiles
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

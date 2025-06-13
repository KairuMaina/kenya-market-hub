
-- Insert or update the user profile for the admin
INSERT INTO public.profiles (id, email, full_name) 
VALUES ('35a87001-da86-42ae-98d5-22de953b1dab', 'gmaina424@gmail.com', 'Admin User')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- Ensure the user has admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('35a87001-da86-42ae-98d5-22de953b1dab', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

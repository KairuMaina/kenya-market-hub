
-- Change vendor approval/rejection functions to SECURITY INVOKER
-- This fixes an issue where RLS policies that rely on `auth.uid()` were failing
-- inside SECURITY DEFINER functions. With SECURITY INVOKER, the functions will
-- run with the permissions of the calling user (the admin), and the RLS policies will work as expected.

ALTER FUNCTION public.approve_vendor_application(uuid) SECURITY INVOKER;

ALTER FUNCTION public.reject_vendor_application(uuid, text) SECURITY INVOKER;

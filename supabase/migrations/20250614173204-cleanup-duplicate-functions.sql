
-- Clean up duplicate and outdated functions
-- This migration removes duplicate or incorrect function definitions

-- Remove the duplicate has_role function (the one with bigint parameter appears to be outdated)
DROP FUNCTION IF EXISTS public.has_role(bigint, text);

/*
# Fix update_updated_at function search path

1. Security Fix
   - Drop existing triggers that depend on update_updated_at()
   - Recreate `update_updated_at()` with an explicit `search_path = public` to
     satisfy the Supabase database linter's function_search_path_mutable check.
   - Recreate all triggers that were dropped.
2. No data changes.
*/

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS tutors_updated_at ON tutors;
DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS payments_updated_at ON payments;

DROP FUNCTION IF EXISTS update_updated_at();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER tutors_updated_at BEFORE UPDATE ON tutors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Migration: Explicitly revoke anon execute privileges on admin-only roulette RPCs

REVOKE ALL ON FUNCTION public.generate_roulette_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rotate_roulette_access_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rotate_roulette_access_code() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.clear_used_roulette_codes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.clear_used_roulette_codes() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.rotate_roulette_access_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_code TEXT;
BEGIN
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.roulette_access_codes
  SET status = 'used',
      used_at = now()
  WHERE status = 'active';

  v_new_code := public.generate_roulette_code();
  INSERT INTO public.roulette_access_codes (code, status)
  VALUES (v_new_code, 'active');

  RETURN v_new_code;
END;
$$;

REVOKE ALL ON FUNCTION public.rotate_roulette_access_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rotate_roulette_access_code() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.clear_used_roulette_codes()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM public.roulette_access_codes
  WHERE status = 'used';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.clear_used_roulette_codes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.clear_used_roulette_codes() TO authenticated, service_role;

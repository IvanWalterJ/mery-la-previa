-- Migration: Allow authenticated admins to clear used roulette access codes history

CREATE OR REPLACE FUNCTION public.clear_used_roulette_codes()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.roulette_access_codes
  WHERE status = 'used';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.clear_used_roulette_codes() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.clear_used_roulette_codes() TO authenticated;

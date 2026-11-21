-- Migration: Single-use auto-rotating roulette access codes for in-venue play

CREATE TABLE IF NOT EXISTS public.roulette_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at TIMESTAMPTZ
);

ALTER TABLE public.roulette_access_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin lectura de codigos de ruleta" ON public.roulette_access_codes;
CREATE POLICY "Admin lectura de codigos de ruleta"
  ON public.roulette_access_codes FOR SELECT
  TO authenticated
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'roulette_access_codes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.roulette_access_codes;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.generate_roulette_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars CONSTANT TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..4 LOOP
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_roulette_code() FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.redeem_roulette_access_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_redeemed_id UUID;
  v_new_code TEXT;
BEGIN
  IF p_code IS NULL OR trim(p_code) = '' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Código inválido o ya utilizado');
  END IF;

  UPDATE public.roulette_access_codes
  SET status = 'used',
      used_at = now()
  WHERE id = (
    SELECT id
    FROM public.roulette_access_codes
    WHERE status = 'active'
      AND upper(code) = upper(trim(p_code))
    ORDER BY created_at DESC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING id INTO v_redeemed_id;

  IF v_redeemed_id IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Código inválido o ya utilizado');
  END IF;

  -- Close any other stale active rows so a single active code remains
  UPDATE public.roulette_access_codes
  SET status = 'used',
      used_at = COALESCE(used_at, now())
  WHERE status = 'active';

  v_new_code := public.generate_roulette_code();
  INSERT INTO public.roulette_access_codes (code, status)
  VALUES (v_new_code, 'active');

  RETURN jsonb_build_object('valid', true);
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_roulette_access_code(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_roulette_access_code(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.rotate_roulette_access_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_code TEXT;
BEGIN
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

REVOKE ALL ON FUNCTION public.rotate_roulette_access_code() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rotate_roulette_access_code() TO authenticated;

INSERT INTO public.roulette_access_codes (code, status)
SELECT public.generate_roulette_code(), 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.roulette_access_codes WHERE status = 'active'
);

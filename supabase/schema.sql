-- =============================================================================
-- MERY LA PREVIA — Esquema Completo de Base de Datos, Storage y Tiempo Real
-- Instrucciones:
-- 1. Creá un proyecto nuevo en https://supabase.com
-- 2. Abrí "SQL Editor" -> "New Query", pegá todo este script y dale a "Run".
-- 3. Para crear los usuarios de las chicas: andá a "Authentication" -> "Users"
--    -> "Add user" -> "Create new user" (Email + Password, con Auto Confirm).
-- =============================================================================

-- 1. TABLA DE CATEGORÍAS DE LA CARTA
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLA DE PLATOS, TRAGOS Y VINOS
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.menu_categories(slug) ON UPDATE CASCADE ON DELETE CASCADE,
  name TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT '★',
  price TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  detail_copy TEXT NOT NULL DEFAULT '',
  pairing_note TEXT NOT NULL DEFAULT '',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL DEFAULT 'assets/img/ice-cube-previa.jpg',
  image_position TEXT NOT NULL DEFAULT '50% 50%',
  image_zoom NUMERIC NOT NULL DEFAULT 1,
  modal_image_position TEXT NOT NULL DEFAULT '50% 50%',
  modal_image_zoom NUMERIC NOT NULL DEFAULT 1,
  available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS image_position TEXT NOT NULL DEFAULT '50% 50%';
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS image_zoom NUMERIC NOT NULL DEFAULT 1;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS modal_image_position TEXT NOT NULL DEFAULT '50% 50%';
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS modal_image_zoom NUMERIC NOT NULL DEFAULT 1;

-- 3. ROW LEVEL SECURITY (Lectura pública en vivo, escritura solo usuarios logueados)
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica de categorias" ON public.menu_categories;
CREATE POLICY "Lectura publica de categorias"
  ON public.menu_categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin gestiona categorias" ON public.menu_categories;
CREATE POLICY "Admin gestiona categorias"
  ON public.menu_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lectura publica de platos" ON public.menu_items;
CREATE POLICY "Lectura publica de platos"
  ON public.menu_items FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin gestiona platos" ON public.menu_items;
CREATE POLICY "Admin gestiona platos"
  ON public.menu_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. BUCKET DE STORAGE PARA FOTOS DE LA CARTA (menu-images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Fotos publicas de la carta" ON storage.objects;
CREATE POLICY "Fotos publicas de la carta"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Admin sube y edita fotos de la carta" ON storage.objects;
CREATE POLICY "Admin sube y edita fotos de la carta"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'menu-images')
  WITH CHECK (bucket_id = 'menu-images');

-- 5. ACTIVAR TIEMPO REAL (Supabase Realtime para que los cambios impacten en vivo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'menu_categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_categories;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'menu_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
  END IF;
END $$;

-- 6. DATOS INICIALES (Carta Oficial de Mery La Previa)
INSERT INTO public.menu_categories (slug, title, sort_order) VALUES
  ('cocktails', 'Cocktails 11:11', 1),
  ('cortes', 'Carnes & Tapeo', 2),
  ('vinos', 'Mery Jane Wines', 3)
ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title,
      sort_order = EXCLUDED.sort_order;

INSERT INTO public.menu_items (
  id, category_id, name, badge, price, short_desc, detail_copy, pairing_note, tags, image_url, available, sort_order
) VALUES
  (
    'crimson-coupe',
    'cocktails',
    'La Previa Crimson Coupe',
    '★',
    '$12.500',
    'Gin macerado en cerezas negras, reducción de vino Mery Jane, vermut rosso especiado y bloque de hielo cristal sellado en vivo con pinzas de plata.',
    'El cocktail insignia que da inicio al ritual de Mery La Previa. Maceramos cerezas negras patagónicas durante 48 horas con botánicos cítricos y lo integramos con una reducción tibia de nuestro Malbec Mery Jane. Se sirve sobre cristal tallado con un bloque de hielo traslúcido sellado en barra frente a vos.',
    'Ideal para abrir la noche en barra a las 20:30 hs o acompañar mollejas crocantes.',
    '["Autor 11:11", "Hielo Sellado en Vivo", "Perfil Frutal & Especiado"]'::jsonb,
    'assets/img/ice-cube-previa.jpg',
    true,
    1
  ),
  (
    'smoked-velvet',
    'cocktails',
    '11:11 Smoked Velvet',
    '★',
    '$11.800',
    'Campari, gin botánico, cordial de pomelo rosado y campana de humo de romero quemado en barra cuando el neón marca las 11:11.',
    'Una reversión nocturna y sedosa del clásico aperitivo italiano. Equilibramos el amargor elegante del Campari con un cordial casero de pomelo rosado asado y gin de enebro salvaje. Al servirlo, encerramos la copa en una campana de cristal con humo denso de romero fresco y corteza de naranja.',
    'Perfecto para la transición entre la cena y el primer set de DJ.',
    '["Ahumado en Barra", "Cítrico & Herbal", "Favorito 11:11"]'::jsonb,
    'assets/img/cocktails-neon.jpg',
    true,
    2
  ),
  (
    'tutto-passa-spritz',
    'cocktails',
    'Tutto Passa Spritz',
    '◇',
    '$10.200',
    'Aperitivo artesanal de naranjas sanguíneas, Mery Jane Torrontés seco, soda botánica de cardamomo y aceituna verde en copa balón.',
    'Fresco, vibrante y eléctrico. Elaborado sobre la base de nuestro Mery Jane blanco bien frío, sumamos un bitter artesanal de naranjas sanguíneas y burbuja fina con toque de cardamomo. Coronado con piel de cítricos y aceituna verde carnosa.',
    'Refrescante de principio a fin, pensado para brindar en grupo en el sector living.',
    '["Fresco & Burbujeante", "Copa Balón", "Base Mery Jane"]'::jsonb,
    'assets/img/brand-tutto-passa.jpg',
    true,
    3
  ),
  (
    'ojo-de-bife-imperial',
    'cortes',
    'Ojo de Bife en Bandeja Imperial',
    '★',
    '$44.000',
    '750g fileteados a punto rouge en fuente de plata con caracú asado a las brasas, manteca de hierbas ahumadas y papas triple cocción para compartir.',
    'Nuestro corte emblema pensado para el centro de la mesa. Seleccionamos ojo de bife de pastura de 750 gramos, sellado a fuego vivo en quebracho colorado para lograr costra dorada y corazón jugoso a punto rouge. Llega trinchado en bandeja imperial de plata junto a un hueso de caracú braseado, manteca batida de hierbas ahumadas y papas triple cocción ultra crocantes.',
    'Pensado para compartir entre 2 a 3 personas junto a un Mery Jane Reserva Malbec Orgánico.',
    '["Para Compartir (750g)", "Brasas de Quebracho", "Bandeja de Plata"]'::jsonb,
    'assets/img/steak-flash.jpg',
    true,
    1
  ),
  (
    'mollejas-crocantes',
    'cortes',
    'Mollejas Crocantes & Brioche',
    '★',
    '$19.800',
    'Doradas a la plancha de hierro con miel de caña, lima asada, emulsión de ajo negro y pan brioche tostado para picar al centro.',
    'Mollejas de corazón limpias y confitadas lentamente antes de pasar por plancha de hierro al rojo vivo, logrando un exterior ultra crocante y un interior tierno y mantecoso. Se laquean al final con un toque sutil de miel de caña y jugo de lima asada, servidas sobre tostón de brioche artesanal con puntos de emulsión de ajo negro fermentado.',
    'El tapeo obligado para abrir la mesa mientras llegan los primeros tragos de autor.',
    '["Tapeo al Centro", "Plancha de Hierro", "Ajo Negro & Lima"]'::jsonb,
    'assets/img/cocktails-neon.jpg',
    true,
    2
  ),
  (
    't-bone-madurado',
    'cortes',
    'T-Bone Madurado "La Previa"',
    '◇',
    '$52.000',
    'Corte de 900g con hueso madurado 35 días, gremolata cítrica, ajos confitados en oliva virgen y pimientos del padrón.',
    'Dos texturas nobles unidas por el hueso en T: la terneza absoluta del lomo y el sabor profundo del bife angosto, madurados en cámara durante 35 días para concentrar su carácter. Asado a las brasas y terminado con gremolata fresca de perejil y limón, cabezas de ajo dulces confitadas en aceite de oliva virgen extra y pimientos del padrón.',
    'Corte de colección para mesas que buscan una cena potente antes del club.',
    '["Maduración 35 Días", "900g con Hueso", "Edición Limitada"]'::jsonb,
    'assets/img/steak-flash.jpg',
    true,
    3
  ),
  (
    'mery-jane-blanc',
    'vinos',
    'Mery Jane Blanc de Nuit (Frapera)',
    '★',
    '$26.500',
    'Nuestra etiqueta insignia servida bien fría en frapera de plata. Notas de durazno blanco, jazmín y acidez eléctrica ideal para toda la noche.',
    'Creado especialmente para la noche de Mery La Previa. Un blanco aromático, tenso y sumamente refrescante que se toma bien frío desde la cena hasta que arranca la cabina de DJ. Llega a tu mesa en frapera labrada con hielo cristal para mantener su temperatura exacta.',
    'Versátil y magnético: acompaña tanto tapeo caliente como brindis de medianoche.',
    '["Servicio en Frapera", "Etiqueta Insignia", "Fresco & Aromático"]'::jsonb,
    'assets/img/wine-mery.jpg',
    true,
    1
  ),
  (
    'ritual-caja-previa',
    'vinos',
    'Ritual "Caja La Previa x4" + Brut',
    '★',
    '$92.000',
    'Caja de 3 botellas Mery Jane a elección + 1 Espumante Extra Brut en mesa. El ritual favorito para grupos de amigos y festejos de cumpleaños.',
    'La experiencia completa para mesas de amigos y festejos VIP. Incluye nuestra icónica caja Mery Jane con 3 etiquetas a elección (Blanc de Nuit o Reserva Malbec) más una botella de Espumante Extra Brut para el brindis de las 00:00 hs, servida en mesa con bengalas y frapera.',
    'Recomendado para grupos de 6 a 12 amigos en previa o cumpleaños.',
    '["Pack 4 Botellas", "Especial Cumpleaños", "Incluye Extra Brut"]'::jsonb,
    'assets/img/brand-previa-zine.jpg',
    true,
    2
  ),
  (
    'mery-jane-malbec',
    'vinos',
    'Mery Jane Reserva Malbec Orgánico',
    '◇',
    '$29.000',
    'Tinto de perfil moderno y fluido, ciruelas negras, pimienta rosa y paso de terciopelo pensado para acompañar carnes en bandeja.',
    'Proveniente de viñedos orgánicos de altura en Valle de Uco, este Malbec busca fluidez y elegancia por encima de la madera pesada. Expresa fruta negra nítida, violetas y un final especiado muy amable que invita a la segunda copa.',
    'El compañero indiscutido del Ojo de Bife en Bandeja Imperial y el T-Bone Madurado.',
    '["Valle de Uco", "Orgánico", "Taninos de Terciopelo"]'::jsonb,
    'assets/img/bottle-hero-isolated.jpg',
    true,
    3
  )
ON CONFLICT (id) DO NOTHING;

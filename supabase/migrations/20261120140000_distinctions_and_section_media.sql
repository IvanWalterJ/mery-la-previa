-- Migration: Allow empty/custom dish distinctions, migrate static menu images to WebP, and seed section media settings

-- 1. Remove forced '★' default on menu_items.badge
ALTER TABLE public.menu_items
  ALTER COLUMN badge SET DEFAULT '';

-- 2. Clear forced '★' distinction from user-created food items (Burgers & Platos Gourmet)
UPDATE public.menu_items
SET badge = '',
    updated_at = now()
WHERE badge = '★'
  AND category_id IN ('birras', 'cortes');

-- 3. Point seeded local .jpg menu images to optimized .webp assets
UPDATE public.menu_items
SET image_url = regexp_replace(image_url, '\.jpg$', '.webp'),
    updated_at = now()
WHERE image_url LIKE 'assets/img/%.jpg';

-- 4. Seed configurable dish distinctions, section videos, and section images in site_settings
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'dish_distinctions',
  '[
    {"id":"★","symbol":"★","label":"Recomendado de la casa"},
    {"id":"◇","symbol":"◇","label":"Especialidad 11:11"}
  ]'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'site_videos',
  '{
    "intro": "assets/video/neon-intro-mery.mp4",
    "hero_wide": "assets/video/variaciones-flow/v5-hero-wide.mp4",
    "hero_portrait": "assets/video/variaciones-flow/v5-hero-portrait.mp4",
    "main": "assets/video/bottle-360-loop.mp4"
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'site_section_images',
  '{
    "drinks": "assets/img/cocktails-neon.webp",
    "menu": "assets/img/steak-flash.webp",
    "roulette": "assets/img/ruleta-previa-card.webp",
    "reservation": "assets/img/neon-wall-mery.webp",
    "about": "assets/img/dj-previa.webp",
    "about_reserve": "assets/img/brand-previa-zine.webp",
    "about_bar": "assets/img/cocktails-neon.webp"
  }'::jsonb,
  now()
)
ON CONFLICT (key) DO NOTHING;

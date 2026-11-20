-- Add section_type column to menu_categories to distinguish Tragos & Bebidas ('drinks') vs La Carta ('food')
ALTER TABLE public.menu_categories
  ADD COLUMN IF NOT EXISTS section_type TEXT NOT NULL DEFAULT 'drinks';

-- Backfill existing categories to match current public menu grouping
UPDATE public.menu_categories
SET section_type = 'food',
    updated_at = now()
WHERE slug IN ('cortes', 'birras');

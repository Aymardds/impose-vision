-- =========================================================================
-- IMPOSE MAGAZINE — CRÉATION DES 4 TABLES MANQUANTES
-- (Cibles, Formules/Offres, Prestations, Objectifs)
-- =========================================================================
-- Copiez ce contenu et collez-le directement dans :
-- https://supabase.com/dashboard/project/uwrcztmhsobwsylsltrv/sql/new
-- Puis cliquez sur "Run".

-- 1. TABLE DES CIBLES / ACTEURS (TARGET_AUDIENCES)
CREATE TABLE IF NOT EXISTS public.target_audiences (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cta_text TEXT DEFAULT 'En savoir plus',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE DES FORMULES / PACKAGES
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  badge TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE DES PRESTATIONS / SERVICES
CREATE TABLE IF NOT EXISTS public.prestations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'editorial',
  category_label TEXT DEFAULT '',
  description TEXT DEFAULT '',
  recommended_for TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE DES OBJECTIFS (liste déroulante du formulaire)
CREATE TABLE IF NOT EXISTS public.objectives (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACTIVATION ROW LEVEL SECURITY
ALTER TABLE public.target_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;

-- 6. LECTURE PUBLIQUE (SITE VISITEUR)
DROP POLICY IF EXISTS "Public target_audiences viewable" ON public.target_audiences;
CREATE POLICY "Public target_audiences viewable" ON public.target_audiences FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public packages viewable" ON public.packages;
CREATE POLICY "Public packages viewable" ON public.packages FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public prestations viewable" ON public.prestations;
CREATE POLICY "Public prestations viewable" ON public.prestations FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public objectives viewable" ON public.objectives;
CREATE POLICY "Public objectives viewable" ON public.objectives FOR SELECT USING (is_active = true);

-- 7. ADMINISTRATION TOTALE (PANNEAU ADMIN)
DROP POLICY IF EXISTS "Admin full access target_audiences" ON public.target_audiences;
CREATE POLICY "Admin full access target_audiences" ON public.target_audiences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access packages" ON public.packages;
CREATE POLICY "Admin full access packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access prestations" ON public.prestations;
CREATE POLICY "Admin full access prestations" ON public.prestations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access objectives" ON public.objectives;
CREATE POLICY "Admin full access objectives" ON public.objectives FOR ALL USING (true) WITH CHECK (true);

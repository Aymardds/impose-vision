-- =========================================================================
-- IMPOSE MAGAZINE — SCHÉMA SUPABASE & POLITIQUES DE SÉCURITÉ
-- =========================================================================
-- Exécutez ce script dans le "SQL Editor" de votre tableau de bord Supabase :
-- https://supabase.com/dashboard/project/uwrcztmhsobwsylsltrv/sql/new

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES COUVERTURES (COVERS)
CREATE TABLE IF NOT EXISTS public.covers (
  id BIGSERIAL PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  person TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  featured BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  link_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.covers ADD COLUMN IF NOT EXISTS link_url TEXT DEFAULT '';

-- 3. TABLE DES PARTENAIRES (PARTNERS)
CREATE TABLE IF NOT EXISTS public.partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  class_name TEXT DEFAULT 'h-9 sm:h-11 w-auto max-w-[140px]',
  website TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE DES MÉTRIQUES DU HERO (METRICS)
CREATE TABLE IF NOT EXISTS public.metrics (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Star',
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE AUDIENCE (CANAUX SITE WEB, LINKEDIN, FACEBOOK)
CREATE TABLE IF NOT EXISTS public.audience (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  badge TEXT DEFAULT 'Chiffres Vérifiés',
  period TEXT DEFAULT 'Derniers 12 mois',
  headline TEXT DEFAULT '',
  subheadline TEXT DEFAULT '',
  primary_stat JSONB DEFAULT '{"value":"","label":""}',
  highlight_badge TEXT DEFAULT '',
  key_takeaway TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'Globe',
  metrics JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE DES LEADS CAPTURÉS (LEADS)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  sector TEXT NOT NULL,
  objective TEXT DEFAULT '',
  selected_package TEXT DEFAULT '',
  message TEXT DEFAULT '',
  source TEXT DEFAULT 'Landing Page IMPOSE 100% Digital',
  status TEXT DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE DES CIBLES / ACTEURS (TARGET_AUDIENCES)
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

-- 8. TABLE DES FORMULES / PACKAGES
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

-- 9. TABLE DES PRESTATIONS / SERVICES
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

-- 10. TABLE DES OBJECTIFS (liste pour le formulaire de contact)
CREATE TABLE IF NOT EXISTS public.objectives (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. POLITIQUES DE SÉCURITÉ (ROW LEVEL SECURITY)
ALTER TABLE public.covers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour le site web (idempotent avec DROP POLICY IF EXISTS)
DROP POLICY IF EXISTS "Public covers viewable" ON public.covers;
CREATE POLICY "Public covers viewable" ON public.covers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public partners viewable" ON public.partners;
CREATE POLICY "Public partners viewable" ON public.partners FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public metrics viewable" ON public.metrics;
CREATE POLICY "Public metrics viewable" ON public.metrics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public audience viewable" ON public.audience;
CREATE POLICY "Public audience viewable" ON public.audience FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public target_audiences viewable" ON public.target_audiences;
CREATE POLICY "Public target_audiences viewable" ON public.target_audiences FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public packages viewable" ON public.packages;
CREATE POLICY "Public packages viewable" ON public.packages FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public prestations viewable" ON public.prestations;
CREATE POLICY "Public prestations viewable" ON public.prestations FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public objectives viewable" ON public.objectives;
CREATE POLICY "Public objectives viewable" ON public.objectives FOR SELECT USING (is_active = true);

-- Insertion publique pour les formulaires de contact
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Administration (CRUD complet pour la gestion dynamique)
DROP POLICY IF EXISTS "Admin full access covers" ON public.covers;
CREATE POLICY "Admin full access covers" ON public.covers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access partners" ON public.partners;
CREATE POLICY "Admin full access partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access metrics" ON public.metrics;
CREATE POLICY "Admin full access metrics" ON public.metrics FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access audience" ON public.audience;
CREATE POLICY "Admin full access audience" ON public.audience FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access leads" ON public.leads;
CREATE POLICY "Admin full access leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access target_audiences" ON public.target_audiences;
CREATE POLICY "Admin full access target_audiences" ON public.target_audiences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access packages" ON public.packages;
CREATE POLICY "Admin full access packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access prestations" ON public.prestations;
CREATE POLICY "Admin full access prestations" ON public.prestations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access objectives" ON public.objectives;
CREATE POLICY "Admin full access objectives" ON public.objectives FOR ALL USING (true) WITH CHECK (true);

-- 12. BUCKET DE STOCKAGE POUR LES IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('impose-media', 'impose-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public media access" ON storage.objects;
CREATE POLICY "Public media access" ON storage.objects FOR SELECT USING (bucket_id = 'impose-media');

DROP POLICY IF EXISTS "Admin upload media" ON storage.objects;
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'impose-media');

DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE USING (bucket_id = 'impose-media');

DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE USING (bucket_id = 'impose-media');

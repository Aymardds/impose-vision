-- =========================================================================
-- IMPOSE MAGAZINE — SCHÉMA SUPABASE & POLITIQUES DE SÉCURITÉ
-- =========================================================================
-- Exécutez ce script dans le "SQL Editor" de votre tableau de bord Supabase.

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 5. TABLE DES LEADS CAPTURÉS (LEADS)
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

-- 6. POLITIQUES DE SÉCURITÉ (ROW LEVEL SECURITY)
ALTER TABLE public.covers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour le site web
CREATE POLICY "Public covers viewable" ON public.covers FOR SELECT USING (true);
CREATE POLICY "Public partners viewable" ON public.partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public metrics viewable" ON public.metrics FOR SELECT USING (true);

-- Insertion publique pour les formulaires de contact
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Administration (CRUD complet pour la gestion dynamique)
CREATE POLICY "Admin full access covers" ON public.covers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access metrics" ON public.metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- 7. BUCKET DE STOCKAGE POUR LES IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('impose-media', 'impose-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public media access" ON storage.objects FOR SELECT USING (bucket_id = 'impose-media');
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'impose-media');
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE USING (bucket_id = 'impose-media');
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE USING (bucket_id = 'impose-media');

-- 8. DONNÉES INITIALES (MÉTRIQUES)
INSERT INTO public.metrics (key, value, label, icon_name, order_index) VALUES
  ('editions', '+31', 'Éditions publiées', 'Star', 1),
  ('pays', '+15', 'Pays représentés', 'Globe', 2),
  ('leaders', '+500', 'Leaders mis en avant', 'TrendingUp', 3),
  ('digital', '100%', 'Média 100% Digital', 'Zap', 4)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  icon_name = EXCLUDED.icon_name,
  order_index = EXCLUDED.order_index;

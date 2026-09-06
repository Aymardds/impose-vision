import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || "";
export const SUPABASE_ANON_KEY =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) || "";

export function isSupabaseConfigured(): boolean {
  return (
    typeof SUPABASE_URL === "string" &&
    SUPABASE_URL.trim().length > 0 &&
    SUPABASE_URL.startsWith("https://") &&
    typeof SUPABASE_ANON_KEY === "string" &&
    SUPABASE_ANON_KEY.trim().length > 0
  );
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseInstance;
}

export interface DbCover {
  id?: number;
  number: string;
  title: string;
  person: string;
  date: string;
  image_url: string;
  description?: string;
  featured: boolean;
  order_index?: number;
  created_at?: string;
}

export interface DbPartner {
  id?: number;
  name: string;
  logo_url: string;
  class_name?: string;
  website?: string;
  order_index?: number;
  is_active: boolean;
  created_at?: string;
}

export interface DbMetric {
  id?: number;
  key: string;
  value: string;
  label: string;
  icon_name: string;
  order_index?: number;
  updated_at?: string;
}

export interface DbLead {
  id?: string;
  first_name: string;
  last_name: string;
  company: string;
  position?: string;
  email: string;
  phone: string;
  country: string;
  sector: string;
  objective?: string;
  selected_package?: string;
  message?: string;
  source?: string;
  status?: string;
  created_at?: string;
}

/**
 * Test Supabase connection and verify tables
 */
export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  message: string;
  details?: { coversCount?: number; partnersCount?: number; metricsCount?: number };
}> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Variables d'environnement Supabase (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY) manquantes.",
    };
  }

  const client = getSupabase();
  if (!client) {
    return { ok: false, message: "Impossible d'instancier le client Supabase." };
  }

  try {
    const [coversRes, partnersRes, metricsRes] = await Promise.all([
      client.from("covers").select("id", { count: "exact" }).limit(1),
      client.from("partners").select("id", { count: "exact" }).limit(1),
      client.from("metrics").select("id", { count: "exact" }).limit(1),
    ]);

    if (coversRes.error) {
      return {
        ok: false,
        message: `La table 'covers' n'est pas encore créée (${coversRes.error.message}). Veuillez exécuter le script supabase/schema.sql dans le SQL Editor de Supabase.`,
      };
    }
    if (partnersRes.error) {
      return {
        ok: false,
        message: `La table 'partners' n'est pas encore créée (${partnersRes.error.message}). Veuillez exécuter le script supabase/schema.sql.`,
      };
    }
    if (metricsRes.error) {
      return {
        ok: false,
        message: `La table 'metrics' n'est pas encore créée (${metricsRes.error.message}). Veuillez exécuter le script supabase/schema.sql.`,
      };
    }

    return {
      ok: true,
      message: "Connexion Supabase réussie et toutes les tables sont opérationnelles !",
      details: {
        coversCount: coversRes.count ?? 0,
        partnersCount: partnersRes.count ?? 0,
        metricsCount: metricsRes.count ?? 0,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      message: `Erreur de connexion : ${errorMsg}`,
    };
  }
}

/**
 * Upload image to Supabase Storage bucket 'impose-media'
 */
export async function uploadMediaToSupabase(
  file: File,
  folder: "covers" | "partners" = "covers"
): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const ext = file.name.split(".").pop() || "jpg";
    const cleanName = file.name
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase()
      .slice(0, 30);
    const fileName = `${folder}/${Date.now()}-${cleanName}.${ext}`;

    const { error: uploadError } = await client.storage
      .from("impose-media")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = client.storage.from("impose-media").getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.error("Failed to upload image:", err);
    return null;
  }
}

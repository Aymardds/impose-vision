import { useEffect, useState, useCallback } from "react";
import {
  magazineIssues,
  initialPartners,
  initialMetrics,
  type MagazineIssue,
  type PartnerItem,
  type MetricItem,
} from "@/data/impose";
import {
  getSupabase,
  isSupabaseConfigured,
  type DbCover,
  type DbPartner,
  type DbMetric,
  type DbLead,
} from "@/lib/supabase";

const STORAGE_KEYS = {
  COVERS: "impose_dynamic_covers",
  PARTNERS: "impose_dynamic_partners",
  METRICS: "impose_dynamic_metrics",
  LEADS: "impose_leads_backup",
};

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not load from localStorage:", key, e);
  }
  return fallback;
}

function saveLocal<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save to localStorage:", key, e);
  }
}

export function useDynamicData() {
  const [covers, setCovers] = useState<MagazineIssue[]>(() =>
    loadLocal(STORAGE_KEYS.COVERS, magazineIssues)
  );
  const [partners, setPartners] = useState<PartnerItem[]>(() =>
    loadLocal(STORAGE_KEYS.PARTNERS, initialPartners)
  );
  const [metrics, setMetrics] = useState<MetricItem[]>(() =>
    loadLocal(STORAGE_KEYS.METRICS, initialMetrics)
  );
  const [leads, setLeads] = useState<DbLead[]>(() =>
    loadLocal(STORAGE_KEYS.LEADS, [])
  );
  const [loading, setLoading] = useState(false);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const client = getSupabase();

    if (!client) {
      setIsSupabaseActive(false);
      setStatusMessage("Mode autonome local (Supabase non configuré)");
      setLoading(false);
      return;
    }

    try {
      const [coversRes, partnersRes, metricsRes, leadsRes] = await Promise.all([
        client.from("covers").select("*").order("order_index", { ascending: true }),
        client.from("partners").select("*").order("order_index", { ascending: true }),
        client.from("metrics").select("*").order("order_index", { ascending: true }),
        client.from("leads").select("*").order("created_at", { ascending: false }),
      ]);

      let hasSupabaseData = false;

      // Covers
      if (coversRes.data && coversRes.data.length > 0) {
        hasSupabaseData = true;
        const mappedCovers: MagazineIssue[] = coversRes.data.map((c: DbCover) => ({
          id: c.id ?? Date.now(),
          number: c.number,
          title: c.title,
          person: c.person,
          date: c.date,
          image: c.image_url,
          description: c.description || "",
          featured: c.featured,
        }));
        setCovers(mappedCovers);
        saveLocal(STORAGE_KEYS.COVERS, mappedCovers);
      }

      // Partners
      if (partnersRes.data && partnersRes.data.length > 0) {
        hasSupabaseData = true;
        const mappedPartners: PartnerItem[] = partnersRes.data.map((p: DbPartner) => ({
          id: p.id ?? Date.now(),
          name: p.name,
          logo: p.logo_url,
          className: p.class_name || "h-9 sm:h-11 w-auto max-w-[140px]",
          website: p.website,
          order_index: p.order_index,
          is_active: p.is_active,
        }));
        setPartners(mappedPartners);
        saveLocal(STORAGE_KEYS.PARTNERS, mappedPartners);
      }

      // Metrics
      if (metricsRes.data && metricsRes.data.length > 0) {
        hasSupabaseData = true;
        const mappedMetrics: MetricItem[] = metricsRes.data.map((m: DbMetric) => ({
          id: m.id ?? Date.now(),
          key: m.key,
          value: m.value,
          label: m.label,
          iconName: m.icon_name || "Star",
          order_index: m.order_index,
        }));
        setMetrics(mappedMetrics);
        saveLocal(STORAGE_KEYS.METRICS, mappedMetrics);
      }

      // Leads
      if (leadsRes.data && leadsRes.data.length > 0) {
        setLeads(leadsRes.data);
        saveLocal(STORAGE_KEYS.LEADS, leadsRes.data);
      }

      setIsSupabaseActive(true);
      setStatusMessage(
        hasSupabaseData
          ? "Connecté à Supabase en temps réel"
          : "Connecté à Supabase (Tables prêtes mais vides, initialisez avec le bouton Seed)"
      );
    } catch (err: unknown) {
      console.error("Error fetching Supabase data:", err);
      setIsSupabaseActive(false);
      setStatusMessage("Connexion Supabase instable, repli local activé");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD Covers
  const addCover = async (cover: Omit<MagazineIssue, "id">) => {
    const newId = Date.now();
    const newCover: MagazineIssue = { ...cover, id: newId };
    const updated = [newCover, ...covers];
    setCovers(updated);
    saveLocal(STORAGE_KEYS.COVERS, updated);

    const client = getSupabase();
    if (client) {
      await client.from("covers").insert({
        number: cover.number,
        title: cover.title,
        person: cover.person,
        date: cover.date,
        image_url: cover.image,
        description: cover.description,
        featured: cover.featured,
        order_index: 0,
      });
    }
  };

  const updateCover = async (id: number | string, patch: Partial<MagazineIssue>) => {
    const updated = covers.map((c) => (c.id === id ? { ...c, ...patch } : c));
    setCovers(updated);
    saveLocal(STORAGE_KEYS.COVERS, updated);

    const client = getSupabase();
    if (client) {
      const dbPatch: Record<string, unknown> = {};
      if (patch.number !== undefined) dbPatch["number"] = patch.number;
      if (patch.title !== undefined) dbPatch["title"] = patch.title;
      if (patch.person !== undefined) dbPatch["person"] = patch.person;
      if (patch.date !== undefined) dbPatch["date"] = patch.date;
      if (patch.image !== undefined) dbPatch["image_url"] = patch.image;
      if (patch.description !== undefined) dbPatch["description"] = patch.description;
      if (patch.featured !== undefined) dbPatch["featured"] = patch.featured;

      await client.from("covers").update(dbPatch).eq("id", id);
    }
  };

  const deleteCover = async (id: number | string) => {
    const updated = covers.filter((c) => c.id !== id);
    setCovers(updated);
    saveLocal(STORAGE_KEYS.COVERS, updated);

    const client = getSupabase();
    if (client) {
      await client.from("covers").delete().eq("id", id);
    }
  };

  // CRUD Partners
  const addPartner = async (partner: Omit<PartnerItem, "id">) => {
    const newId = Date.now();
    const newPartner: PartnerItem = { ...partner, id: newId, is_active: true };
    const updated = [...partners, newPartner];
    setPartners(updated);
    saveLocal(STORAGE_KEYS.PARTNERS, updated);

    const client = getSupabase();
    if (client) {
      await client.from("partners").insert({
        name: partner.name,
        logo_url: partner.logo,
        class_name: partner.className || "h-9 sm:h-11 w-auto max-w-[140px]",
        website: partner.website || "",
        order_index: updated.length,
        is_active: true,
      });
    }
  };

  const updatePartner = async (id: number | string, patch: Partial<PartnerItem>) => {
    const updated = partners.map((p) => (p.id === id ? { ...p, ...patch } : p));
    setPartners(updated);
    saveLocal(STORAGE_KEYS.PARTNERS, updated);

    const client = getSupabase();
    if (client) {
      const dbPatch: Record<string, unknown> = {};
      if (patch.name !== undefined) dbPatch["name"] = patch.name;
      if (patch.logo !== undefined) dbPatch["logo_url"] = patch.logo;
      if (patch.className !== undefined) dbPatch["class_name"] = patch.className;
      if (patch.website !== undefined) dbPatch["website"] = patch.website;
      if (patch.is_active !== undefined) dbPatch["is_active"] = patch.is_active;

      await client.from("partners").update(dbPatch).eq("id", id);
    }
  };

  const deletePartner = async (id: number | string) => {
    const updated = partners.filter((p) => p.id !== id);
    setPartners(updated);
    saveLocal(STORAGE_KEYS.PARTNERS, updated);

    const client = getSupabase();
    if (client) {
      await client.from("partners").delete().eq("id", id);
    }
  };

  // CRUD Metrics
  const updateMetric = async (key: string, value: string, label: string) => {
    const updated = metrics.map((m) => (m.key === key ? { ...m, value, label } : m));
    setMetrics(updated);
    saveLocal(STORAGE_KEYS.METRICS, updated);

    const client = getSupabase();
    if (client) {
      await client.from("metrics").update({ value, label }).eq("key", key);
    }
  };

  // Seed initial data to Supabase (1-click migration)
  const seedToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const client = getSupabase();
    if (!client) {
      return { success: false, message: "Supabase non configuré. Renseignez d'abord vos variables .env." };
    }

    try {
      // Seed metrics
      for (let i = 0; i < initialMetrics.length; i++) {
        const m = initialMetrics[i];
        if (!m) continue;
        await client.from("metrics").upsert(
          {
            key: m.key,
            value: m.value,
            label: m.label,
            icon_name: m.iconName,
            order_index: i + 1,
          },
          { onConflict: "key" }
        );
      }

      // Seed covers
      const coversToInsert = magazineIssues.map((c, idx) => ({
        number: c.number,
        title: c.title,
        person: c.person,
        date: c.date,
        image_url: c.image,
        description: c.description || "",
        featured: c.featured,
        order_index: idx + 1,
      }));

      await client.from("covers").delete().neq("id", 0);
      await client.from("covers").insert(coversToInsert);

      // Seed partners
      const partnersToInsert = initialPartners.map((p, idx) => ({
        name: p.name,
        logo_url: p.logo,
        class_name: p.className,
        website: p.website || "",
        order_index: idx + 1,
        is_active: p.is_active !== false,
      }));

      await client.from("partners").delete().neq("id", 0);
      await client.from("partners").insert(partnersToInsert);

      await fetchData();
      return { success: true, message: "Les 16 couvertures, 9 partenaires et 4 métriques ont été injectés dans Supabase avec succès !" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Erreur lors de l'injection : ${msg}` };
    }
  };

  return {
    covers,
    partners,
    metrics,
    leads,
    loading,
    isSupabaseActive,
    statusMessage,
    isConfigured: isSupabaseConfigured(),
    refresh: fetchData,
    addCover,
    updateCover,
    deleteCover,
    addPartner,
    updatePartner,
    deletePartner,
    updateMetric,
    seedToSupabase,
  };
}

import { useEffect, useState, useCallback } from "react";
import {
  magazineIssues,
  initialPartners,
  initialMetrics,
  initialAudienceChannels,
  initialTargetAudiences,
  type MagazineIssue,
  type PartnerItem,
  type MetricItem,
  type AudienceChannel,
  type AudienceMetric,
  type TargetAudience,
} from "@/data/impose";
// NOTE: initialAudienceChannels sert de fallback si Supabase n'est pas configuré
import {
  getSupabase,
  isSupabaseConfigured,
  normalizeDbLead,
  type DbCover,
  type DbPartner,
  type DbMetric,
  type DbLead,
} from "@/lib/supabase";

const STORAGE_KEYS = {
  COVERS: "impose_dynamic_covers",
  COVER_LINKS: "impose_dynamic_cover_links",
  PARTNERS: "impose_dynamic_partners",
  METRICS: "impose_dynamic_metrics",
  AUDIENCE: "impose_dynamic_audience",
  TARGET_AUDIENCES: "impose_dynamic_target_audiences",
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
    // Notifie immédiatement tous les composants de la page en temps réel (même onglet)
    window.dispatchEvent(
      new CustomEvent("impose_storage_sync", { detail: { key, data } })
    );
  } catch (e) {
    console.warn("Could not save to localStorage:", key, e);
  }
}

export function getStoredCoverLinks(): Record<string, string> {
  return loadLocal<Record<string, string>>(STORAGE_KEYS.COVER_LINKS, {});
}

export function saveCoverLink(idOrNumber: string | number, link: string) {
  const current = getStoredCoverLinks();
  current[String(idOrNumber)] = link.trim();
  saveLocal(STORAGE_KEYS.COVER_LINKS, current);
}

export function useDynamicData() {
  const [covers, setCovers] = useState<MagazineIssue[]>(() => {
    const loaded = loadLocal(STORAGE_KEYS.COVERS, magazineIssues);
    const storedLinks = getStoredCoverLinks();
    return loaded.map((c) => {
      const defaultIssue = magazineIssues.find((m) => String(m.id) === String(c.id) || m.number === c.number);
      return {
        ...c,
        link: c.link || storedLinks[String(c.id)] || storedLinks[c.number] || defaultIssue?.link || "https://impose-ci.com/category/le-mensuel/",
      };
    });
  });
  const [partners, setPartners] = useState<PartnerItem[]>(() =>
    loadLocal(STORAGE_KEYS.PARTNERS, initialPartners)
  );
  const [metrics, setMetrics] = useState<MetricItem[]>(() =>
    loadLocal(STORAGE_KEYS.METRICS, initialMetrics)
  );
  const [audience, setAudience] = useState<AudienceChannel[]>(() =>
    loadLocal(STORAGE_KEYS.AUDIENCE, initialAudienceChannels)
  );
  const [targetAudiences, setTargetAudiences] = useState<TargetAudience[]>(() =>
    loadLocal(STORAGE_KEYS.TARGET_AUDIENCES, initialTargetAudiences)
  );
  const [leads, setLeads] = useState<DbLead[]>(() => {
    const raw = loadLocal<Record<string, unknown>[]>(STORAGE_KEYS.LEADS, []);
    return raw.map(normalizeDbLead);
  });
  const [loading, setLoading] = useState(false);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSync = (key: string, value: unknown) => {
      if (key === STORAGE_KEYS.AUDIENCE && Array.isArray(value)) {
        setAudience(value as AudienceChannel[]);
      }
      if (key === STORAGE_KEYS.TARGET_AUDIENCES && Array.isArray(value)) {
        setTargetAudiences(value as TargetAudience[]);
      }
      if (key === STORAGE_KEYS.COVERS && Array.isArray(value)) {
        setCovers(value as MagazineIssue[]);
      }
      if (key === STORAGE_KEYS.PARTNERS && Array.isArray(value)) {
        setPartners(value as PartnerItem[]);
      }
      if (key === STORAGE_KEYS.METRICS && Array.isArray(value)) {
        setMetrics(value as MetricItem[]);
      }
      if (key === STORAGE_KEYS.COVER_LINKS && typeof value === "object" && value !== null) {
        const linkMap = value as Record<string, string>;
        setCovers((prev) =>
          prev.map((c) => {
            const freshLink = linkMap[String(c.id)] || linkMap[c.number];
            return freshLink !== undefined ? { ...c, link: freshLink } : c;
          })
        );
      }
    };

    const onCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; data: unknown }>;
      if (customEvent.detail) {
        handleSync(customEvent.detail.key, customEvent.detail.data);
      }
    };

    const onStorageEvent = (e: StorageEvent) => {
      if (e.key && e.newValue) {
        try {
          handleSync(e.key, JSON.parse(e.newValue));
        } catch (_) {}
      }
    };

    window.addEventListener("impose_storage_sync", onCustomSync);
    window.addEventListener("storage", onStorageEvent);
    return () => {
      window.removeEventListener("impose_storage_sync", onCustomSync);
      window.removeEventListener("storage", onStorageEvent);
    };
  }, []);

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
        const storedLinks = getStoredCoverLinks();
        const existingLocalCovers = loadLocal<MagazineIssue[]>(STORAGE_KEYS.COVERS, []);
        const localLinkMap = new Map<string, string>();
        existingLocalCovers.forEach((c) => {
          if (c.link) {
            localLinkMap.set(String(c.id), c.link);
            localLinkMap.set(c.number, c.link);
          }
        });

        const mappedCovers: MagazineIssue[] = coversRes.data.map((c: DbCover) => {
          const dbLink = (c.link_url || "").trim();
          const fallbackLink =
            storedLinks[String(c.id)] ||
            storedLinks[c.number] ||
            localLinkMap.get(String(c.id)) ||
            localLinkMap.get(c.number) ||
            "";
          const link = dbLink || fallbackLink;

          return {
            id: c.id ?? Date.now(),
            number: c.number,
            title: c.title,
            person: c.person,
            date: c.date,
            image: c.image_url,
            description: c.description || "",
            featured: c.featured,
            link,
          };
        });
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

      // Metrics — récupération prioritaire depuis Supabase (source de vérité cross-device)
      if (metricsRes.error) {
        console.warn("Table metrics Supabase inaccessible, repli sur données locales:", metricsRes.error.message);
      } else if (metricsRes.data && metricsRes.data.length > 0) {
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
      } else {
        // Table vide : auto-seed silencieux des métriques initiales dans Supabase
        console.info("Table metrics vide dans Supabase — injection automatique des données initiales.");
        const metricsToInsert = initialMetrics.map((m, idx) => ({
          key: m.key,
          value: m.value,
          label: m.label,
          icon_name: m.iconName,
          order_index: m.order_index ?? idx + 1,
        }));
        await client.from("metrics").upsert(metricsToInsert, { onConflict: "key" });
        setMetrics(initialMetrics);
        saveLocal(STORAGE_KEYS.METRICS, initialMetrics);
      }

      // Audience — récupération prioritaire depuis Supabase (source de vérité cross-device)
      const audienceRes = await client.from("audience").select("*").order("order_index", { ascending: true });
      if (audienceRes.error) {
        console.warn("Table audience Supabase inaccessible, repli sur données locales:", audienceRes.error.message);
      } else if (audienceRes.data && audienceRes.data.length > 0) {
        hasSupabaseData = true;
        const mappedAudience: AudienceChannel[] = audienceRes.data.map((a: Record<string, unknown>) => ({
          id: String(a["id"]),
          name: String(a["name"] || ""),
          badge: String(a["badge"] || "Chiffres Vérifiés"),
          period: String(a["period"] || "Derniers 12 mois"),
          headline: String(a["headline"] || ""),
          subheadline: String(a["subheadline"] || ""),
          primaryStat: (a["primary_stat"] as { value: string; label: string }) || { value: "", label: "" },
          highlightBadge: (a["highlight_badge"] as string) || "",
          keyTakeaway: String(a["key_takeaway"] || ""),
          iconName: String(a["icon_name"] || "Globe"),
          order_index: Number(a["order_index"]) || 0,
          is_active: a["is_active"] !== false,
          metrics: (a["metrics"] as AudienceMetric[]) || [],
        }));
        setAudience(mappedAudience);
        saveLocal(STORAGE_KEYS.AUDIENCE, mappedAudience);
      } else {
        // Table vide : auto-seed silencieux des données initiales dans Supabase
        console.info("Table audience vide dans Supabase — injection automatique des données initiales.");
        const audienceToInsert = initialAudienceChannels.map((ch, idx) => ({
          id: ch.id,
          name: ch.name,
          badge: ch.badge,
          period: ch.period,
          headline: ch.headline,
          subheadline: ch.subheadline,
          primary_stat: ch.primaryStat,
          highlight_badge: ch.highlightBadge || "",
          key_takeaway: ch.keyTakeaway,
          icon_name: ch.iconName,
          metrics: ch.metrics,
          order_index: ch.order_index ?? idx + 1,
          is_active: ch.is_active !== false,
        }));
        await client.from("audience").upsert(audienceToInsert, { onConflict: "id" });
        setAudience(initialAudienceChannels);
        saveLocal(STORAGE_KEYS.AUDIENCE, initialAudienceChannels);
      }

      // Leads
      if (leadsRes.data && leadsRes.data.length > 0) {
        const normalizedLeads = (leadsRes.data as Record<string, unknown>[]).map(normalizeDbLead);
        setLeads(normalizedLeads);
        saveLocal(STORAGE_KEYS.LEADS, normalizedLeads);
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
    if (cover.link) {
      saveCoverLink(newId, cover.link);
      if (cover.number) saveCoverLink(cover.number, cover.link);
    }
    const updated = [newCover, ...covers];
    setCovers(updated);
    saveLocal(STORAGE_KEYS.COVERS, updated);

    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client.from("covers").insert({
          number: cover.number,
          title: cover.title,
          person: cover.person,
          date: cover.date,
          image_url: cover.image,
          description: cover.description,
          featured: cover.featured,
          link_url: cover.link || "",
          order_index: 0,
        });
        if (error && (error.code === "PGRST204" || error.message?.includes("link_url"))) {
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
      } catch (e) {
        console.warn("Notice insertion cover Supabase:", e);
      }
    }
  };

  const updateCover = async (id: number | string, patch: Partial<MagazineIssue>) => {
    // 1. Sauvegarde dédiée du lien de l'article pour persistance absolue
    if (patch.link !== undefined) {
      saveCoverLink(id, patch.link);
      const existing = covers.find((c) => c.id === id);
      if (existing?.number) {
        saveCoverLink(existing.number, patch.link);
      }
    }

    // 2. Mise à jour immédiate locale et mémoire
    const updated = covers.map((c) => (c.id === id ? { ...c, ...patch } : c));
    setCovers(updated);
    saveLocal(STORAGE_KEYS.COVERS, updated);

    // 3. Synchronisation Supabase tolérante aux pannes de schéma
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
      if (patch.link !== undefined) dbPatch["link_url"] = patch.link;

      try {
        const { error } = await client.from("covers").update(dbPatch).eq("id", id);
        if (error && (error.code === "PGRST204" || error.message?.includes("link_url"))) {
          delete dbPatch["link_url"];
          await client.from("covers").update(dbPatch).eq("id", id);
        }
      } catch (err) {
        console.warn("Notice mise à jour Supabase covers:", err);
      }
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
    const existing = metrics.find((m) => m.key === key);
    const updated = metrics.map((m) => (m.key === key ? { ...m, value, label } : m));
    setMetrics(updated);
    saveLocal(STORAGE_KEYS.METRICS, updated);

    // Upsert dans Supabase (robuste même si la ligne n'existe pas encore)
    const client = getSupabase();
    if (client) {
      await client.from("metrics").upsert(
        {
          key,
          value,
          label,
          icon_name: existing?.iconName || "Star",
          order_index: existing?.order_index ?? 0,
        },
        { onConflict: "key" }
      );
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
        link_url: c.link || "",
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

      // Seed audience channels (source de vérité cross-device)
      const audienceToInsert = initialAudienceChannels.map((ch, idx) => ({
        id: ch.id,
        name: ch.name,
        badge: ch.badge,
        period: ch.period,
        headline: ch.headline,
        subheadline: ch.subheadline,
        primary_stat: ch.primaryStat,
        highlight_badge: ch.highlightBadge || "",
        key_takeaway: ch.keyTakeaway,
        icon_name: ch.iconName,
        metrics: ch.metrics,
        order_index: ch.order_index ?? idx + 1,
        is_active: ch.is_active !== false,
      }));
      await client.from("audience").delete().neq("id", "");
      await client.from("audience").insert(audienceToInsert);

      await fetchData();
      return { success: true, message: "Les 26 couvertures, 9 partenaires, 4 métriques et 3 canaux d'audience ont été injectés dans Supabase avec succès !" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Erreur lors de l'injection : ${msg}` };
    }
  };

  // Record new lead
  const recordLead = async (leadData: Record<string, unknown>) => {
    const normalized = normalizeDbLead(leadData);
    const current = loadLocal<Record<string, unknown>[]>(STORAGE_KEYS.LEADS, []).map(normalizeDbLead);
    const updated = [normalized, ...current.filter((l) => l.id !== normalized.id)];
    setLeads(updated);
    saveLocal(STORAGE_KEYS.LEADS, updated);

    const client = getSupabase();
    if (client) {
      try {
        await client.from("leads").insert({
          first_name: normalized.first_name,
          last_name: normalized.last_name,
          company: normalized.company,
          position: normalized.position || "",
          email: normalized.email,
          phone: normalized.phone,
          country: normalized.country,
          sector: normalized.sector,
          objective: normalized.objective || "",
          selected_package: normalized.selected_package || "",
          message: normalized.message || "",
          source: normalized.source || "Landing Page IMPOSE 100% Digital",
          status: normalized.status || "NEW",
          created_at: normalized.created_at,
        });
      } catch (err) {
        console.warn("Could not insert lead to Supabase:", err);
      }
    }
  };

  // Delete lead
  const deleteLead = async (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    saveLocal(STORAGE_KEYS.LEADS, updated);

    const client = getSupabase();
    if (client) {
      try {
        await client.from("leads").delete().eq("id", id);
      } catch (err) {
        console.warn("Could not delete lead from Supabase:", err);
      }
    }
  };

  // CRUD Audience Channels
  const updateAudienceChannel = async (id: string, patch: Partial<AudienceChannel>) => {
    // 1. Sauvegarde locale et mémoire immédiate (instantanée)
    const existing = audience.find((a) => a.id === id);
    const merged = existing ? { ...existing, ...patch } : patch as AudienceChannel;
    const updated = audience.map((a) => (a.id === id ? merged : a));
    setAudience(updated);
    saveLocal(STORAGE_KEYS.AUDIENCE, updated);

    // 2. Synchronisation Supabase en arrière-plan via upsert (robuste même si la ligne n'existe pas)
    const client = getSupabase();
    if (client) {
      const upsertPayload: Record<string, unknown> = {
        id,
        name: merged.name,
        badge: merged.badge,
        period: merged.period,
        headline: merged.headline,
        subheadline: merged.subheadline,
        primary_stat: merged.primaryStat,
        highlight_badge: merged.highlightBadge,
        icon_name: merged.iconName,
        key_takeaway: merged.keyTakeaway,
        metrics: merged.metrics,
        is_active: merged.is_active,
        order_index: merged.order_index ?? 0,
      };
      Promise.resolve(
        client.from("audience").upsert(upsertPayload, { onConflict: "id" })
      ).catch((err) => {
        console.warn("Notice sync Supabase audience:", err);
      });
    }
  };

  const addAudienceChannel = async (channel: Omit<AudienceChannel, "id"> & { id?: string }) => {
    const newId = channel.id || `channel_${Date.now()}`;
    const newChannel: AudienceChannel = {
      ...channel,
      id: newId,
      is_active: channel.is_active !== false,
      metrics: channel.metrics || [],
    };
    const updated = [...audience, newChannel];
    setAudience(updated);
    saveLocal(STORAGE_KEYS.AUDIENCE, updated);

    const client = getSupabase();
    if (client) {
      Promise.resolve(
        client.from("audience").insert({
          id: newId,
          name: newChannel.name,
          badge: newChannel.badge,
          period: newChannel.period,
          headline: newChannel.headline,
          subheadline: newChannel.subheadline,
          primary_stat: newChannel.primaryStat,
          highlight_badge: newChannel.highlightBadge,
          icon_name: newChannel.iconName,
          key_takeaway: newChannel.keyTakeaway,
          metrics: newChannel.metrics,
          order_index: updated.length,
          is_active: true,
        })
      ).catch((err) => {
        console.warn("Notice insert Supabase audience:", err);
      });
    }
  };

  const deleteAudienceChannel = async (id: string) => {
    const updated = audience.filter((a) => a.id !== id);
    setAudience(updated);
    saveLocal(STORAGE_KEYS.AUDIENCE, updated);

    const client = getSupabase();
    if (client) {
      Promise.resolve(
        client.from("audience").delete().eq("id", id)
      ).catch(() => {});
    }
  };

  const resetAudienceToDefault = () => {
    setAudience(initialAudienceChannels);
    saveLocal(STORAGE_KEYS.AUDIENCE, initialAudienceChannels);
  };

  // CRUD Target Audiences ("Pour qui ?")
  const updateTargetAudience = (id: string, patch: Partial<TargetAudience>) => {
    const updated = targetAudiences.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setTargetAudiences(updated);
    saveLocal(STORAGE_KEYS.TARGET_AUDIENCES, updated);
  };

  const addTargetAudience = (target: Omit<TargetAudience, "id"> & { id?: string }) => {
    const newId = target.id || `cible_${Date.now()}`;
    const newTarget: TargetAudience = {
      ...target,
      id: newId,
      is_active: target.is_active !== false,
      order_index: targetAudiences.length + 1,
    };
    const updated = [...targetAudiences, newTarget];
    setTargetAudiences(updated);
    saveLocal(STORAGE_KEYS.TARGET_AUDIENCES, updated);
  };

  const deleteTargetAudience = (id: string) => {
    const updated = targetAudiences.filter((t) => t.id !== id);
    setTargetAudiences(updated);
    saveLocal(STORAGE_KEYS.TARGET_AUDIENCES, updated);
  };

  const resetTargetAudiencesToDefault = () => {
    setTargetAudiences(initialTargetAudiences);
    saveLocal(STORAGE_KEYS.TARGET_AUDIENCES, initialTargetAudiences);
  };

  return {
    covers,
    partners,
    metrics,
    audience,
    targetAudiences,
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
    updateAudienceChannel,
    addAudienceChannel,
    deleteAudienceChannel,
    resetAudienceToDefault,
    updateTargetAudience,
    addTargetAudience,
    deleteTargetAudience,
    resetTargetAudiencesToDefault,
    recordLead,
    deleteLead,
    seedToSupabase,
  };
}

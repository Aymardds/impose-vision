import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  BookOpen,
  Check,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
  Zap,
  ShieldCheck,
  AlertCircle,
  Database,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDynamicData } from "@/hooks/useDynamicData";
import {
  testSupabaseConnection,
  uploadMediaToSupabase,
  SUPABASE_URL,
  isSupabaseConfigured,
  type DbLead
} from "@/lib/supabase";
import { SCHEMA_SQL } from "@/lib/schemaSql";
import { type MagazineIssue, type PartnerItem } from "@/data/impose";
import logoImpose from "@/assets/landingImage/logoImpose.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Espace Administration | IMPOSE Magazine" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const DEFAULT_PIN = (import.meta.env["VITE_ADMIN_PIN"] as string | undefined) || "impose2026";

function AdminPage() {
  const [auth, setAuth] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("impose_admin_auth") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<"covers" | "partners" | "metrics" | "leads" | "supabase">("covers");

  const {
    covers,
    partners,
    metrics,
    leads,
    loading,
    isSupabaseActive,
    statusMessage,
    refresh,
    addCover,
    updateCover,
    deleteCover,
    addPartner,
    updatePartner,
    deletePartner,
    updateMetric,
    deleteLead,
    seedToSupabase,
  } = useDynamicData();

  // Cover modal state
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [editingCover, setEditingCover] = useState<MagazineIssue | null>(null);
  const [coverForm, setCoverForm] = useState({
    number: "",
    title: "",
    person: "",
    date: "",
    image: "",
    description: "",
    featured: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [coverSearch, setCoverSearch] = useState("");

  // Partner modal state
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    logo: "",
    className: "h-9 sm:h-11 w-auto max-w-[140px]",
    website: "",
  });

  // Supabase test state
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlPreview, setShowSqlPreview] = useState(false);

  const projectRef = SUPABASE_URL.replace(/^https?:\/\//, "").split(".")[0] || "";
  const sqlEditorUrl = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : "https://supabase.com/dashboard";

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SCHEMA_SQL);
      setCopiedSql(true);
      toast.success("Script SQL copié dans le presse-papier !");
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      toast.error("Veuillez sélectionner et copier le code SQL ci-dessous manuellement.");
      setShowSqlPreview(true);
    }
  };

  // Authentication check
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN.trim()) {
      sessionStorage.setItem("impose_admin_auth", "true");
      setAuth(true);
      setPinError(false);
      toast.success("Connexion réussie à l'administration IMPOSE");
    } else {
      setPinError(true);
      toast.error("Code administrateur incorrect");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("impose_admin_auth");
    setAuth(false);
    toast.info("Déconnexion effectuée");
  };

  // Open modal to add or edit cover
  const openCoverModal = (c?: MagazineIssue) => {
    if (c) {
      setEditingCover(c);
      setCoverForm({
        number: c.number,
        title: c.title,
        person: c.person,
        date: c.date,
        image: c.image,
        description: c.description || "",
        featured: c.featured ?? true,
      });
    } else {
      setEditingCover(null);
      setCoverForm({
        number: `N°${covers.length + 1}`,
        title: "",
        person: "",
        date: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
        image: "",
        description: "",
        featured: true,
      });
    }
    setCoverModalOpen(true);
  };

  const handleSaveCover = async (e: FormEvent) => {
    e.preventDefault();
    if (!coverForm.title || !coverForm.person || !coverForm.image) {
      toast.error("Veuillez remplir au moins le titre, la personnalité et l'image");
      return;
    }

    if (editingCover) {
      await updateCover(editingCover.id, coverForm);
      toast.success(`Couverture ${coverForm.number} mise à jour`);
    } else {
      await addCover(coverForm);
      toast.success(`Nouvelle couverture ${coverForm.number} créée`);
    }
    setCoverModalOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "cover" | "partner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // If Supabase is available, upload to storage bucket
      if (isSupabaseConfigured()) {
        const url = await uploadMediaToSupabase(file, target === "cover" ? "covers" : "partners");
        if (url) {
          if (target === "cover") setCoverForm((prev) => ({ ...prev, image: url }));
          else setPartnerForm((prev) => ({ ...prev, logo: url }));
          toast.success("Image téléversée sur Supabase Storage");
          setUploadingImage(false);
          return;
        }
      }

      // Fallback: convert file to local base64 DataURL
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === "cover") setCoverForm((prev) => ({ ...prev, image: result }));
        else setPartnerForm((prev) => ({ ...prev, logo: result }));
        toast.info("Image enregistrée localement (DataURL)");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast.error("Échec du téléversement de l'image");
      setUploadingImage(false);
    }
  };

  // Partner submit
  const handleSavePartner = async (e: FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.logo) {
      toast.error("Veuillez renseigner le nom et le logo du partenaire");
      return;
    }
    await addPartner(partnerForm);
    toast.success(`Partenaire ${partnerForm.name} ajouté`);
    setPartnerModalOpen(false);
    setPartnerForm({ name: "", logo: "", className: "h-9 sm:h-11 w-auto max-w-[140px]", website: "" });
  };

  // Export leads to CSV
  const exportLeadsCsv = () => {
    if (leads.length === 0) {
      toast.info("Aucun lead à exporter pour le moment");
      return;
    }
    const headers = ["Date", "Prénom", "Nom", "Entreprise", "Fonction", "Email", "Téléphone", "Pays", "Secteur", "Objectif", "Formule", "Message", "Source"];
    const rows = leads.map((l: DbLead) => [
      l.created_at || "",
      `"${l.first_name}"`,
      `"${l.last_name}"`,
      `"${l.company}"`,
      `"${l.position || ""}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.country}"`,
      `"${l.sector}"`,
      `"${l.objective || ""}"`,
      `"${l.selected_package || ""}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      `"${l.source || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_impose_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${leads.length} leads exportés au format CSV`);
  };

  // Run Supabase connection test
  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    const res = await testSupabaseConnection();
    setSupabaseTestResult(res);
    setTestingSupabase(false);
    if (res.ok) toast.success("Connexion Supabase confirmée !");
    else toast.error("Erreur de connexion Supabase");
  };

  // Run Seed to Supabase
  const handleSeed = async () => {
    if (!confirm("Voulez-vous synchroniser et injecter toutes les 16 couvertures, 9 partenaires et 4 métriques dans Supabase ?")) {
      return;
    }
    setSeeding(true);
    const res = await seedToSupabase();
    setSeeding(false);
    if (res.success) {
      toast.success(res.message);
      refresh();
    } else {
      toast.error(res.message);
    }
  };

  // If not authenticated, render Login PIN Gate
  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md border border-gold/30 bg-card p-8 sm:p-10 shadow-2xl rounded-sm">
          <div className="text-center">
            <img src={logoImpose} alt="IMPOSE Magazine" className="mx-auto h-9 w-auto brightness-0 dark:brightness-100 invert" />
            <div className="mt-4 flex items-center justify-center gap-2">
              <Lock className="size-4 text-gold" />
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Espace Administration</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestion dynamique des parutions, partenaires et métriques.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Code d'accès Administrateur
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Entrez votre code..."
                className={`w-full border bg-background px-4 py-3 text-sm outline-none transition-all rounded-sm focus:border-gold focus:ring-2 focus:ring-gold/20 ${pinError ? "border-destructive ring-1 ring-destructive" : "border-input"
                  }`}
                autoFocus
              />
            </div>

            <Button type="submit" variant="editorial" size="lg" className="w-full">
              Accéder au panneau <ShieldCheck className="ml-2 size-4" />
            </Button>
          </form>

          <div className="mt-6 border-t border-border/50 pt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
              ← Retour au site public
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredCovers = covers.filter(
    (c) =>
      c.title.toLowerCase().includes(coverSearch.toLowerCase()) ||
      c.person.toLowerCase().includes(coverSearch.toLowerCase()) ||
      c.number.toLowerCase().includes(coverSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImpose} alt="IMPOSE" className="h-7 w-auto brightness-0 dark:brightness-100 invert" />
            </Link>
            <span className="hidden sm:inline-block border-l border-foreground/15 pl-3 text-xs font-bold uppercase tracking-widest text-gold">
              Admin Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div
              className={`hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold border ${isSupabaseActive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                }`}
            >
              <span className={`size-2 rounded-full ${isSupabaseActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              {isSupabaseActive ? "Supabase Connecté" : "Mode Autonome"}
            </div>

            <Button asChild variant="editorialOutline" size="sm" className="hidden md:inline-flex">
              <Link to="/" target="_blank">
                <Eye className="size-3.5 mr-1" /> Voir le site
              </Link>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="size-4 mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-4">
          <Button
            variant={activeTab === "covers" ? "editorial" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("covers")}
            className="flex items-center gap-2"
          >
            <BookOpen className="size-4" />
            Couvertures ({covers.length})
          </Button>

          <Button
            variant={activeTab === "partners" ? "editorial" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("partners")}
            className="flex items-center gap-2"
          >
            <Users className="size-4" />
            Partenaires ({partners.length})
          </Button>

          <Button
            variant={activeTab === "metrics" ? "editorial" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("metrics")}
            className="flex items-center gap-2"
          >
            <TrendingUp className="size-4" />
            Métriques ({metrics.length})
          </Button>

          <Button
            variant={activeTab === "leads" ? "editorial" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("leads")}
            className="flex items-center gap-2"
          >
            <Layers className="size-4" />
            Leads Reçus ({leads.length})
          </Button>

          <Button
            variant={activeTab === "supabase" ? "editorial" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("supabase")}
            className="flex items-center gap-2"
          >
            <Database className="size-4" />
            Connexion Supabase
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => refresh()} disabled={loading} title="Actualiser les données">
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: COVERS
           ========================================================================= */}
        {activeTab === "covers" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-medium">Gestion des Couvertures</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Les couvertures marquées "Hero" alimentent le carrousel principal. Toutes s'affichent dans la galerie et le bandeau continu.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={coverSearch}
                    onChange={(e) => setCoverSearch(e.target.value)}
                    placeholder="Rechercher une cover..."
                    className="border border-input bg-card pl-9 pr-3 py-1.5 text-xs rounded-sm outline-none focus:border-gold w-48 sm:w-64"
                  />
                </div>

                <Button variant="editorial" size="sm" onClick={() => openCoverModal()}>
                  <Plus className="size-4 mr-1" /> Nouvelle Cover
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filteredCovers.map((c) => (
                <div
                  key={c.id}
                  className="group relative flex flex-col overflow-hidden rounded-sm border border-foreground/10 bg-card shadow-sm transition-all hover:border-gold/50 hover:shadow-lg"
                >
                  <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: "711 / 1084" }}>
                    <img src={c.image} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end gap-2">
                      <div className="flex items-center gap-1.5 justify-center">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-8 rounded-full shadow"
                          onClick={() => openCoverModal(c)}
                          title="Modifier"
                        >
                          <Save className="size-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="size-8 rounded-full shadow"
                          onClick={() => {
                            if (confirm(`Supprimer la couverture ${c.number} ?`)) {
                              deleteCover(c.id);
                              toast.info(`Couverture ${c.number} supprimée`);
                            }
                          }}
                          title="Supprimer"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Featured badge toggle */}
                    <button
                      type="button"
                      onClick={() => updateCover(c.id, { featured: !c.featured })}
                      className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-bold shadow-md backdrop-blur-md transition-all ${c.featured
                        ? "bg-gold text-black hover:bg-gold/80"
                        : "bg-black/60 text-white/60 hover:text-white"
                        }`}
                      title="Cliquer pour basculer la présence dans le Carrousel Hero"
                    >
                      {c.featured ? "★ Hero" : "Galerie"}
                    </button>
                  </div>

                  <div className="p-2.5 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-gold">{c.number}</span>
                      <p className="font-semibold text-foreground line-clamp-1 mt-0.5">{c.person}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">{c.title}</p>
                    </div>
                    <span className="mt-2 text-[9px] text-muted-foreground/60">{c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PARTNERS
           ========================================================================= */}
        {activeTab === "partners" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-medium">Gestion des Partenaires</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Logos diffusés dans le ruban défilant "Ils nous font confiance" placé après la section "Pour qui ?".
                </p>
              </div>

              <Button variant="editorial" size="sm" onClick={() => setPartnerModalOpen(true)}>
                <Plus className="size-4 mr-1" /> Ajouter un partenaire
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className={`relative flex flex-col items-center justify-between rounded-sm border p-5 transition-all ${p.is_active !== false ? "border-foreground/10 bg-card hover:border-gold/40" : "border-destructive/20 bg-card/40 opacity-50"
                    }`}
                >
                  <div className="h-16 w-full flex items-center justify-center p-2">
                    <img src={p.logo} alt={p.name} className="max-h-12 max-w-full object-contain" />
                  </div>

                  <p className="mt-3 font-semibold text-xs text-center">{p.name}</p>

                  <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3 w-full justify-between">
                    <button
                      type="button"
                      onClick={() => updatePartner(p.id ?? p.name, { is_active: !(p.is_active !== false) })}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${p.is_active !== false ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {p.is_active !== false ? "Actif" : "Masqué"}
                    </button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Supprimer le partenaire ${p.name} ?`)) {
                          deletePartner(p.id ?? p.name);
                          toast.info(`Partenaire ${p.name} supprimé`);
                        }
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: METRICS
           ========================================================================= */}
        {activeTab === "metrics" && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-medium">Métriques Clés (Section Hero)</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Modifiez les 4 compteurs et indicateurs de prestige visibles immédiatement par les visiteurs sur la landing page.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.key} className="rounded-sm border border-foreground/10 bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold font-mono">{m.key}</span>
                    <Sparkles className="size-4 text-gold/70" />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">Valeur affichée</label>
                      <input
                        type="text"
                        defaultValue={m.value}
                        onBlur={(e) => updateMetric(m.key, e.target.value, m.label)}
                        className="mt-1 w-full border border-input bg-background px-3 py-2 text-lg font-bold text-foreground rounded-sm outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">Libellé</label>
                      <input
                        type="text"
                        defaultValue={m.label}
                        onBlur={(e) => updateMetric(m.key, m.value, e.target.value)}
                        className="mt-1 w-full border border-input bg-background px-3 py-2 text-xs text-muted-foreground rounded-sm outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: LEADS
           ========================================================================= */}
        {activeTab === "leads" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-medium">Demandes et Leads Reçus</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Historique des contacts capturés via le formulaire. (Sauvegardés en local et/ou synchronisés avec Supabase & Google Sheets).
                </p>
              </div>

              <Button variant="editorial" size="sm" onClick={exportLeadsCsv} disabled={leads.length === 0}>
                <Download className="size-4 mr-1" /> Exporter en CSV ({leads.length})
              </Button>
            </div>

            {leads.length === 0 ? (
              <div className="border border-foreground/10 bg-card p-12 text-center rounded-sm">
                <Layers className="mx-auto size-10 text-muted-foreground/50" />
                <p className="mt-4 font-semibold text-sm">Aucun lead enregistré pour l'instant</p>
                <p className="mt-1 text-xs text-muted-foreground">Les demandes envoyées via le formulaire de contact apparaîtront ici.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-foreground/10 rounded-sm bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-foreground/10 bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Entreprise / Fonction</th>
                      <th className="p-3">Email & Téléphone</th>
                      <th className="p-3">Pays & Secteur</th>
                      <th className="p-3">Formule / Objectif</th>
                      <th className="p-3">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/10">
                    {leads.map((l, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 whitespace-nowrap text-muted-foreground">{l.created_at ? new Date(l.created_at).toLocaleDateString("fr-FR") : "-"}</td>
                        <td className="p-3 font-semibold whitespace-nowrap">{l.first_name} {l.last_name}</td>
                        <td className="p-3">
                          <p className="font-medium text-foreground">{l.company}</p>
                          <p className="text-[10px] text-muted-foreground">{l.position || "-"}</p>
                        </td>
                        <td className="p-3">
                          <a href={`mailto:${l.email}`} className="text-gold hover:underline block">{l.email}</a>
                          <a href={`tel:${l.phone}`} className="text-muted-foreground block text-[11px]">{l.phone}</a>
                        </td>
                        <td className="p-3">
                          <p>{l.country}</p>
                          <p className="text-[10px] text-muted-foreground">{l.sector}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-gold">{l.selected_package || "Personnalisé"}</span>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{l.objective}</p>
                        </td>
                        <td className="p-3 max-w-xs truncate text-muted-foreground" title={l.message}>
                          {l.message || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: SUPABASE CONFIGURATION & SETUP
           ========================================================================= */}
        {activeTab === "supabase" && (
          <div className="mt-8 space-y-8 max-w-4xl">
            <div>
              <h2 className="font-display text-2xl font-medium">Connexion & Paramétrage Supabase</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Gérez la synchronisation en temps réel de votre base de données et du stockage d'images IMPOSE Magazine.
              </p>
            </div>

            {/* Status Card */}
            <div className={`border p-6 rounded-sm ${isSupabaseActive ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`size-3 rounded-full ${isSupabaseActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                    <h3 className="font-semibold text-base">
                      {isSupabaseActive ? "Projet Supabase Opérationnel" : "Configuration Supabase Reconnue"}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{statusMessage}</p>
                  {SUPABASE_URL && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-muted font-mono text-[11px] text-gold border border-gold/20">
                        {SUPABASE_URL}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        (Clé Anon & Bucket Stockage Configurés)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button variant="editorialOutline" size="sm" onClick={handleTestSupabase} disabled={testingSupabase}>
                    <RefreshCw className={`size-3.5 mr-1.5 ${testingSupabase ? "animate-spin" : ""}`} />
                    {testingSupabase ? "Test en cours..." : "Tester la connexion"}
                  </Button>
                </div>
              </div>

              {supabaseTestResult && (
                <div className={`mt-4 rounded p-3 text-xs flex items-center gap-2 ${supabaseTestResult.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-destructive/20 text-destructive-foreground"}`}>
                  {supabaseTestResult.ok ? <Check className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
                  <span>{supabaseTestResult.message}</span>
                </div>
              )}
            </div>

            {/* Step 1: SQL Schema Execution */}
            <div className="border border-border bg-card p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-gold/20 text-[11px] font-bold text-gold">1</span>
                <h3 className="font-display text-lg font-medium text-foreground">
                  Créer les Tables & Politiques (Schéma SQL)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pour activer la sauvegarde dynamique des couvertures, des partenaires et des leads, exécutez le script SQL ci-dessous dans votre tableau de bord Supabase :
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button variant="editorial" size="sm" onClick={handleCopySql} className="flex items-center gap-2">
                  {copiedSql ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                  {copiedSql ? "Script SQL Copié !" : "Copier le Script SQL (schema.sql)"}
                </Button>

                <a
                  href={sqlEditorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-4 py-2 text-xs font-medium text-gold transition-colors hover:bg-gold/10"
                >
                  <ExternalLink className="size-3.5" />
                  Ouvrir le SQL Editor de Supabase
                </a>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSqlPreview(!showSqlPreview)}
                  className="text-xs text-muted-foreground"
                >
                  {showSqlPreview ? "Masquer le code SQL" : "Aperçu du script SQL"}
                </Button>
              </div>

              {showSqlPreview && (
                <div className="mt-3 rounded border border-border bg-black/70 p-4 font-mono text-[11px] text-muted-foreground max-h-72 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{SCHEMA_SQL}</pre>
                </div>
              )}
            </div>

            {/* Step 2: Seed Card */}
            <div className="border border-gold/40 bg-card p-6 rounded-sm shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-gold/20 text-[11px] font-bold text-gold">2</span>
                <h3 className="font-display text-lg font-medium flex items-center gap-2 text-foreground">
                  <Sparkles className="size-4 text-gold" /> Initialisation Rapide (Seed 1-Clic)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dès que vous avez cliqué sur <strong>Run</strong> dans l'éditeur SQL de Supabase, cliquez sur ce bouton pour peupler automatiquement votre base avec les <strong>26 couvertures officielles</strong>, <strong>9 partenaires</strong> et <strong>4 métriques</strong> existantes.
              </p>
              <div>
                <Button variant="editorial" size="lg" onClick={handleSeed} disabled={seeding} className="gap-2">
                  <Sparkles className={`size-4 ${seeding ? "animate-spin" : ""}`} />
                  {seeding ? "Injection en cours..." : "Injecter toutes les données initiales dans Supabase"}
                </Button>
              </div>
            </div>

            {/* Step 3: Overview & Guarantees */}
            <div className="border border-foreground/10 bg-card/60 p-6 rounded-sm space-y-3 text-xs leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-gold/20 text-[11px] font-bold text-gold">3</span>
                <h3 className="font-display text-base font-medium">Architecture Résiliente & Zéro Rupture</h3>
              </div>
              <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                <li><strong>Fallback automatique :</strong> Si la connexion Supabase est coupée ou en attente, le site vitrine charge instantanément les données statiques locales sans aucune interruption de service.</li>
                <li><strong>Stockage d'images Cloud :</strong> Le bucket Supabase Storage <code className="text-gold font-mono">impose-media</code> est activé avec URL publiques directes.</li>
                <li><strong>Sécurité RLS :</strong> Lecture publique sécurisée, protection par code PIN sur cet espace admin.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: ADD / EDIT COVER
         ========================================================================= */}
      {coverModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-sm border border-gold/40 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="font-display text-lg font-semibold">
                {editingCover ? `Modifier ${editingCover.number}` : "Ajouter une Couverture"}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setCoverModalOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveCover} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground">Numéro (ex: N°32)</label>
                  <input
                    type="text"
                    value={coverForm.number}
                    onChange={(e) => setCoverForm({ ...coverForm, number: e.target.value })}
                    className="mt-1 w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground">Date (ex: Octobre 2026)</label>
                  <input
                    type="text"
                    value={coverForm.date}
                    onChange={(e) => setCoverForm({ ...coverForm, date: e.target.value })}
                    className="mt-1 w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground">Personnalité / Invité d'honneur</label>
                <input
                  type="text"
                  value={coverForm.person}
                  onChange={(e) => setCoverForm({ ...coverForm, person: e.target.value })}
                  placeholder="Nom & Titre de la personnalité..."
                  className="mt-1 w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground">Titre de couverture</label>
                <input
                  type="text"
                  value={coverForm.title}
                  onChange={(e) => setCoverForm({ ...coverForm, title: e.target.value })}
                  placeholder="Grand titre / Thème du numéro..."
                  className="mt-1 w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground">Description / Résumé éditorial</label>
                <textarea
                  value={coverForm.description}
                  onChange={(e) => setCoverForm({ ...coverForm, description: e.target.value })}
                  placeholder="Détails, accroches clés..."
                  className="mt-1 w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold min-h-20"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground">Image de Couverture</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={coverForm.image}
                    onChange={(e) => setCoverForm({ ...coverForm, image: e.target.value })}
                    placeholder="URL de l'image (ou téléversez ci-contre)"
                    className="w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                    required
                  />
                  <label className="cursor-pointer border border-gold/60 bg-gold/10 px-3 py-2.5 rounded-sm hover:bg-gold/20 flex items-center justify-center shrink-0">
                    <Upload className="size-4 text-gold" />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} className="hidden" />
                  </label>
                </div>
                {uploadingImage && <p className="mt-1 text-[10px] text-gold animate-pulse">Téléversement de l'image en cours...</p>}
                {coverForm.image && (
                  <div className="mt-2 h-20 w-14 overflow-hidden rounded border border-border">
                    <img src={coverForm.image} alt="Prévisualisation" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={coverForm.featured}
                  onChange={(e) => setCoverForm({ ...coverForm, featured: e.target.checked })}
                  className="size-4 accent-[var(--gold)]"
                />
                <span className="font-medium">Mettre en vedette dans le Carrousel Hero (haut de page)</span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                <Button type="button" variant="ghost" size="sm" onClick={() => setCoverModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="editorial" size="sm">
                  {editingCover ? "Sauvegarder" : "Créer la cover"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD PARTNER
         ========================================================================= */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-sm border border-gold/40 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="font-display text-lg font-semibold">Ajouter un Partenaire</h3>
              <Button variant="ghost" size="icon" onClick={() => setPartnerModalOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSavePartner} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground">Nom du partenaire</label>
                <input
                  type="text"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  placeholder="Ex: #Ci20, Koolboks..."
                  className="mt-1 w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground">Logo du partenaire</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={partnerForm.logo}
                    onChange={(e) => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                    placeholder="URL du logo ou fichier..."
                    className="w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                    required
                  />
                  <label className="cursor-pointer border border-gold/60 bg-gold/10 px-3 py-2.5 rounded-sm hover:bg-gold/20 flex items-center justify-center shrink-0">
                    <Upload className="size-4 text-gold" />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "partner")} className="hidden" />
                  </label>
                </div>
                {uploadingImage && <p className="mt-1 text-[10px] text-gold animate-pulse">Téléversement du logo...</p>}
                {partnerForm.logo && (
                  <div className="mt-2 h-14 p-2 bg-muted/40 rounded border border-border flex items-center justify-center">
                    <img src={partnerForm.logo} alt="Prévisualisation" className="max-h-10 max-w-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-muted-foreground">Site Web (optionnel)</label>
                <input
                  type="url"
                  value={partnerForm.website}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  placeholder="https://partenaire.com"
                  className="mt-1 w-full border border-input bg-background p-2.5 rounded-sm outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                <Button type="button" variant="ghost" size="sm" onClick={() => setPartnerModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="editorial" size="sm">
                  Ajouter le partenaire
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

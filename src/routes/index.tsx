import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight,
  Facebook, Instagram, Linkedin, Mail, Menu, Phone, X, Star, Zap, TrendingUp, Globe,
  Eye, Clock, Award, Plus, CheckCircle2, FileText, SlidersHorizontal, ExternalLink,
  ShieldCheck, BarChart3, Users, Share2, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendLeadToGoogleSheets, type LeadData } from "@/lib/googleSheets";
import { sendLeadToMake } from "@/lib/makeWebhook";
import { getSupabase } from "@/lib/supabase";
import { useDynamicData } from "@/hooks/useDynamicData";
import {
  magazineIssues, objectives, packages, availablePrestations, sortCoversChronological,
  initialAudienceChannels, initialTargetAudiences,
  type MagazineIssue, type PackageOption, type ServicePrestation, type PartnerItem, type MetricItem,
  type AudienceChannel, type TargetAudience
} from "@/data/impose";
import logoImpose from "@/assets/landingImage/logoImpose.png";
import partner1 from "@/assets/landingImage/PartenaireImpose1.png";
import partner2 from "@/assets/landingImage/PartenaireImpose2.png";
import partner3 from "@/assets/landingImage/PartenaireImpose3.png";
import partner4 from "@/assets/landingImage/PartenaireImpose4.png";
import partner5 from "@/assets/landingImage/PartenaireImpose5.png";
import partnerMoro from "@/assets/landingImage/PartenaireImpose6.png";
import partnerKoolboks from "@/assets/landingImage/PartenaireImpose6.png.webp";
import partner7 from "@/assets/landingImage/PartenaireImpose7.png.webp";
import partner8 from "@/assets/landingImage/PartenaireImpose8.png";

const faqs = [
  {
    q: "Qu'est-ce qu'IMPOSE Magazine ?",
    a: "IMPOSE est le magazine panafricain 100% digital consacré aux leaders, entrepreneurs, innovateurs et bâtisseurs qui transforment l'Afrique. À travers des parutions interactives et un design éditorial haut de gamme, nous mettons en lumière les réussites qui façonnent l'avenir du continent.",
  },
  {
    q: "Comment proposer une personnalité ou être interviewé dans IMPOSE ?",
    a: "Chaque candidature ou proposition est examinée avec rigueur par notre comité éditorial. Renseignez simplement votre besoin via notre formulaire de devis. Notre équipe vous recontacte sous 24h ouvrées pour qualifier votre demande et cadrer le format éditorial le plus adapté.",
  },
  {
    q: "Quelles formules et prestations sont disponibles ?",
    a: "IMPOSE propose des formules complètes (Découverte, Croissance, Impact, Institutionnel, Couverture Signature) ainsi qu'un configurateur à la carte : articles d'autorité, interviews vidéo prestige, reportages exclusifs, couvertures dédiées et relais multicanal auprès de +50 000 décideurs.",
  },
  {
    q: "Sous quel délai reçois-je mon devis personnalisé ?",
    a: "Dès réception de vos prestations sélectionnées ou de votre projet, notre équipe prépare une proposition détaillée, chiffrée et sur-mesure, transmise sous 24 heures ouvrées de manière 100% gratuite et sans aucun engagement.",
  },
  {
    q: "Quelle est l'audience et la portée d'IMPOSE Magazine ?",
    a: "IMPOSE compte une communauté de plus de 50 000 lecteurs actifs (entrepreneurs, directeurs généraux, investisseurs, cadres dirigeants et institutions) répartis dans plus de 15 pays en Afrique (Côte d'Ivoire, Sénégal, Bénin, Cameroun, Gabon, Togo...) et à l'international.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsMediaOrganization",
      "@id": "https://impose-ci.com/#organization",
      "name": "IMPOSE Magazine",
      "alternateName": ["IMPOSE", "IMPOSE Média", "IMPOSE Vision"],
      "url": "https://impose-ci.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://impose-ci.com/logo.png",
        "width": 204,
        "height": 68
      },
      "image": "https://impose-ci.com/og-image.jpg",
      "slogan": "Imposez votre identité",
      "description": "IMPOSE est le magazine panafricain 100% digital dédié aux leaders, entrepreneurs, innovateurs et bâtisseurs qui façonnent l'Afrique.",
      "sameAs": [
        "https://www.linkedin.com/company/94140411/",
        "https://www.facebook.com/imposeofficiel"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@impose-ci.com",
        "telephone": "+2250757528302",
        "contactType": "editorial",
        "availableLanguage": ["French", "English"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://impose-ci.com/#website",
      "url": "https://impose-ci.com/",
      "name": "IMPOSE Magazine",
      "description": "Magazine Panafricain 100% Digital — Imposez votre identité",
      "publisher": {
        "@id": "https://impose-ci.com/#organization"
      },
      "inLanguage": "fr-FR"
    },
    {
      "@type": "Periodical",
      "@id": "https://impose-ci.com/#periodical",
      "name": "IMPOSE Magazine",
      "issuanceType": "Continuous",
      "publisher": {
        "@id": "https://impose-ci.com/#organization"
      },
      "inLanguage": "fr-FR"
    },
    {
      "@type": "FAQPage",
      "@id": "https://impose-ci.com/#faq",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a,
        },
      })),
    },
    {
      "@type": "Service",
      "@id": "https://impose-ci.com/#services",
      "name": "Prestations Éditoriales & Visibilité Panafricaine",
      "provider": {
        "@id": "https://impose-ci.com/#organization"
      },
      "serviceType": "Média Digital, Interviews Exécutives, Campagnes de Notoriété, Couverture Magazine",
      "areaServed": ["Côte d'Ivoire", "Sénégal", "Bénin", "Cameroun", "France", "Afrique"],
      "description": "Valorisation des leaders, parutions dans le magazine 100% digital IMPOSE et diffusion multicanale."
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://impose-ci.com/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://impose-ci.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Éditions",
          "item": "https://impose-ci.com/#editions"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Prestations & Devis",
          "item": "https://impose-ci.com/#offres"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "FAQ",
          "item": "https://impose-ci.com/#faq"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Demande de Devis",
          "item": "https://impose-ci.com/#contact"
        }
      ]
    }
  ]
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IMPOSE Magazine | Magazine Panafricain 100% Digital — Imposez votre identité" },
      { name: "description", content: "IMPOSE est le magazine panafricain 100% digital dédié aux leaders, entrepreneurs et innovateurs qui transforment l'Afrique. Éditions interactives, interviews exclusives et analyses d'impact. Imposez votre identité." },
      { name: "keywords", content: "IMPOSE Magazine, magazine panafricain, média digital afrique, entrepreneuriat africain, leaders afrique, magazine 100% digital, business afrique, innovation afrique, Côte d'Ivoire, startup afrique, Imposez votre identité" },
      { name: "author", content: "IMPOSE Magazine" },
      { name: "publisher", content: "IMPOSE Magazine" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },

      // Open Graph / Facebook / LinkedIn / WhatsApp
      { property: "og:site_name", content: "IMPOSE Magazine" },
      { property: "og:title", content: "IMPOSE Magazine | Média Panafricain 100% Digital — Imposez votre identité" },
      { property: "og:description", content: "Découvrez le magazine 100% digital qui révèle les leaders, entrepreneurs et bâtisseurs qui façonnent l'Afrique moderne. Imposez votre identité." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://impose-ci.com/" },
      { property: "og:image", content: "https://impose-ci.com/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://impose-ci.com/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1376" },
      { property: "og:image:height", content: "768" },
      { property: "og:image:alt", content: "IMPOSE Magazine — 100% Digital — Imposez votre identité" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:locale:alternate", content: "en_US" },

      // Twitter / X Cards
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@imposemagazine" },
      { name: "twitter:creator", content: "@imposemagazine" },
      { name: "twitter:title", content: "IMPOSE Magazine | Média Panafricain 100% Digital" },
      { name: "twitter:description", content: "Le magazine 100% digital qui révèle les leaders et entrepreneurs qui façonnent l'Afrique. Imposez votre identité." },
      { name: "twitter:image", content: "https://impose-ci.com/og-image.jpg" },
      { name: "twitter:image:alt", content: "IMPOSE Magazine — 100% Digital — Imposez votre identité" },
    ],
    links: [
      { rel: "canonical", href: "https://impose-ci.com/" },
      { rel: "alternate", hrefLang: "fr", href: "https://impose-ci.com/" },
      { rel: "alternate", hrefLang: "fr-CI", href: "https://impose-ci.com/" },
      { rel: "alternate", hrefLang: "fr-SN", href: "https://impose-ci.com/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://impose-ci.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  component: Index,
});

declare global { interface Window { dataLayer?: Array<Record<string, unknown>> } }

function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}

function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <img
      src={logoImpose}
      alt="IMPOSE Magazine — 100% Digital — Imposez votre identité"
      width="204"
      height="68"
      className={`h-8 md:h-9 w-auto object-contain transition-all duration-200 ${light ? "" : "brightness-0 opacity-90 hover:opacity-100 dark:brightness-100 dark:opacity-100"
        } ${className}`}
    />
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ["Le Magazine", "#magazine"], ["Nos éditions", "#editions"],
    ["Audience", "#audience"], ["Prestations", "#offres"],
    ["FAQ", "#faq"]
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-foreground/10 bg-background/95 backdrop-blur-xl shadow-sm" : "bg-transparent"}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#accueil" aria-label="Accueil IMPOSE" className="flex items-center gap-2.5">
          <Logo />
          <span className="hidden sm:inline-block border-l border-foreground/15 pl-2.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            100% Digital
          </span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-[11px] font-bold uppercase tracking-widest text-foreground/60 transition-colors hover:text-foreground">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="editorial" size="sm" className="hidden sm:inline-flex">
            <a href="#contact">Demander un devis</a>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-foreground/10 bg-background/98 px-5 py-5 backdrop-blur-xl lg:hidden">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-foreground/8 py-4 font-display text-2xl tracking-tight hover:text-ember transition-colors">{label}</a>
          ))}
          <div className="pt-5">
            <Button asChild variant="editorial" size="lg" className="w-full">
              <a href="#contact">Demander un devis</a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

function HeroCoverShowcase({
  onSelect,
  items,
}: {
  onSelect?: ((issue: MagazineIssue) => void) | undefined;
  items?: MagazineIssue[] | undefined;
}) {
  const currentIssues = (items && items.length > 0) ? items : magazineIssues;
  // Strict chronological sort from newest (N°31) to oldest (N°03)
  const sortedIssues = sortCoversChronological(currentIssues, "desc");
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = sortedIssues.length;
  const current = sortedIssues[active] || sortedIssues[0];
  if (!current) return null;

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((i: number) => {
    setActive(i);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  // Auto-play interval: 5.5 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full group select-none py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Main Cover Stage (Clean Flat & Imposing Big Size) */}
      <div className="relative w-full flex items-center justify-center py-2 sm:py-4">
        {/* Central Active Cover — Big Size & Imposing Prestige Finish */}
        <div
          onClick={() => {
            const url = current.link || "https://impose-ci.com/category/le-mensuel/";
            window.open(url, "_blank", "noopener,noreferrer");
          }}
          className="relative z-20 w-[84vw] max-w-[340px] xs:max-w-[380px] sm:max-w-[430px] md:max-w-[460px] lg:max-w-[490px] xl:max-w-[530px] rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:scale-[1.01] border border-black/10 dark:border-white/15"
          style={{ aspectRatio: "711 / 1084" }}
          aria-label={`Édition ${current.number}`}
        >
          {/* Current Cover Image */}
          <img
            key={current.id}
            src={current.image}
            alt={`Couverture IMPOSE ${current.number}`}
            className="w-full h-full object-cover transition-opacity duration-500"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={711}
            height={1084}
          />

          {/* Top Bar Badges */}
          <div className="absolute inset-x-0 top-3.5 sm:top-5 flex items-center justify-between px-4 sm:px-6 z-30">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xl backdrop-blur-md border ${active === 0
                ? "bg-ember text-white border-ember/50"
                : "bg-black/70 text-white border-white/20"
                }`}
            >
              <span className={`size-1.5 rounded-full ${active === 0 ? "bg-white" : "bg-gold"}`} />
              {active === 0 ? "Dernière parution" : "100% Digital"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md border border-gold/40 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-gold shadow-xl">
              {current.number}
            </span>
          </div>
        </div>

        {/* Floating Chevrons Controls */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-1 xs:left-2 sm:left-4 lg:-left-4 xl:-left-6 top-1/2 -translate-y-1/2 z-30 size-11 sm:size-12 rounded-full bg-black/75 hover:bg-black text-white hover:text-gold border border-white/20 hover:border-gold/60 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group/btn"
          aria-label="Édition précédente"
        >
          <ChevronLeft className="size-5 sm:size-6 transition-transform group-hover/btn:-translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-1 xs:right-2 sm:right-4 lg:-right-4 xl:-right-6 top-1/2 -translate-y-1/2 z-30 size-11 sm:size-12 rounded-full bg-black/75 hover:bg-black text-white hover:text-gold border border-white/20 hover:border-gold/60 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group/btn"
          aria-label="Édition suivante"
        >
          <ChevronRight className="size-5 sm:size-6 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* Action link to read online */}
      <div className="mt-4 flex items-center justify-center">
        <a
          href={current.link || "https://impose-ci.com/category/le-mensuel/"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5"
        >
          <ExternalLink className="size-3.5 text-gold" />
          <span>Lire l'article en ligne</span>
        </a>
      </div>
    </div>
  );
}

const stats = [
  { icon: Star, value: "+31", label: "Éditions publiées" },
  { icon: Globe, value: "+15", label: "Pays représentés" },
  { icon: TrendingUp, value: "+500", label: "Leaders mis en avant" },
  { icon: Zap, value: "100%", label: "Média 100% Digital" },
];

function Hero({
  onSelectCover,
  coverItems,
  metricItems,
}: {
  onSelectCover?: ((issue: MagazineIssue) => void) | undefined;
  coverItems?: MagazineIssue[] | undefined;
  metricItems?: MetricItem[] | undefined;
}) {
  const iconMap: Record<string, typeof Star> = {
    Star,
    Globe,
    TrendingUp,
    Zap,
  };
  const currentStats = (metricItems && metricItems.length > 0)
    ? metricItems.map(m => ({
      icon: iconMap[m.iconName] || Star,
      value: m.value,
      label: m.label,
    }))
    : stats;

  return (
    <section id="accueil" className="hero-sunrise relative overflow-hidden pt-4 pb-12 lg:pt-8 lg:pb-16">
      <div className="mx-auto grid min-h-[calc(94vh-4.5rem)] max-w-[1400px] items-center gap-10 px-5 sm:px-8 py-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:px-10 xl:gap-20">
        {/* Left: Copy */}
        <div className="order-2 lg:order-1">
          <div className="reveal-one flex items-center gap-3">

            <span className="text-[10px] font-bold uppercase tracking-widest text-ember">
              Magazine 100% Digital · Imposez votre identité
            </span>
          </div>
          <h1 className="reveal-two mt-6 max-w-2xl font-display text-5xl font-black leading-[.94] sm:text-6xl lg:text-[5.25rem] xl:text-[5.75rem]">
            Faites rayonner votre marque auprès de{" "}
            <em className="italic text-ember">+ 500 milles décideurs.</em>
          </h1>
          <p className="reveal-three mt-6 font-display text-2xl text-foreground font-semibold italic">

          </p>

          <div className="reveal-three mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="editorial" size="xl" onClick={() => track("hero_cta_click", { target: "packages" })}>
              <a href="#offres">Découvrir les prestations <ArrowDown /></a>
            </Button>
            <Button asChild variant="editorialOutline" size="xl" onClick={() => track("hero_cta_click", { target: "contact" })}>
              <a href="#contact">Demander un devis</a>
            </Button>
          </div>

          {/* Stats row */}
          <div className="reveal-three mt-12 grid grid-cols-2 gap-5 border-t border-foreground/10 pt-10 sm:grid-cols-4">
            {currentStats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="group">
                <div className="flex items-center gap-2 text-ember">
                  <Icon className="size-3.5" />
                </div>
                <p className="mt-1 font-display text-3xl font-extrabold text-foreground">{value}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Imposing Cover Showcase */}
        <div className="order-1 w-full lg:order-2 flex justify-center">
          <HeroCoverShowcase onSelect={onSelectCover} items={coverItems} />
        </div>
      </div>
    </section>
  );
}

function CoverMarqueeTicker({ onSelect, items }: { onSelect: (issue: MagazineIssue) => void; items?: MagazineIssue[] | undefined }) {
  const currentIssues = (items && items.length > 0) ? items : magazineIssues;
  const sorted = sortCoversChronological(currentIssues, "desc");
  const duplicated = [...sorted, ...sorted];
  return (
    <div className="w-full border-y border-foreground/10 bg-card/60 py-5 overflow-hidden backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-5 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-ember" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-ember">
            Collection intégrale en ordre chronologique ({sorted.length} parutions · {sorted[0]?.number} à {sorted[sorted.length - 1]?.number})
          </span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden sm:inline">
          Boucle continue · Survolez pour figer
        </span>
      </div>
      <div className="relative overflow-hidden">
        <div className="animate-marquee flex gap-4">
          {duplicated.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelect(item)}
              className="group relative w-28 sm:w-32 shrink-0 cursor-pointer overflow-hidden rounded-sm shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ aspectRatio: "711 / 1084" }}
            >
              <img
                src={item.image}
                alt={`Couverture IMPOSE ${item.number} — ${item.person} : ${item.title}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                width={128}
                height={195}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-2">
                <span className="text-[9px] font-extrabold text-gold">{item.number}</span>
                <span className="text-[9px] font-medium text-white line-clamp-1">{item.person}</span>
                <a
                  href={item.link || "https://impose-ci.com/category/le-mensuel/"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 inline-flex items-center gap-1 text-[8px] font-bold text-gold hover:text-white uppercase transition-colors"
                >
                  <ExternalLink className="size-2.5" /> Lire l'article
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const partners = [
  {
    name: "#Ci20",
    logo: partner1,
    className: "h-9 sm:h-11 w-auto max-w-[140px]",
  },
  {
    name: "Djoulatchê",
    logo: partner2,
    className: "h-10 sm:h-12 w-auto max-w-[140px] rounded-sm",
  },
  {
    name: "AKILI",
    logo: partner3,
    className: "h-10 sm:h-12 w-auto max-w-[140px]",
  },
  {
    name: "Yolicard",
    logo: partner4,
    className: "h-8 sm:h-10 w-auto max-w-[140px]",
  },
  {
    name: "Fondation BKD",
    logo: partner5,
    className: "h-9 sm:h-11 w-auto max-w-[140px]",
  },
  {
    name: "moro",
    logo: partnerMoro,
    className: "h-9 sm:h-11 w-auto max-w-[140px]",
  },
  {
    name: "KOOLBOKS",
    logo: partnerKoolboks,
    className: "h-7 sm:h-9 w-auto max-w-[140px]",
  },
  {
    name: "Venture Konect",
    logo: partner7,
    className: "h-9 sm:h-11 w-auto max-w-[160px]",
  },
  {
    name: "INEXIUMUS",
    logo: partner8,
    className: "h-8 sm:h-10 w-auto max-w-[160px]",
  },
];

function PartnersSection({ items }: { items?: PartnerItem[] | undefined }) {
  const activePartners = (items && items.length > 0) ? items.filter(p => p.is_active !== false) : partners;
  const duplicated = [...activePartners, ...activePartners, ...activePartners, ...activePartners];
  return (
    <section id="partenaires" className="border-y border-foreground/10 bg-card/40 py-8 overflow-hidden backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-5 text-center mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Ils nous font confiance
        </p>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16">
          {duplicated.map((p, idx) => (
            <div key={`${p.name}-${idx}`} className="shrink-0 flex items-center justify-center">
              <img
                src={p.logo}
                alt={`Partenaire officiel IMPOSE : ${p.name}`}
                className={`${p.className} object-contain opacity-75 hover:opacity-100 transition-opacity duration-300`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const benefits = [
  ["Leadership", "Des personnalités et dirigeants qui inspirent une génération."],
  ["Innovation", "Des solutions et modèles qui transforment les secteurs africains."],
  ["Impact", "Des initiatives qui créent durablement de la valeur en Afrique."],
  ["Visibilité", "Une plateforme pour renforcer la notoriété des acteurs mis en avant."],
];

function AboutSection() {
  return (
    <section id="magazine" className="relative overflow-hidden bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Le Magazine 100% Digital</p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Plus qu'un magazine.<br />
              <span className="text-gold">« Imposez votre identité »</span> à travers toute l'Afrique.
            </h2>
          </div>
          <p className="self-end text-base leading-8 text-primary-foreground/65">
            IMPOSE est un magazine panafricain 100% digital conçu pour une diffusion instantanée et sans frontières. Nous valorisons les parcours, les entreprises, les innovations et les initiatives à fort impact à travers des récits exigeants qui forgent la confiance, la notoriété et l'influence de celles et ceux qui font avancer le continent.
          </p>
        </div>
        <div className="mt-16 grid border-t border-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(([title, text], i) => (
            <article key={title} className="group border-b border-primary-foreground/15 py-8 sm:px-5 lg:border-r lg:last:border-r-0 hover:bg-primary-foreground/5 transition-colors duration-300">
              <span className="font-display text-3xl text-gold">0{i + 1}</span>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-widest">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/55">{text}</p>
              <div className="mt-4 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MagazineGallery({ onSelect, items }: { onSelect?: ((issue: MagazineIssue) => void) | undefined; items?: MagazineIssue[] | undefined }) {
  const currentIssues = (items && items.length > 0) ? items : magazineIssues;
  const sortedIssues = sortCoversChronological(currentIssues, "desc");
  const [active, setActive] = useState<MagazineIssue | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const move = useCallback((dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (dir > 0 && el.scrollLeft >= maxScroll - 20) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir < 0 && el.scrollLeft <= 20) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  }, []);

  // Automatic looping interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 25) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 280, behavior: "smooth" });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="editions" className="bg-background py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ember">Collection IMPOSE</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ember">
                <span className="size-1.5 rounded-full bg-ember" />
                {sortedIssues.length} Éditions (N°{sortedIssues[0]?.number.replace(/\D/g, '')} → N°{sortedIssues[sortedIssues.length - 1]?.number.replace(/\D/g, '')})
              </span>
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold">Nos éditions</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Découvrez les personnalités, entreprises et histoires qui ont marqué nos éditions, classées par ordre chronologique.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-[11px] font-medium text-muted-foreground/70">
              {isPaused ? "Défilement en pause (survol)" : "Défilement en boucle actif"}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => move(-1)} aria-label="Édition précédente" className="hover:border-ember hover:text-ember transition-colors">
                <ArrowLeft />
              </Button>
              <Button variant="outline" size="icon" onClick={() => move(1)} aria-label="Édition suivante" className="hover:border-ember hover:text-ember transition-colors">
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable horizontal gallery with continuous loop support */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-width:none]"
        >
          {sortedIssues.map((item) => (
            <article
              key={item.id}
              className="group w-[72vw] max-w-[260px] shrink-0 snap-start cursor-pointer"
              onClick={() => {
                setActive(item);
                onSelect?.(item);
                track("magazine_issue_view", { issue: item.number });
              }}
            >
              <div className="relative overflow-hidden rounded-sm shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl" style={{ aspectRatio: "711 / 1084" }}>
                <img
                  src={item.image}
                  alt={`Couverture IMPOSE ${item.number} : ${item.title}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                  width={260}
                  height={396}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 top-3 flex items-center justify-between px-3 z-20">
                  <span className={`rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${item.id === 31 ? "bg-gold text-gold-foreground font-extrabold shadow-sm" : "bg-ember"
                    }`}>
                    {item.id === 31 ? "Nouveau · " + item.number : item.number}
                  </span>
                  <a
                    href={item.link || "https://impose-ci.com/category/le-mensuel/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-sm bg-black/80 hover:bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold hover:text-white border border-gold/40 flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="size-2.5" /> En ligne
                  </a>
                </div>
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-display text-sm font-medium leading-snug text-white line-clamp-2">{item.title}</p>
                  <p className="mt-2 text-[10px] font-semibold text-gold uppercase tracking-wider">Cliquer pour agrandir →</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-ember">IMPOSE {item.number} · {item.date}</p>
                <h3 className="mt-1.5 font-display text-xl leading-snug line-clamp-2 hover:text-ember transition-colors">
                  <a
                    href={item.link || "https://impose-ci.com/category/le-mensuel/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline"
                  >
                    {item.title}
                  </a>
                </h3>
                {item.person !== "Édition spéciale" && (
                  <p className="mt-1 text-xs font-semibold text-muted-foreground line-clamp-1">{item.person}</p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href={item.link || "https://impose-ci.com/category/le-mensuel/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-ember hover:text-foreground transition-colors"
                  >
                    <span>Lire l'article</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(item);
                      onSelect?.(item);
                    }}
                    className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Aperçu
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -right-3 -top-3 z-10 shadow-lg rounded-full"
              onClick={() => setActive(null)}
              aria-label="Fermer"
            >
              <X />
            </Button>
            <div className="overflow-hidden rounded-sm shadow-2xl" style={{ aspectRatio: "711 / 1084" }}>
              <img
                src={active.image}
                alt={`Couverture IMPOSE ${active.number} — ${active.person} : ${active.title}`}
                className="h-full w-full object-cover"
                decoding="async"
                width={384}
                height={585}
              />
            </div>
            <div className="mt-4 text-center text-white">
              <span className="rounded-sm bg-ember px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                IMPOSE {active.number} · {active.date}
              </span>
              <p className="mt-2 font-display text-xl leading-snug">{active.title}</p>
              {active.person !== "Édition spéciale" && <p className="mt-1 text-sm text-white/75">{active.person}</p>}
              {active.description && <p className="mt-2 text-xs text-white/60 leading-relaxed">{active.description}</p>}
              <div className="mt-5">
                <Button asChild variant="gold" size="sm" className="w-full gap-2 shadow-gold">
                  <a href={active.link || "https://impose-ci.com/category/le-mensuel/"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" /> Lire l'article complet en ligne
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const valueCards = [
  ["Visibilité", "Présentez votre entreprise, votre marque ou votre parcours à une audience professionnelle qualifiée."],
  ["Crédibilité", "Associez votre image à un environnement éditorial premium reconnu à l'échelle panafricaine."],
  ["Personal branding", "Positionnez dirigeants, entrepreneurs et experts comme références incontournables de leur secteur."],
  ["Impact", "Faites connaître vos projets, innovations et initiatives aux décideurs qui comptent."],
];

function BenefitsSection() {
  return (
    <section id="apropos" className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ember">La valeur IMPOSE</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl sm:text-6xl font-bold">Votre histoire mérite d'être vue.</h2>
        <div className="mt-12 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map(([title, text], i) => (
            <article key={title} className="group bg-paper p-8 transition-colors hover:bg-card">
              <span className="font-display text-5xl font-medium text-gold">0{i + 1}</span>
              <h3 className="mt-14 text-xs font-bold uppercase tracking-widest">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{text}</p>
              <ArrowUpRight className="mt-8 text-ember transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesSection({
  onSelectPackage,
  onSelectPrestations,
  selectedPrestations = [],
}: {
  onSelectPackage: (pkg: PackageOption) => void;
  onSelectPrestations: (prestations: string[]) => void;
  selectedPrestations?: string[];
}) {
  const [activeTab, setActiveTab] = useState<"formulas" | "alacarte">("formulas");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedServices, setSelectedServices] = useState<string[]>(() => selectedPrestations);
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    if (selectedPrestations.length > 0) {
      setSelectedServices(selectedPrestations);
    }
  }, [selectedPrestations]);

  const toggleService = (name: string) => {
    const updated = selectedServices.includes(name)
      ? selectedServices.filter((s) => s !== name)
      : [...selectedServices, name];
    setSelectedServices(updated);
  };

  const categories = [
    { id: "all", label: `Toutes (${availablePrestations.length})` },
    { id: "editorial", label: "Rédaction & Journalisme" },
    { id: "visual", label: "Création Visuelle" },
    { id: "diffusion", label: "Diffusion & Notoriété" },
    { id: "strategy", label: "Stratégie & Partenariat" },
  ];

  const filteredPrestations = activeCategory === "all"
    ? availablePrestations
    : availablePrestations.filter((p) => p.category === activeCategory);

  const handleApplyPrestations = () => {
    if (selectedServices.length === 0) {
      toast.info("Veuillez cocher au moins une prestation pour votre devis.");
      return;
    }
    onSelectPrestations(selectedServices);
    track("custom_prestations_select", { count: selectedServices.length, items: selectedServices.join(", ") });
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <section id="offres" className="bg-background py-20 lg:py-28 border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ember">
            Prestations & Devis sur-mesure
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight">
            Composez votre visibilité dans IMPOSE
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            Sélectionnez une formule clé en main ou cochez librement vos prestations à la carte. Recevez sous 24h une proposition personnalisée et chiffrée selon vos ambitions.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full bg-card border border-foreground/15 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("formulas")}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === "formulas"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Formules recommandées
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("alacarte")}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${activeTab === "alacarte"
                ? "bg-gold text-gold-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <SlidersHorizontal className="size-3.5" />
              Prestations à la carte
              {selectedServices.length > 0 && (
                <span className="ml-1 rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-extrabold">
                  {selectedServices.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: FORMULES RECOMMANDEES (SANS PRIX FIXES) */}
        {activeTab === "formulas" && (
          <div className="mt-12">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`relative flex flex-col border p-6 transition-all duration-300 hover:-translate-y-1.5 rounded-sm ${pkg.featured
                    ? "border-gold bg-primary text-primary-foreground shadow-gold"
                    : "border-foreground/15 bg-card hover:border-gold/50 shadow-sm"
                    }`}
                >
                  {pkg.badge && (
                    <span className="absolute right-4 top-0 -translate-y-1/2 bg-gold px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-gold-foreground shadow-md">
                      {pkg.badge}
                    </span>
                  )}
                  <h3 className="text-xs font-bold uppercase tracking-widest">{pkg.name}</h3>

                  {/* Devis Indicator */}
                  <div className="mt-5 mb-1 flex flex-col gap-1">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/30">
                      <Award className="size-3" />
                      {pkg.id === "discovery" ? "À partir de 150 000 FCFA" : "Sur devis personnalisé"}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${pkg.featured ? "text-primary-foreground/75" : "text-muted-foreground"
                        }`}
                    >
                      {pkg.tagline}
                    </span>
                  </div>

                  <p
                    className={`mt-4 min-h-16 text-xs sm:text-sm leading-relaxed ${pkg.featured ? "text-primary-foreground/75" : "text-muted-foreground"
                      }`}
                  >
                    {pkg.description}
                  </p>

                  <div className="my-5 h-px bg-foreground/10" />

                  <ul className="flex-1 space-y-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex gap-2 text-xs leading-5">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-7 w-full shadow-sm"
                    variant={pkg.featured ? "gold" : "editorialOutline"}
                    onClick={() => onSelectPackage(pkg)}
                  >
                    Demander un devis
                  </Button>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="link" onClick={() => setCompare(!compare)}>
                Comparer le détail des formules{" "}
                <ChevronRight className={`transition-transform duration-300 ${compare ? "rotate-90" : ""}`} />
              </Button>
            </div>

            {compare && (
              <div className="mt-7 overflow-x-auto border border-foreground/15 bg-card rounded-sm shadow-sm">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="p-4 font-semibold">Formule</th>
                      <th className="p-4 font-semibold">Tarification</th>
                      <th className="p-4 font-semibold">Prestation clé</th>
                      <th className="p-4 font-semibold">Diffusion & Notoriété</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((p) => (
                      <tr key={p.id} className="border-t border-foreground/10 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-semibold text-foreground">
                          {p.name}
                          <br />
                          <span className="text-xs font-normal text-muted-foreground">{p.tagline}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-gold font-bold text-xs uppercase">
                            <CheckCircle2 className="size-3" /> Sur devis (24h)
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{p.features[0]}</td>
                        <td className="p-4 text-xs text-muted-foreground">{p.features[p.features.length - 2] || p.features[p.features.length - 1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONFIGURATEUR A LA CARTE */}
        {activeTab === "alacarte" && (
          <div className="mt-10">
            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${activeCategory === c.id
                    ? "bg-ember text-white shadow-sm"
                    : "bg-card border border-foreground/15 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Grid of Prestations */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrestations.map((p) => {
                const isSelected = selectedServices.includes(p.name);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleService(p.name)}
                    className={`relative p-5 rounded-sm border cursor-pointer transition-all duration-300 flex flex-col justify-between ${isSelected
                      ? "border-gold bg-gold/5 shadow-md ring-1 ring-gold/40"
                      : "border-foreground/15 bg-card hover:border-gold/40 hover:bg-muted/20"
                      }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {p.categoryLabel}
                        </span>
                        <div className="flex items-center gap-2">
                          {p.badge && (
                            <span className="rounded-full bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                              {p.badge}
                            </span>
                          )}
                          <div
                            className={`size-5 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-gold text-gold-foreground" : "border border-foreground/30"
                              }`}
                          >
                            {isSelected && <Check className="size-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>

                      <h4 className="font-display text-lg font-medium text-foreground leading-snug">
                        {p.name}
                      </h4>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {p.recommendedFor && (
                      <div className="mt-4 pt-3 border-t border-foreground/10 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">Idéal pour :</span>
                        <span className="font-semibold text-foreground/80">{p.recommendedFor}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Bar for Selected Prestations */}
            <div className="mt-8 border border-gold/40 bg-card/90 backdrop-blur-md p-5 rounded-sm shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  {selectedServices.length === 0
                    ? "Aucune prestation sélectionnée pour l'instant"
                    : `${selectedServices.length} prestation(s) sélectionnée(s) pour votre devis`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedServices.length === 0
                    ? "Cochez une ou plusieurs prestations ci-dessus pour composer votre demande de devis."
                    : selectedServices.join(" · ")}
                </p>
              </div>

              <Button
                variant="gold"
                size="lg"
                disabled={selectedServices.length === 0}
                onClick={handleApplyPrestations}
                className="shrink-0 w-full sm:w-auto"
              >
                Recevoir mon devis ({selectedServices.length}) →
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const audiences = [
  ["Entrepreneurs", "Développez votre visibilité et votre personal branding.", "Être interviewé"],
  ["PME", "Présentez vos produits, services et réussites.", "Mettre en avant mon entreprise"],
  ["Grandes entreprises", "Développez vos campagnes de communication et votre image.", "Campagne publicitaire"],
  ["Institutions", "Valorisez vos programmes, projets et initiatives.", "Communication institutionnelle"],
  ["ONG & fondations", "Mettez en lumière votre impact social et environnemental.", "Partenariat média"],
  ["Experts & dirigeants", "Construisez votre autorité et votre influence sectorielle.", "Valoriser mon parcours"],
];

function LinkedInPlatformLogo({ className = "size-7 sm:size-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-label="LinkedIn">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M7.12 18.5H4.2V9.17h2.92v9.33ZM5.66 7.89a1.69 1.69 0 1 1 0-3.38 1.69 1.69 0 0 1 0 3.38ZM19.8 18.5h-2.92v-4.57c0-1.09-.02-2.5-1.52-2.5-1.53 0-1.76 1.19-1.76 2.42v4.65h-2.92V9.17h2.8v1.27h.04c.39-.74 1.34-1.52 2.76-1.52 2.96 0 3.5 1.95 3.5 4.48v5.1Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function FacebookPlatformLogo({ className = "size-7 sm:size-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-label="Facebook">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M15.5 12.05h-2.35v8.72h-3.6v-8.72H7.72V9.01h1.83V6.83c0-2.42 1.48-3.74 3.64-3.74 1.03 0 2.12.18 2.12.18v2.33h-1.2c-1.2 0-1.57.74-1.57 1.51v1.9h2.63l-.42 3.04H15.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function WebPlatformLogo({ className = "size-7 sm:size-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-label="Site Web & Google Analytics">
      <rect width="24" height="24" rx="4" fill="#0F172A" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
      <rect x="5.5" y="13" width="3" height="6.5" rx="1.5" fill="#F59E0B" />
      <rect x="10.5" y="8" width="3" height="11.5" rx="1.5" fill="#D97706" />
      <rect x="15.5" y="4.5" width="3" height="15" rx="1.5" fill="#EF4444" />
    </svg>
  );
}

function renderChannelIcon(iconName?: string, channelId?: string, className?: string) {
  const cName = className || "size-6 sm:size-8";
  const id = (channelId || "").toLowerCase();
  const icon = (iconName || "").toLowerCase();

  if (id.includes("linkedin") || icon.includes("linkedin")) {
    return <LinkedInPlatformLogo className={cName} />;
  }
  if (id.includes("facebook") || icon.includes("facebook")) {
    return <FacebookPlatformLogo className={cName} />;
  }
  if (id.includes("web") || id.includes("site") || icon.includes("globe")) {
    return <WebPlatformLogo className={cName} />;
  }
  return <BarChart3 className={cName} />;
}

function getPlatformDisplayName(name: string) {
  if (name === "Site Web & Éditions Digitales") return "Site Web";
  if (name === "LinkedIn B2B Exécutif") return "LinkedIn";
  if (name === "Facebook & Formats Visuels") return "Facebook";
  return name;
}

function AudienceSection({
  items,
  targetItems,
}: {
  items?: AudienceChannel[] | undefined;
  targetItems?: TargetAudience[] | undefined;
}) {
  const activeChannels = (items && items.length > 0 ? items : initialAudienceChannels).filter(
    (c) => c.is_active !== false
  );
  const activeTargets = (targetItems && targetItems.length > 0 ? targetItems : initialTargetAudiences).filter(
    (t) => t.is_active !== false
  );

  return (
    <section id="audience" className="relative overflow-hidden bg-primary py-16 sm:py-20 text-primary-foreground lg:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-gold shadow-sm">
            <ShieldCheck className="size-3.5 text-gold" />
            Portée certifiée · Données réelles
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Une audience qualifiée sur 3 canaux.
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-primary-foreground/65 leading-relaxed">
            Indicateurs d'engagement mesurés et certifiés sur le Web, LinkedIn et Facebook.
          </p>
        </div>

        {/* 1-line, 3-column platform row */}
        <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-5 lg:gap-6">
          {activeChannels.slice(0, 3).map((channel) => (
            <div
              key={channel.id}
              className="group relative flex flex-col items-center justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-6 lg:p-7 text-center backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-gold/5"
            >
              {/* Platform Logo */}
              <div className="flex size-11 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 shadow-sm transition-transform duration-300 group-hover:scale-105">
                {renderChannelIcon(channel.iconName, channel.id, "size-6 sm:size-8")}
              </div>

              {/* Platform Name */}
              <p className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold/90 truncate max-w-full">
                {getPlatformDisplayName(channel.name)}
              </p>

              {/* Primary Stat */}
              <p className="mt-1 sm:mt-2 font-display text-lg sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {channel.primaryStat?.value}
              </p>

              {/* Stat Label */}
              <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-primary-foreground/65 font-medium line-clamp-1">
                {channel.primaryStat?.label}
              </p>

              {/* Highlight badge */}
              {channel.highlightBadge && (
                <div className="mt-2 sm:mt-3">
                  <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-2 sm:px-3 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gold">
                    {channel.highlightBadge}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button asChild variant="editorial" size="lg" className="shadow-lg font-bold w-full sm:w-auto">
            <a href="#contact">Demander un devis annonceur</a>
          </Button>
          <Button asChild variant="editorialOutline" size="lg" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
            <a href="#offres">Voir les prestations</a>
          </Button>
        </div>

        {/* Target personas: Pour qui ? */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold font-mono">Cibles & Acteurs</p>
          <h3 className="mt-3 max-w-4xl font-display text-3xl sm:text-5xl font-bold text-white">
            IMPOSE accompagne ceux qui font bouger les lignes.
          </h3>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-primary-foreground/70">
            Quels que soient votre taille et votre secteur, nos formats éditoriaux et notre portée sont conçus pour asseoir votre autorité.
          </p>
          <div className="mt-10 grid gap-px bg-white/15 md:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden border border-white/15">
            {activeTargets.map((target) => (
              <article key={target.id || target.title} className="group bg-primary p-7 sm:p-8 transition-colors hover:bg-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gold">{target.title}</h4>
                <p className="mt-4 max-w-xs font-display text-xl sm:text-2xl leading-snug text-white/95">{target.description}</p>
                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-primary-foreground/60 transition-colors hover:text-gold group-hover:gap-3 duration-300"
                >
                  {target.ctaText || "En savoir plus"} <ArrowRight className="size-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


const steps = [
  ["Échange", "Vous nous présentez votre entreprise, votre parcours ou votre projet en quelques minutes."],
  ["Sélection", "Notre équipe éditoriale identifie le format le plus adapté à vos objectifs. Chaque partenariat éditorial est clairement identifié comme contenu sponsoré conformément à nos standards de transparence."],
  ["Production", "Notre équipe prépare les contenus, éléments visuels et supports de diffusion."],
  ["Publication", "Votre histoire est publiée et relayée sur tous les canaux IMPOSE."],
];

function ProcessSection() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ember">Notre processus</p>
        <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold">De votre histoire à sa publication.</h2>
        <ol className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-6 before:absolute before:left-0 before:right-0 before:top-5 before:hidden before:h-px before:bg-gold lg:before:block">
          {steps.map(([title, text], i) => (
            <li key={title} className="relative">
              <span className="relative z-10 inline-grid size-10 place-items-center bg-gold font-display text-sm font-semibold text-gold-foreground shadow-md">0{i + 1}</span>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-widest">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-paper py-20 lg:py-28 border-t border-foreground/10">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ember">Questions fréquentes</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-bold">Tout savoir sur IMPOSE</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Retrouvez les réponses aux questions les plus courantes sur nos parutions, notre audience et le processus de parution.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="border border-foreground/15 bg-card rounded-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display text-lg sm:text-xl font-medium text-foreground hover:text-gold transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`size-5 text-gold shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : ""
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm sm:text-base leading-relaxed text-muted-foreground border-t border-foreground/10 pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type ContactFormProps = {
  selected: PackageOption | null;
  selectedPrestations: string[];
  onRemovePrestation: (name: string) => void;
  onClearPrestations: () => void;
  onClearPackage: () => void;
};

function ContactForm({
  selected,
  selectedPrestations,
  onRemovePrestation,
  onClearPrestations,
  onClearPackage,
}: ContactFormProps) {
  const [started, setStarted] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const company = String(form.get("company") || "").trim();
    const position = String(form.get("position") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const country = String(form.get("country") || "").trim();
    const sector = String(form.get("sector") || "").trim();
    const objective = String(form.get("objective") || "").trim();
    const formPackageChoice = String(form.get("selectedPackage") || "").trim();
    const message = String(form.get("message") || "").trim();
    const createdAt = new Date().toISOString();

    // Construction synthétique du besoin pour les outils de reporting (Supabase & Google Sheets)
    let finalPackageScope = formPackageChoice;
    if (selectedPrestations.length > 0) {
      finalPackageScope = `Prestations à la carte (${selectedPrestations.length}) : ${selectedPrestations.join(", ")}`;
      if (selected) {
        finalPackageScope = `Formule ${selected.name} + Prestations : ${selectedPrestations.join(", ")}`;
      }
    } else if (selected && !formPackageChoice.includes(selected.name)) {
      finalPackageScope = `Formule ${selected.name} (Sur devis)`;
    }

    const lead: LeadData = {
      firstName,
      lastName,
      company,
      position,
      email,
      phone,
      country,
      sector,
      objective,
      selectedPackage: finalPackageScope,
      message,
      source: "Landing Page IMPOSE 100% Digital",
      createdAt,
    };

    track("contact_form_submit", {
      package: lead.selectedPackage,
      hasPrestations: selectedPrestations.length > 0,
      prestationsCount: selectedPrestations.length,
    });

    try {
      // 1. Insertion directe dans Supabase (table public.leads)
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { error: supabaseError } = await supabase.from("leads").insert({
            first_name: firstName,
            last_name: lastName,
            company,
            position,
            email,
            phone,
            country,
            sector,
            objective,
            selected_package: finalPackageScope,
            message,
            source: "Landing Page IMPOSE 100% Digital",
            status: "NEW",
            created_at: createdAt,
          });
          if (supabaseError) {
            console.warn("Supabase lead insertion notice:", supabaseError.message);
          }
        } catch (dbErr) {
          console.warn("Supabase lead connection notice:", dbErr);
        }
      }

      // 2. Transmission principale vers le Webhook Make.com (connecté)
      const makeResult = await sendLeadToMake(lead, { selectedPrestations });

      // 3. Transmission complémentaire vers Google Sheets (si configuré)
      sendLeadToGoogleSheets(lead).catch((sheetErr) => {
        console.warn("Google Sheets submission notice:", sheetErr);
      });

      if (makeResult.success) {
        toast.success("Demande de devis transmise avec succès ! Notre équipe revient vers vous sous 24h.");
      } else {
        toast.success("Votre demande de devis a bien été enregistrée.");
      }
      setSent(true);
    } catch (err) {
      console.error("Erreur capture lead:", err);
      toast.success("Votre demande de devis a bien été enregistrée.");
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div className="border border-gold/40 bg-card p-10 sm:p-12 text-center rounded-sm shadow-xl">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-gold-foreground shadow-gold">
        <Check className="size-7" />
      </span>
      <h3 className="mt-6 font-display text-3xl sm:text-4xl font-bold text-foreground">Demande de devis reçue avec succès.</h3>
      <p className="mt-3 max-w-md mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
        Votre sélection a bien été enregistrée. L'équipe éditoriale et commerciale d'IMPOSE étudie votre projet et vous transmettra un devis chiffré et personnalisé sous 24h ouvrées.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="editorial" size="sm" onClick={() => setSent(false)}>
          Faire une autre demande de devis
        </Button>
        <Button asChild variant="editorialOutline" size="sm">
          <a href="#editions">Parcourir les éditions</a>
        </Button>
      </div>
    </div>
  );

  const field = "w-full border border-input bg-card px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20 rounded-sm disabled:opacity-60 disabled:cursor-not-allowed";

  const defaultPackageValue = selectedPrestations.length > 0
    ? `Prestations à la carte (${selectedPrestations.length} sélectionnée${selectedPrestations.length > 1 ? "s" : ""})`
    : selected
      ? `Formule ${selected.name} (Sur devis)`
      : "";

  return (
    <form
      onSubmit={submit}
      onFocus={() => { if (!started) { setStarted(true); track("contact_form_start"); } }}
      className="grid gap-4 md:grid-cols-2"
    >
      {/* Recapitulatif visuel si prestations à la carte sélectionnées */}
      {selectedPrestations.length > 0 && (
        <div className="md:col-span-2 rounded-sm border border-gold/50 bg-gold/5 p-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              Prestations choisies pour votre devis ({selectedPrestations.length})
            </span>
            <div className="flex items-center gap-3">
              <a
                href="#offres"
                className="text-[11px] font-semibold text-muted-foreground hover:text-gold transition-colors underline"
              >
                + Ajouter d'autres
              </a>
              <button
                type="button"
                onClick={onClearPrestations}
                className="text-[11px] font-semibold text-muted-foreground/75 hover:text-destructive transition-colors"
              >
                Effacer tout
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedPrestations.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full bg-card border border-gold/30 px-3 py-1 text-xs font-semibold text-foreground shadow-xs"
              >
                {p}
                <button
                  type="button"
                  onClick={() => onRemovePrestation(p)}
                  className="size-3.5 rounded-full inline-flex items-center justify-center text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors ml-0.5"
                  aria-label={`Supprimer ${p}`}
                  title="Retirer"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recapitulatif si formule choisie sans prestations carte */}
      {selected && selectedPrestations.length === 0 && (
        <div className="md:col-span-2 rounded-sm border border-gold/40 bg-card p-4 shadow-sm flex items-center justify-between gap-4 animate-in fade-in duration-300">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Formule choisie (Sur devis personnalisé)
            </span>
            <p className="mt-0.5 font-display text-lg text-foreground font-semibold">
              Formule {selected.name}
            </p>
            <p className="text-xs text-muted-foreground">{selected.tagline}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="#offres" className="text-xs text-muted-foreground hover:text-gold transition-colors underline">
              Changer
            </a>
            <button
              type="button"
              onClick={onClearPackage}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Retirer
            </button>
          </div>
        </div>
      )}

      <input className={field} name="firstName" placeholder="Prénom *" required disabled={loading} autoComplete="given-name" aria-label="Prénom" />
      <input className={field} name="lastName" placeholder="Nom *" required disabled={loading} autoComplete="family-name" aria-label="Nom" />
      <input className={field} name="company" placeholder="Entreprise / Organisation *" required disabled={loading} autoComplete="organization" aria-label="Entreprise ou Organisation" />
      <input className={field} name="position" placeholder="Fonction" disabled={loading} autoComplete="organization-title" aria-label="Fonction" />
      <input className={field} name="email" type="email" placeholder="Email professionnel *" required disabled={loading} autoComplete="email" aria-label="Email professionnel" />
      <input className={field} name="phone" type="tel" placeholder="Téléphone / WhatsApp *" required disabled={loading} autoComplete="tel" aria-label="Téléphone ou WhatsApp" />
      <input className={field} name="country" placeholder="Pays (ex: Côte d'Ivoire, Sénégal, France...) *" required disabled={loading} autoComplete="country-name" aria-label="Pays" />
      <input className={field} name="sector" placeholder="Secteur d'activité *" required disabled={loading} aria-label="Secteur d'activité" />

      <select className={field} name="objective" defaultValue="" required disabled={loading}>
        <option value="" disabled>Votre objectif prioritaire *</option>
        {objectives.map(o => <option key={o} value={o}>{o}</option>)}
      </select>

      <select
        key={`${selected?.id ?? "none"}-${selectedPrestations.length}`}
        className={field}
        name="selectedPackage"
        defaultValue={defaultPackageValue}
        disabled={loading}
      >
        <option value="">Formule ou prestations souhaitées</option>
        {selectedPrestations.length > 0 && (
          <option value={`Prestations à la carte (${selectedPrestations.length} sélectionnée${selectedPrestations.length > 1 ? "s" : ""})`}>
            ✓ Prestations à la carte ({selectedPrestations.length} choisie{selectedPrestations.length > 1 ? "s" : ""})
          </option>
        )}
        <option value="Prestations à la carte (Sur mesure)">Prestations à la carte (Sur-mesure)</option>
        {packages.map(p => (
          <option key={p.id} value={`Formule ${p.name} (Sur devis)`}>
            Formule {p.name} (Sur devis)
          </option>
        ))}
        <option value="Conseil éditorial & Stratégie d'influence">Conseil éditorial & Stratégie d'influence</option>
        <option value="Partenariat institutionnel ou grand compte">Partenariat institutionnel ou grand compte</option>
      </select>

      <textarea
        className={`${field} min-h-32 resize-y md:col-span-2`}
        name="message"
        placeholder="Décrivez brièvement vos attentes ou le contexte de votre projet (timing souhaité, message clé, audience cible...)…"
        required
        disabled={loading}
      />

      <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground md:col-span-2">
        <input type="checkbox" required className="mt-0.5 size-4 accent-[var(--gold)]" disabled={loading} />
        J'accepte d'être recontacté par l'équipe IMPOSE pour recevoir ma proposition et mon devis personnalisé.
      </label>

      {error && (
        <div className="md:col-span-2 rounded bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <Button type="submit" variant="editorial" size="xl" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent inline-block mr-2" />
              Génération du devis en cours...
            </>
          ) : (
            <>
              Recevoir mon devis gratuit sous 24h <ArrowRight />
            </>
          )}
        </Button>

        <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground/80 font-medium">
            <Check className="size-3.5 text-gold shrink-0" /> Devis gratuit & sans aucun engagement
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-gold shrink-0" /> Réponse personnalisée sous 24h ouvrées
          </span>
        </div>
      </div>
    </form>
  );
}

function ContactSection({
  selected,
  selectedPrestations,
  onRemovePrestation,
  onClearPrestations,
  onClearPackage,
}: ContactFormProps) {
  return (
    <section id="contact" className="hero-sunrise py-20 lg:py-28 border-t border-foreground/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ember">Demande de devis</p>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl font-bold">Recevez votre devis personnalisé.</h2>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Sélectionnez vos prestations ou indiquez votre besoin. Notre équipe éditoriale et commerciale étudie votre dossier et vous transmet une offre chiffrée sous 24 heures.
          </p>

          <div className="mt-8 space-y-3 rounded-sm border border-foreground/10 bg-card/60 p-4 text-xs text-muted-foreground backdrop-blur-sm">
            <p className="font-bold uppercase tracking-wide text-foreground text-[10px]">Notre engagement</p>
            <div className="flex items-start gap-2">
              <Check className="size-4 text-gold shrink-0 mt-0.5" />
              <span>Devis 100% sur-mesure adapté à votre secteur et vos objectifs</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="size-4 text-gold shrink-0 mt-0.5" />
              <span>Accompagnement par des journalistes et directeurs artistiques expérimentés</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="size-4 text-gold shrink-0 mt-0.5" />
              <span>Diffusion ciblée auprès de +50 000 décideurs et leaders panafricains</span>
            </div>
          </div>

          <div className="mt-8 editorial-rule pt-6 space-y-3 text-sm">
            <a href="tel:+2250757528302" className="flex items-center gap-3 py-2 hover:text-ember transition-colors" onClick={() => track("phone_click")}>
              <Phone className="size-4 text-ember" />+225 07 57 52 83 02
            </a>
            <a href="mailto:contact@impose-ci.com" className="flex items-center gap-3 py-2 hover:text-ember transition-colors" onClick={() => track("email_click")}>
              <Mail className="size-4 text-ember" />contact@impose-ci.com
            </a>
          </div>

          {/* Mini cover strip */}
          <div className="mt-8 hidden lg:flex gap-3 overflow-hidden">
            {magazineIssues.slice(0, 4).map(item => (
              <div key={item.id} className="w-16 shrink-0 overflow-hidden rounded-sm shadow-md opacity-75 hover:opacity-100 transition-opacity" style={{ aspectRatio: "711 / 1084" }}>
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <ContactForm
          selected={selected}
          selectedPrestations={selectedPrestations}
          onRemovePrestation={onRemovePrestation}
          onClearPrestations={onClearPrestations}
          onClearPackage={onClearPackage}
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-primary pb-24 pt-16 text-primary-foreground lg:pb-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 border-b border-primary-foreground/15 pb-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gold">
              « Imposez votre identité »
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-primary-foreground/55">
              IMPOSE — Le magazine 100% digital des leaders et des transformations africaines.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">Magazine</p>
            <div className="mt-5 space-y-3 text-sm text-primary-foreground/60">
              <a className="block hover:text-primary-foreground transition-colors" href="#editions">Nos éditions</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#partenaires">Partenaires</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#apropos">À propos</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#faq">FAQ</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">Professionnels</p>
            <div className="mt-5 space-y-3 text-sm text-primary-foreground/60">
              <a className="block hover:text-primary-foreground transition-colors" href="#offres">Prestations & Devis</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#contact">Demander un devis</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#contact">Publicité & Sponsoring</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#contact">Partenariat média</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">Contact</p>
            <div className="mt-5 flex gap-4">
              <a href="https://www.linkedin.com/company/94140411/" target="_blank" rel="noreferrer" onClick={() => track("linkedin_click")} aria-label="LinkedIn" className="text-primary-foreground/60 hover:text-gold transition-colors"><Linkedin /></a>
              <a href="https://www.facebook.com/imposeofficiel" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-primary-foreground/60 hover:text-gold transition-colors"><Facebook /></a>
              <a href="#" aria-label="Instagram" className="text-primary-foreground/60 hover:text-gold transition-colors"><Instagram /></a>
              <a href="mailto:contact@impose-ci.com" onClick={() => track("email_click")} aria-label="Email" className="text-primary-foreground/60 hover:text-gold transition-colors"><Mail /></a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-primary-foreground/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 IMPOSE Magazine. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-5 items-center">
            <a href="/mentions-legales" className="hover:text-primary-foreground/70 transition-colors">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-primary-foreground/70 transition-colors">Politique de confidentialité</a>
            <a href="/cgv" className="hover:text-primary-foreground/70 transition-colors">Conditions générales</a>
            <a href="/admin" className="text-primary-foreground/35 hover:text-gold transition-colors inline-flex items-center gap-1.5 ml-auto text-xs">
              <Lock className="size-3" /> Espace Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  const { covers, partners, metrics, audience, targetAudiences } = useDynamicData();
  const sortedCovers = sortCoversChronological(covers, "desc");
  const [selected, setSelected] = useState<PackageOption | null>(null);
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>([]);
  const [modalCover, setModalCover] = useState<MagazineIssue | null>(null);

  const choosePackage = (pkg: PackageOption) => {
    setSelected(pkg);
    track("package_select", { package: pkg.name });
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const choosePrestations = (prestations: string[]) => {
    setSelectedPrestations(prestations);
    track("prestations_select", { count: prestations.length, list: prestations.join(", ") });
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleTogglePrestation = (name: string) => {
    setSelectedPrestations((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  return (
    <>
      <Header />
      <main>
        <Hero onSelectCover={setModalCover} coverItems={sortedCovers} metricItems={metrics} />
        <CoverMarqueeTicker onSelect={setModalCover} items={sortedCovers} />
        <AboutSection />
        <MagazineGallery onSelect={setModalCover} items={sortedCovers} />
        <BenefitsSection />
        <AudienceSection items={audience} targetItems={targetAudiences} />
        <PackagesSection
          onSelectPackage={choosePackage}
          onSelectPrestations={choosePrestations}
          selectedPrestations={selectedPrestations}
        />
        <PartnersSection items={partners} />
        <ProcessSection />
        <FaqSection />
        <ContactSection
          selected={selected}
          selectedPrestations={selectedPrestations}
          onRemovePrestation={handleTogglePrestation}
          onClearPrestations={() => setSelectedPrestations([])}
          onClearPackage={() => setSelected(null)}
        />
      </main>
      <Footer />
      {modalCover && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalCover(null)}
        >
          <div className="relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -right-3 -top-3 z-10 shadow-lg rounded-full"
              onClick={() => setModalCover(null)}
              aria-label="Fermer"
            >
              <X />
            </Button>
            <div className="overflow-hidden rounded-sm shadow-2xl" style={{ aspectRatio: "711 / 1084" }}>
              <img
                src={modalCover.image}
                alt={`Couverture IMPOSE ${modalCover.number} — ${modalCover.person} : ${modalCover.title}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <span className="rounded-sm bg-ember px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                IMPOSE {modalCover.number} · {modalCover.date}
              </span>
              <p className="mt-2 font-display text-xl leading-snug">{modalCover.title}</p>
              {modalCover.person !== "Édition spéciale" && <p className="mt-1 text-sm text-white/75">{modalCover.person}</p>}
              {modalCover.description && <p className="mt-2 text-xs text-white/60 leading-relaxed max-w-md mx-auto">{modalCover.description}</p>}
              <div className="mt-5">
                <Button asChild variant="gold" size="sm" className="w-full gap-2 shadow-gold">
                  <a href={modalCover.link || "https://impose-ci.com/category/le-mensuel/"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" /> Lire l'article complet en ligne
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Button
        asChild
        variant="gold"
        className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-6 shadow-gold lg:left-auto lg:right-6 lg:translate-x-0"
      >
        <a href="#contact">Parler à IMPOSE</a>
      </Button>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight,
  Facebook, Instagram, Linkedin, Mail, Menu, Phone, X, Star, Zap, TrendingUp, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendLeadToGoogleSheets, type LeadData } from "@/lib/googleSheets";
import { useDynamicData } from "@/hooks/useDynamicData";
import { magazineIssues, objectives, packages, type MagazineIssue, type PackageOption, type PartnerItem, type MetricItem } from "@/data/impose";
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
    ["Accueil", "#accueil"], ["Le Magazine", "#magazine"], ["Nos éditions", "#editions"],
    ["Partenaires", "#partenaires"], ["Nos offres", "#offres"], ["À propos", "#apropos"], ["Contact", "#contact"]
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
            <a href="#contact">Présenter mon projet</a>
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
              <a href="#contact">Présenter mon projet</a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

function HeroCoverCarousel({ onSelect, items }: { onSelect?: ((issue: MagazineIssue) => void) | undefined; items?: MagazineIssue[] | undefined }) {
  const currentIssues = (items && items.length > 0) ? items : magazineIssues;
  const featuredList = currentIssues.filter(c => c.featured);
  const featured = featuredList.length > 0 ? featuredList : currentIssues.slice(0, 6);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActive(prev => (prev + 1) % featured.length);
  }, [featured.length]);

  const prev = useCallback(() => {
    setActive(prev => (prev - 1 + featured.length) % featured.length);
  }, [featured.length]);

  const goTo = useCallback((i: number) => {
    setActive(i);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, featured.length]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-sm shadow-2xl transition-all duration-500 cursor-pointer"
        style={{ aspectRatio: "711 / 1084" }}
        onClick={() => {
          const item = featured[active];
          if (item && onSelect) onSelect(item);
        }}
      >
        {featured.map((item, i) => (
          <div
            key={item.id}
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              opacity: i === active ? 1 : 0,
              transform: i === active ? "scale(1)" : "scale(1.05)",
              zIndex: i === active ? 1 : 0,
              pointerEvents: i === active ? "auto" : "none",
            }}
          >
            <img
              src={item.image}
              alt={`Couverture IMPOSE ${item.number} : ${item.title}`}
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* Top badges */}
            <div className="absolute inset-x-0 top-3 flex items-center justify-between px-3.5 z-10">
              <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${item.id === 31 ? "bg-ember text-white" : "bg-black/60 text-white"
                }`}>
                {item.id === 31 ? "Dernière parution" : "100% Digital"}
              </span>
              <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold text-white">
                {item.number}
              </span>
            </div>

            {/* Bottom info */}
            <div className="absolute inset-x-0 bottom-0 p-5 z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                IMPOSE {item.number} · {item.date}
              </span>
              <p className="mt-1 font-display text-xl leading-tight text-white line-clamp-2">
                {item.title}
              </p>
              {item.person !== "Édition spéciale" && (
                <p className="mt-1 text-xs text-white/80 line-clamp-1">{item.person}</p>
              )}
            </div>
          </div>
        ))}

        {/* Carousel controls - hover reveal */}
        <div className="absolute inset-y-0 left-2 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="rounded-full bg-black/60 hover:bg-black/90 text-white p-2 backdrop-blur-md transition-all hover:scale-110 shadow-lg"
            aria-label="Couverture précédente"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="rounded-full bg-black/60 hover:bg-black/90 text-white p-2 backdrop-blur-md transition-all hover:scale-110 shadow-lg"
            aria-label="Couverture suivante"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Navigation Indicators & Loop Status */}
      <div className="mt-4 flex items-center justify-between px-1">
        <div className="flex gap-2 items-center">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${i === active ? "bg-ember w-7 h-1.5" : "bg-foreground/20 hover:bg-foreground/40 w-1.5 h-1.5"
                }`}
              aria-label={`Édition ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
          {isPaused ? "En pause" : "Boucle continue"} · {active + 1}/{featured.length}
        </span>
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

function Hero({ onSelectCover, coverItems, metricItems }: { onSelectCover?: ((issue: MagazineIssue) => void) | undefined; coverItems?: MagazineIssue[] | undefined; metricItems?: MetricItem[] | undefined }) {
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
    <section id="accueil" className="hero-sunrise relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-ember/8 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(92vh-4.5rem)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:px-8 lg:py-20">
        {/* Left: Copy */}
        <div className="order-2 lg:order-1">
          <div className="reveal-one flex items-center gap-3">
            <span className="h-px w-9 bg-ember" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ember">
              Magazine 100% Digital · Imposez votre identité
            </span>
          </div>
          <h1 className="reveal-two mt-6 max-w-4xl font-display text-5xl font-medium leading-[.94] sm:text-6xl lg:text-[5.5rem]">
            Les histoires qui façonnent{" "}
            <em className="italic text-ember">l'Afrique.</em>
          </h1>
          <p className="reveal-three mt-6 font-display text-2xl text-foreground font-semibold italic">
            « Imposez votre identité »
          </p>
          <p className="reveal-three mt-3 max-w-xl text-base leading-7 text-muted-foreground lg:text-lg">
            IMPOSE est le magazine 100% digital qui met en lumière les entrepreneurs, dirigeants, innovateurs et institutions qui transforment l'Afrique et construisent les succès de demain.
          </p>
          <div className="reveal-three mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="editorial" size="xl" onClick={() => track("hero_cta_click", { target: "packages" })}>
              <a href="#offres">Découvrir nos offres <ArrowDown /></a>
            </Button>
            <Button asChild variant="editorialOutline" size="xl" onClick={() => track("hero_cta_click", { target: "contact" })}>
              <a href="#contact">Être publié dans IMPOSE</a>
            </Button>
          </div>

          {/* Stats row */}
          <div className="reveal-three mt-12 grid grid-cols-2 gap-5 border-t border-foreground/10 pt-10 sm:grid-cols-4">
            {currentStats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="group">
                <div className="flex items-center gap-2 text-ember">
                  <Icon className="size-3.5" />
                </div>
                <p className="mt-1 font-display text-3xl font-medium text-foreground">{value}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Carousel */}
        <div className="order-1 mx-auto w-[70vw] max-w-[340px] lg:order-2 lg:w-full">
          <HeroCoverCarousel onSelect={onSelectCover} items={coverItems} />
        </div>
      </div>
    </section>
  );
}

function CoverMarqueeTicker({ onSelect, items }: { onSelect: (issue: MagazineIssue) => void; items?: MagazineIssue[] | undefined }) {
  const currentIssues = (items && items.length > 0) ? items : magazineIssues;
  const duplicated = [...currentIssues, ...currentIssues];
  return (
    <div className="w-full border-y border-foreground/10 bg-card/60 py-5 overflow-hidden backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-5 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-ember"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-ember">
            Collection intégrale des couvertures IMPOSE ({currentIssues.length} parutions)
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
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-2">
                <span className="text-[9px] font-extrabold text-gold">{item.number}</span>
                <span className="text-[9px] font-medium text-white line-clamp-1">{item.person}</span>
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
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Le Magazine 100% Digital</p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
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
                <span className="size-1.5 rounded-full bg-ember animate-pulse" />
                {magazineIssues.length} Éditions
              </span>
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl">Nos éditions</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Découvrez les personnalités, entreprises et histoires qui ont marqué nos précédentes éditions.
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
          {currentIssues.map((item) => (
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 top-3 flex items-center justify-between px-3">
                  <span className={`rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${item.id === 31 ? "bg-gold text-gold-foreground font-extrabold shadow-sm" : "bg-ember"
                    }`}>
                    {item.id === 31 ? "Nouveau · " + item.number : item.number}
                  </span>
                  {item.featured && item.id !== 31 && (
                    <span className="rounded-sm bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                      En vedette
                    </span>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-display text-sm font-medium leading-snug text-white line-clamp-2">{item.title}</p>
                  <p className="mt-2 text-[10px] font-semibold text-gold uppercase tracking-wider">Cliquer pour agrandir →</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-ember">IMPOSE {item.number} · {item.date}</p>
                <h3 className="mt-1.5 font-display text-xl leading-snug line-clamp-2">{item.title}</h3>
                {item.person !== "Édition spéciale" && (
                  <p className="mt-1 text-xs font-semibold text-muted-foreground line-clamp-1">{item.person}</p>
                )}
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
              <img src={active.image} alt={active.title} className="h-full w-full object-cover" />
            </div>
            <div className="mt-4 text-center text-white">
              <span className="rounded-sm bg-ember px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                IMPOSE {active.number} · {active.date}
              </span>
              <p className="mt-2 font-display text-xl leading-snug">{active.title}</p>
              {active.person !== "Édition spéciale" && <p className="mt-1 text-sm text-white/75">{active.person}</p>}
              {active.description && <p className="mt-2 text-xs text-white/60 leading-relaxed">{active.description}</p>}
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
        <h2 className="mt-4 max-w-3xl font-display text-4xl sm:text-6xl">Votre histoire mérite d'être vue.</h2>
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

function PackagesSection({ onSelect }: { onSelect: (pkg: PackageOption) => void }) {
  const [compare, setCompare] = useState(false);
  useEffect(() => {
    const node = document.getElementById("offres");
    if (!node) return;
    const observer = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) track("package_view"); }, { threshold: .3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="offres" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ember">Nos packages</p>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl">Choisissez votre niveau de visibilité</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Des solutions adaptées aux entrepreneurs, entreprises, institutions et marques qui souhaitent renforcer leur visibilité.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {packages.map((pkg) => (
            <article key={pkg.id} className={`relative flex flex-col border p-6 transition-transform duration-300 hover:-translate-y-1 ${pkg.featured ? "border-gold bg-primary text-primary-foreground shadow-gold" : "border-foreground/15 bg-card hover:border-gold/40"}`}>
              {pkg.badge && (
                <span className="absolute right-4 top-0 -translate-y-1/2 bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-gold-foreground">
                  {pkg.badge}
                </span>
              )}
              <h3 className="text-xs font-bold uppercase tracking-widest">{pkg.name}</h3>
              <p className={`mt-6 font-display text-3xl ${pkg.featured ? "text-gold" : ""}`}>{pkg.priceFcfa}</p>
              <p className={`mt-1 text-xs ${pkg.featured ? "text-primary-foreground/55" : "text-muted-foreground"}`}>{pkg.priceEur}</p>
              <p className={`mt-5 min-h-20 text-sm leading-6 ${pkg.featured ? "text-primary-foreground/65" : "text-muted-foreground"}`}>{pkg.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map(f => (
                  <li key={f} className="flex gap-2 text-xs leading-5">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />{f}
                  </li>
                ))}
              </ul>
              <Button className="mt-7 w-full" variant={pkg.featured ? "gold" : "editorialOutline"} onClick={() => onSelect(pkg)}>
                {pkg.id === "annual" ? "Demander une proposition" : "Choisir ce pack"}
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="link" onClick={() => setCompare(!compare)}>
            Comparer les offres <ChevronRight className={`transition-transform duration-300 ${compare ? "rotate-90" : ""}`} />
          </Button>
        </div>

        {compare && (
          <div className="mt-7 overflow-x-auto border border-foreground/15 bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-4 font-semibold">Offre</th>
                  <th className="p-4 font-semibold">Tarif</th>
                  <th className="p-4 font-semibold">Production</th>
                  <th className="p-4 font-semibold">Diffusion</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(p => (
                  <tr key={p.id} className="border-t border-foreground/10 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4">{p.priceFcfa}<br /><span className="text-muted-foreground">{p.priceEur}</span></td>
                    <td className="p-4">{p.features[0]}</td>
                    <td className="p-4">{p.features[p.features.length - 1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function AudienceSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Pour qui ?</p>
        <h2 className="mt-4 max-w-4xl font-display text-4xl sm:text-6xl">IMPOSE accompagne ceux qui font bouger les lignes.</h2>
        <div className="mt-12 grid gap-px bg-primary-foreground/15 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map(([title, text]) => (
            <article key={title} className="group bg-primary p-8 transition-colors hover:bg-primary-foreground/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gold">{title}</h3>
              <p className="mt-5 max-w-xs font-display text-2xl leading-snug">{text}</p>
              <a href="#contact" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-primary-foreground/60 transition-colors hover:text-primary-foreground group-hover:gap-3 duration-300">
                En savoir plus <ArrowRight className="size-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  ["Échange", "Vous nous présentez votre entreprise, votre parcours ou votre projet en quelques minutes."],
  ["Sélection", "Notre équipe éditoriale identifie le format le plus adapté à votre histoire et vos objectifs."],
  ["Production", "Notre équipe prépare les contenus, éléments visuels et supports de diffusion."],
  ["Publication", "Votre histoire est publiée et relayée sur tous les canaux IMPOSE."],
];

function ProcessSection() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-ember">Notre processus</p>
        <h2 className="mt-4 font-display text-4xl sm:text-6xl">De votre histoire à sa publication.</h2>
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

type ContactFormProps = { selected: PackageOption | null };

function ContactForm({ selected }: ContactFormProps) {
  const [started, setStarted] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const lead: LeadData = {
      firstName: String(form.get("firstName") || "").trim(),
      lastName: String(form.get("lastName") || "").trim(),
      company: String(form.get("company") || "").trim(),
      position: String(form.get("position") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      country: String(form.get("country") || "").trim(),
      sector: String(form.get("sector") || "").trim(),
      objective: String(form.get("objective") || ""),
      selectedPackage: String(form.get("selectedPackage") || ""),
      message: String(form.get("message") || "").trim(),
      source: "Landing Page IMPOSE 100% Digital",
      createdAt: new Date().toISOString(),
    };

    track("contact_form_submit", { package: lead.selectedPackage });

    try {
      const result = await sendLeadToGoogleSheets(lead);
      if (result.success) {
        toast.success("Demande transmise avec succès ! Notre équipe reviendra vers vous.");
        setSent(true);
      } else {
        toast.error("Votre demande a été enregistrée en local. Notre équipe la traitera sous peu.");
        setSent(true);
      }
    } catch (err) {
      console.error("Erreur capture lead:", err);
      toast.success("Votre demande a bien été enregistrée.");
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
      <h3 className="mt-6 font-display text-3xl sm:text-4xl text-foreground">Demande transmise avec succès.</h3>
      <p className="mt-3 max-w-md mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
        Votre projet a bien été enregistré. L'équipe éditoriale et commerciale d'IMPOSE Magazine prendra contact avec vous dans les meilleurs délais.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="editorial" size="sm" onClick={() => setSent(false)}>
          Envoyer une autre demande
        </Button>
        <Button asChild variant="editorialOutline" size="sm">
          <a href="#editions">Parcourir les éditions</a>
        </Button>
      </div>
    </div>
  );

  const field = "w-full border border-input bg-card px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20 rounded-sm disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <form
      onSubmit={submit}
      onFocus={() => { if (!started) { setStarted(true); track("contact_form_start"); } }}
      className="grid gap-4 md:grid-cols-2"
    >
      <input className={field} name="firstName" placeholder="Prénom *" required disabled={loading} />
      <input className={field} name="lastName" placeholder="Nom *" required disabled={loading} />
      <input className={field} name="company" placeholder="Entreprise / Organisation *" required disabled={loading} />
      <input className={field} name="position" placeholder="Fonction" disabled={loading} />
      <input className={field} name="email" type="email" placeholder="Email professionnel *" required disabled={loading} />
      <input className={field} name="phone" type="tel" placeholder="Téléphone / WhatsApp *" required disabled={loading} />
      <input className={field} name="country" placeholder="Pays *" required disabled={loading} />
      <input className={field} name="sector" placeholder="Secteur d'activité *" required disabled={loading} />
      <select className={field} name="objective" defaultValue="" required disabled={loading}>
        <option value="" disabled>Votre objectif</option>
        {objectives.map(o => <option key={o}>{o}</option>)}
      </select>
      <select key={selected?.id ?? "none"} className={field} name="selectedPackage" defaultValue={selected ? `${selected.name} — ${selected.priceFcfa} (${selected.priceEur})` : ""} disabled={loading}>
        <option value="">Je ne sais pas encore</option>
        {packages.map(p => <option key={p.id}>{p.name} — {p.priceFcfa} ({p.priceEur})</option>)}
      </select>
      <textarea className={`${field} min-h-36 resize-y md:col-span-2`} name="message" placeholder="Parlez-nous de votre projet ou de votre besoin…" required disabled={loading} />
      <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground md:col-span-2">
        <input type="checkbox" required className="mt-0.5 size-4 accent-[var(--gold)]" disabled={loading} />
        J'accepte d'être recontacté par l'équipe IMPOSE concernant ma demande.
      </label>
      {error && (
        <div className="md:col-span-2 rounded bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}
      <div className="md:col-span-2">
        <Button type="submit" variant="editorial" size="xl" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent inline-block mr-2" />
              Transmission en cours...
            </>
          ) : (
            <>
              Envoyer ma demande <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function ContactSection({ selected }: ContactFormProps) {
  return (
    <section id="contact" className="hero-sunrise py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ember">Demande de proposition</p>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl">Parlons de votre visibilité.</h2>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Présentez-nous votre projet et notre équipe vous contactera pour vous proposer la solution IMPOSE la plus adaptée à vos objectifs.
          </p>
          <div className="mt-9 editorial-rule pt-6 space-y-3 text-sm">
            <a href="tel:+2250757528302" className="flex items-center gap-3 py-2 hover:text-ember transition-colors" onClick={() => track("phone_click")}>
              <Phone className="size-4 text-ember" />+225 07 57 52 83 02
            </a>
            <a href="mailto:contact@impose-ci.com" className="flex items-center gap-3 py-2 hover:text-ember transition-colors" onClick={() => track("email_click")}>
              <Mail className="size-4 text-ember" />contact@impose-ci.com
            </a>
          </div>

          {/* Mini cover strip */}
          <div className="mt-10 hidden lg:flex gap-3 overflow-hidden">
            {magazineIssues.slice(0, 4).map(item => (
              <div key={item.id} className="w-16 shrink-0 overflow-hidden rounded-sm shadow-md opacity-70 hover:opacity-100 transition-opacity" style={{ aspectRatio: "711 / 1084" }}>
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <ContactForm selected={selected} />
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
              <a className="block hover:text-primary-foreground transition-colors" href="#">Équipe</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">Professionnels</p>
            <div className="mt-5 space-y-3 text-sm text-primary-foreground/60">
              <a className="block hover:text-primary-foreground transition-colors" href="#offres">Nos offres</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#contact">Être publié</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#contact">Publicité</a>
              <a className="block hover:text-primary-foreground transition-colors" href="#contact">Partenariat</a>
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
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Conditions générales</a>
            <a href="/admin" className="text-primary-foreground/40 hover:text-gold transition-colors text-[11px] font-medium">Administration</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  const { covers, partners, metrics } = useDynamicData();
  const [selected, setSelected] = useState<PackageOption | null>(null);
  const [modalCover, setModalCover] = useState<MagazineIssue | null>(null);
  const choose = (pkg: PackageOption) => {
    setSelected(pkg);
    track("package_select", { package: pkg.name, price: pkg.priceFcfa });
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  return (
    <>
      <Header />
      <main>
        <Hero onSelectCover={setModalCover} coverItems={covers} metricItems={metrics} />
        <CoverMarqueeTicker onSelect={setModalCover} items={covers} />
        <AboutSection />
        <MagazineGallery onSelect={setModalCover} items={covers} />
        <BenefitsSection />
        <PackagesSection onSelect={choose} />
        <AudienceSection />
        <PartnersSection items={partners} />
        <ProcessSection />
        <ContactSection selected={selected} />
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

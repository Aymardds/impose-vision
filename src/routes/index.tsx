import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Facebook, Instagram, Linkedin, Mail, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { magazineIssues, objectives, packages, type MagazineIssue, type PackageOption } from "@/data/impose";
import logoAsset from "@/assets/impose-logo.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IMPOSE Magazine | Leaders et transformations africaines" },
      { name: "description", content: "IMPOSE met en lumière les entrepreneurs, dirigeants, entreprises, innovateurs et institutions qui façonnent l'Afrique. Découvrez nos éditions et nos solutions de visibilité." },
      { property: "og:title", content: "IMPOSE Magazine | Leaders et transformations africaines" },
      { property: "og:description", content: "Le média panafricain qui révèle celles et ceux qui façonnent l'Afrique." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

declare global { interface Window { dataLayer?: Array<Record<string, unknown>> } }

function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}

function Logo({ light = false }: { light?: boolean }) {
  return <img src={logoAsset.url} width="184" height="61" alt="IMPOSE Magazine" className={`h-7 w-auto object-contain ${light ? "brightness-0 invert" : ""}`} />;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Accueil", "#accueil"], ["Le Magazine", "#magazine"], ["Nos offres", "#offres"], ["Nos éditions", "#editions"], ["À propos", "#apropos"], ["Contact", "#contact"]];
  return <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
      <a href="#accueil" aria-label="Accueil IMPOSE"><Logo /></a>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">{links.map(([label, href]) => <a key={href} href={href} className="text-xs font-semibold uppercase text-foreground/65 transition-colors hover:text-foreground">{label}</a>)}</nav>
      <div className="flex items-center gap-2">
        <Button asChild variant="editorial" size="sm"><a href="#contact">Présenter mon projet</a></Button>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}>{open ? <X /> : <Menu />}</Button>
      </div>
    </div>
    {open && <nav className="border-t border-foreground/10 bg-background px-5 py-5 lg:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-foreground/10 py-3 font-display text-xl">{label}</a>)}</nav>}
  </header>;
}

function MagazineCover({ issue, hero = false, onClick }: { issue: MagazineIssue; hero?: boolean; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className={`group relative block overflow-hidden bg-card text-left shadow-2xl ${hero ? "cover-float w-full" : "w-full transition-transform duration-500 hover:-translate-y-2"}`} aria-label={`Voir ${issue.number} — ${issue.title}`}>
    <img src={issue.image} alt={`Couverture ${issue.number} : ${issue.title}`} width={hero ? 1024 : 768} height={hero ? 1376 : 1024} loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : "auto"} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 text-primary-foreground [text-shadow:0_1px_12px_rgb(0_0_0/0.45)]">
      <span className="font-display text-3xl font-semibold">IMPOSE</span><span className="mt-1 text-[10px] font-bold uppercase">{issue.number}</span>
    </div>
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4 pt-20 text-primary-foreground">
      <span className="text-[10px] font-bold uppercase">Édition business & leadership</span><p className="mt-1 font-display text-2xl leading-none">{issue.title}</p>
    </div>
  </button>;
}

function Hero() {
  return <section id="accueil" className="hero-sunrise relative min-h-[calc(90vh-4.5rem)] overflow-hidden">
    <div className="mx-auto grid min-h-[calc(90vh-4.5rem)] max-w-7xl items-center gap-12 px-5 py-12 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-16">
      <div className="order-2 lg:order-1">
        <div className="reveal-one flex items-center gap-3 text-[10px] font-bold uppercase text-foreground/60"><span className="h-px w-9 bg-ember" />Le magazine des leaders et des transformations africaines</div>
        <h1 className="reveal-two mt-6 max-w-4xl font-display text-5xl font-medium leading-[.96] sm:text-6xl lg:text-8xl">Les histoires qui façonnent <em className="text-ember">l’Afrique.</em></h1>
        <p className="reveal-three mt-7 max-w-2xl text-base leading-7 text-muted-foreground lg:text-lg">IMPOSE met en lumière les entrepreneurs, dirigeants, innovateurs, institutions et initiatives qui transforment l’Afrique et construisent les succès de demain.</p>
        <div className="reveal-three mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="editorial" size="xl" onClick={() => track("hero_cta_click", { target: "packages" })}><a href="#offres">Découvrir nos offres <ArrowDown /></a></Button>
          <Button asChild variant="editorialOutline" size="xl" onClick={() => track("hero_cta_click", { target: "contact" })}><a href="#contact">Être publié dans IMPOSE</a></Button>
        </div>
        <p className="mt-8 text-[10px] font-semibold uppercase text-foreground/45">Entrepreneurs <b className="text-gold">•</b> Entreprises <b className="text-gold">•</b> Institutions <b className="text-gold">•</b> Innovateurs</p>
      </div>
      <div className="order-1 mx-auto w-[62vw] max-w-[370px] lg:order-2 lg:w-full"><MagazineCover issue={magazineIssues[0]} hero /></div>
    </div>
  </section>;
}

const benefits = [
  ["Leadership", "Des personnalités et dirigeants qui inspirent une génération."], ["Innovation", "Des solutions et modèles qui transforment les secteurs."], ["Impact", "Des initiatives qui créent durablement de la valeur en Afrique."], ["Visibilité", "Une plateforme pour renforcer la notoriété des acteurs mis en avant."],
];

function AboutSection() {
  return <section id="magazine" className="bg-primary py-20 text-primary-foreground lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8">
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-24"><div><p className="text-[10px] font-bold uppercase text-gold">IMPOSE en quelques mots</p><h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Plus qu’un magazine. Une vitrine pour ceux qui construisent l’avenir.</h2></div><p className="self-end text-base leading-8 text-primary-foreground/65">IMPOSE valorise les parcours, les entreprises, les innovations et les initiatives à fort impact. Nous créons des récits exigeants qui renforcent la confiance, la notoriété et l’influence de celles et ceux qui font avancer le continent.</p></div>
    <div className="mt-16 grid border-t border-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(([title, text], i) => <article className="border-b border-primary-foreground/15 py-7 sm:px-5 lg:border-r lg:last:border-r-0" key={title}><span className="font-display text-2xl text-gold">0{i + 1}</span><h3 className="mt-6 text-sm font-bold uppercase">{title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/55">{text}</p></article>)}</div>
  </div></section>;
}

function MagazineCarousel() {
  const ref = useRef<HTMLDivElement>(null); const [issue, setIssue] = useState<MagazineIssue | null>(null);
  const move = (direction: number) => ref.current?.scrollBy({ left: direction * 310, behavior: "smooth" });
  return <section id="editions" className="bg-background py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8">
    <div className="flex items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase text-ember">Collection IMPOSE</p><h2 className="mt-4 font-display text-4xl sm:text-6xl">Nos éditions</h2><p className="mt-4 max-w-2xl text-muted-foreground">Découvrez les personnalités, entreprises et histoires qui ont marqué nos précédentes éditions.</p></div><div className="hidden gap-2 sm:flex"><Button variant="outline" size="icon" onClick={() => move(-1)} aria-label="Édition précédente"><ArrowLeft /></Button><Button variant="outline" size="icon" onClick={() => move(1)} aria-label="Édition suivante"><ArrowRight /></Button></div></div>
    <div ref={ref} className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:none]">{magazineIssues.map((item) => <article key={item.id} className="w-[72vw] max-w-[280px] shrink-0 snap-start"><MagazineCover issue={item} onClick={() => { setIssue(item); track("magazine_issue_view", { issue: item.number }); }} /><p className="mt-5 text-[10px] font-bold uppercase text-ember">IMPOSE {item.number} · {item.date}</p><h3 className="mt-2 font-display text-2xl">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></article>)}</div>
  </div>{issue && <div className="fixed inset-0 z-[70] grid place-items-center bg-primary/90 p-5" role="dialog" aria-modal="true"><div className="relative w-full max-w-sm"><Button variant="secondary" size="icon" className="absolute -right-3 -top-3 z-10" onClick={() => setIssue(null)} aria-label="Fermer"><X /></Button><MagazineCover issue={issue} /></div></div>}</section>;
}

const valueCards = [["Visibilité", "Présentez votre entreprise, votre marque ou votre parcours à une audience professionnelle."], ["Crédibilité", "Associez votre image à un environnement éditorial premium."], ["Personal branding", "Positionnez dirigeants, entrepreneurs et experts comme références de leur secteur."], ["Impact", "Faites connaître vos projets, innovations et initiatives."]];
function BenefitsSection() { return <section id="apropos" className="bg-paper py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><p className="text-[10px] font-bold uppercase text-ember">La valeur IMPOSE</p><h2 className="mt-4 max-w-3xl font-display text-4xl sm:text-6xl">Votre histoire mérite d’être vue.</h2><div className="mt-12 grid gap-px bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">{valueCards.map(([title,text],i)=><article key={title} className="group bg-paper p-7 transition-colors hover:bg-card"><span className="font-display text-4xl text-gold">0{i+1}</span><h3 className="mt-14 text-xs font-bold uppercase">{title}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{text}</p><ArrowUpRight className="mt-8 text-ember transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></article>)}</div></div></section> }

function PackagesSection({ onSelect }: { onSelect: (pkg: PackageOption) => void }) {
  const [compare, setCompare] = useState(false);
  useEffect(() => { const node = document.getElementById("offres"); if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) track("package_view"); }, { threshold: .3 }); observer.observe(node); return () => observer.disconnect(); }, []);
  return <section id="offres" className="bg-background py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="text-center"><p className="text-[10px] font-bold uppercase text-ember">Nos packages</p><h2 className="mt-4 font-display text-4xl sm:text-6xl">Choisissez votre niveau de visibilité</h2><p className="mx-auto mt-5 max-w-2xl text-muted-foreground">Des solutions adaptées aux entrepreneurs, entreprises, institutions et marques qui souhaitent renforcer leur visibilité.</p></div>
    <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">{packages.map((pkg) => <article key={pkg.id} className={`relative flex flex-col border p-6 ${pkg.featured ? "border-gold bg-primary text-primary-foreground shadow-gold" : "border-foreground/15 bg-card"}`}>{pkg.badge && <span className="absolute right-4 top-0 -translate-y-1/2 bg-gold px-3 py-1 text-[9px] font-bold uppercase text-gold-foreground">{pkg.badge}</span>}<h3 className="text-xs font-bold uppercase">{pkg.name}</h3><p className={`mt-6 font-display text-3xl ${pkg.featured ? "text-gold" : ""}`}>{pkg.priceFcfa}</p><p className={`mt-1 text-xs ${pkg.featured ? "text-primary-foreground/55" : "text-muted-foreground"}`}>{pkg.priceEur}</p><p className={`mt-5 min-h-20 text-sm leading-6 ${pkg.featured ? "text-primary-foreground/65" : "text-muted-foreground"}`}>{pkg.description}</p><ul className="mt-6 flex-1 space-y-3">{pkg.features.map(f => <li key={f} className="flex gap-2 text-xs leading-5"><Check className="mt-0.5 size-3.5 shrink-0 text-gold" />{f}</li>)}</ul><Button className="mt-7 w-full" variant={pkg.featured ? "gold" : "editorialOutline"} onClick={() => onSelect(pkg)}>{pkg.id === "annual" ? "Demander une proposition" : "Choisir ce pack"}</Button></article>)}</div>
    <div className="mt-8 text-center"><Button variant="link" onClick={() => setCompare(!compare)}>Comparer les offres <ChevronRight /></Button></div>
    {compare && <div className="mt-7 overflow-x-auto border border-foreground/15 bg-card"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="bg-primary text-primary-foreground"><th className="p-4">Offre</th><th className="p-4">Tarif</th><th className="p-4">Production</th><th className="p-4">Diffusion</th></tr></thead><tbody>{packages.map(p => <tr key={p.id} className="border-t border-foreground/10"><td className="p-4 font-semibold">{p.name}</td><td className="p-4">{p.priceFcfa}<br/><span className="text-muted-foreground">{p.priceEur}</span></td><td className="p-4">{p.features[0]}</td><td className="p-4">{p.features[p.features.length - 1]}</td></tr>)}</tbody></table></div>}
  </div></section>;
}

const audiences = [["Entrepreneurs", "Développez votre visibilité et votre personal branding."], ["PME", "Présentez vos produits, services et réussites."], ["Grandes entreprises", "Développez vos campagnes de communication et votre image."], ["Institutions", "Valorisez vos programmes, projets et initiatives."], ["ONG & fondations", "Mettez en lumière votre impact."], ["Experts & dirigeants", "Construisez votre autorité et votre influence."]];
function AudienceSection() { return <section className="bg-primary py-20 text-primary-foreground lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><p className="text-[10px] font-bold uppercase text-gold">Pour qui ?</p><h2 className="mt-4 max-w-4xl font-display text-4xl sm:text-6xl">IMPOSE accompagne ceux qui font bouger les lignes.</h2><div className="mt-12 grid gap-px bg-primary-foreground/15 md:grid-cols-2 lg:grid-cols-3">{audiences.map(([title,text]) => <article key={title} className="group bg-primary p-7"><h3 className="text-xs font-bold uppercase text-gold">{title}</h3><p className="mt-5 max-w-xs font-display text-2xl leading-snug">{text}</p><a href="#contact" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-primary-foreground/60 hover:text-primary-foreground">En savoir plus <ArrowRight className="size-4" /></a></article>)}</div></div></section> }

const steps = [["Échange", "Vous nous présentez votre entreprise, votre parcours ou votre projet."], ["Sélection", "Notre équipe identifie le format éditorial le plus adapté."], ["Production", "Notre équipe prépare les contenus et éléments visuels."], ["Publication", "Votre histoire est publiée et relayée sur les canaux IMPOSE."]];
function ProcessSection() { return <section className="bg-paper py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><p className="text-[10px] font-bold uppercase text-ember">Notre processus</p><h2 className="mt-4 font-display text-4xl sm:text-6xl">De votre histoire à sa publication.</h2><ol className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-6 before:absolute before:left-0 before:right-0 before:top-5 before:hidden before:h-px before:bg-gold lg:before:block">{steps.map(([title,text],i)=><li key={title} className="relative"><span className="relative z-10 inline-grid size-10 place-items-center bg-gold font-display text-sm text-gold-foreground">0{i+1}</span><h3 className="mt-6 text-xs font-bold uppercase">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></li>)}</ol></div></section> }

type ContactFormProps = { selected: PackageOption | null };
function ContactForm({ selected }: ContactFormProps) {
  const [started, setStarted] = useState(false); const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const form = new FormData(e.currentTarget); const lead = { firstName: form.get("firstName"), lastName: form.get("lastName"), company: form.get("company"), position: form.get("position"), email: form.get("email"), phone: form.get("phone"), country: form.get("country"), sector: form.get("sector"), objective: form.get("objective"), selectedPackage: form.get("selectedPackage"), message: form.get("message"), source: "landing_impose", createdAt: new Date().toISOString(), leadScore: 0, status: "NEW" }; track("contact_form_submit", { package: lead.selectedPackage }); console.info("Lead ready for CRM", lead); setSent(true); };
  if (sent) return <div className="border border-gold/40 bg-card p-10 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-gold text-gold-foreground"><Check /></span><h3 className="mt-6 font-display text-4xl">Merci pour votre demande.</h3><p className="mt-3 text-muted-foreground">Notre équipe IMPOSE reviendra vers vous prochainement.</p></div>;
  const field = "w-full rounded-md border border-input bg-card px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20";
  return <form onSubmit={submit} onFocus={() => { if (!started) { setStarted(true); track("contact_form_start"); } }} className="grid gap-4 md:grid-cols-2">
    <input className={field} name="firstName" placeholder="Prénom *" required/><input className={field} name="lastName" placeholder="Nom *" required/><input className={field} name="company" placeholder="Entreprise / Organisation *" required/><input className={field} name="position" placeholder="Fonction"/><input className={field} name="email" type="email" placeholder="Email professionnel *" required/><input className={field} name="phone" type="tel" placeholder="Téléphone / WhatsApp *" required/><input className={field} name="country" placeholder="Pays *" required/><input className={field} name="sector" placeholder="Secteur d’activité *" required/>
    <select className={field} name="objective" defaultValue="" required><option value="" disabled>Votre objectif</option>{objectives.map(o=><option key={o}>{o}</option>)}</select>
    <select key={selected?.id ?? "none"} className={field} name="selectedPackage" defaultValue={selected ? `${selected.name} — ${selected.priceFcfa} (${selected.priceEur})` : ""}><option value="">Je ne sais pas encore</option>{packages.map(p=><option key={p.id}>{p.name} — {p.priceFcfa} ({p.priceEur})</option>)}</select>
    <textarea className={`${field} min-h-32 resize-y md:col-span-2`} name="message" placeholder="Parlez-nous de votre projet ou de votre besoin…" required />
    <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground md:col-span-2"><input type="checkbox" required className="mt-0.5 size-4 accent-[var(--gold)]" />J’accepte d’être recontacté par l’équipe IMPOSE concernant ma demande.</label>
    <div className="md:col-span-2"><Button type="submit" variant="editorial" size="xl" className="w-full sm:w-auto">Envoyer ma demande <ArrowRight /></Button></div>
  </form>;
}

function ContactSection({ selected }: ContactFormProps) { return <section id="contact" className="hero-sunrise py-20 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8"><div><p className="text-[10px] font-bold uppercase text-ember">Demande de proposition</p><h2 className="mt-4 font-display text-5xl sm:text-6xl">Parlons de votre visibilité.</h2><p className="mt-6 text-base leading-7 text-muted-foreground">Présentez-nous votre projet et notre équipe vous contactera pour vous proposer la solution IMPOSE la plus adaptée.</p><div className="mt-9 editorial-rule pt-6 text-sm"><a href="tel:+2250757528302" className="flex items-center gap-3 py-2" onClick={() => track("whatsapp_click")}><Phone className="size-4 text-ember" />+225 07 57 52 83 02</a></div></div><ContactForm selected={selected}/></div></section> }

function Footer() { return <footer className="bg-primary pb-24 pt-16 text-primary-foreground lg:pb-10"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-12 border-b border-primary-foreground/15 pb-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><Logo light/><p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/55">IMPOSE — Le magazine des leaders et des transformations africaines.</p></div><div><p className="text-xs font-bold uppercase text-gold">Magazine</p><div className="mt-5 space-y-3 text-sm text-primary-foreground/60"><a className="block" href="#editions">Nos éditions</a><a className="block" href="#apropos">À propos</a><a className="block" href="#">Équipe</a></div></div><div><p className="text-xs font-bold uppercase text-gold">Professionnels</p><div className="mt-5 space-y-3 text-sm text-primary-foreground/60"><a className="block" href="#offres">Nos offres</a><a className="block" href="#contact">Être publié</a><a className="block" href="#contact">Publicité</a><a className="block" href="#contact">Partenariat</a></div></div><div><p className="text-xs font-bold uppercase text-gold">Contact</p><div className="mt-5 flex gap-3"><a href="https://www.linkedin.com/company/94140411/" target="_blank" rel="noreferrer" onClick={() => track("linkedin_click")} aria-label="LinkedIn"><Linkedin /></a><a href="https://www.facebook.com/imposeofficiel" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a><a href="#" aria-label="Instagram"><Instagram /></a><a href="mailto:contact@impose-ci.com" onClick={() => track("email_click")} aria-label="Email"><Mail /></a></div></div></div><div className="flex flex-col gap-4 pt-7 text-xs text-primary-foreground/40 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 IMPOSE Magazine. Tous droits réservés.</p><div className="flex flex-wrap gap-5"><a href="#">Mentions légales</a><a href="#">Politique de confidentialité</a><a href="#">Conditions générales</a></div></div></div></footer> }

function Index() {
  const [selected, setSelected] = useState<PackageOption | null>(null);
  const choose = (pkg: PackageOption) => { setSelected(pkg); track("package_select", { package: pkg.name, price: pkg.priceFcfa }); window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 50); };
  return <><Header/><main><Hero/><AboutSection/><MagazineCarousel/><BenefitsSection/><PackagesSection onSelect={choose}/><AudienceSection/><ProcessSection/><ContactSection selected={selected}/></main><Footer/><Button asChild variant="gold" className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-6 shadow-gold lg:left-auto lg:right-6 lg:translate-x-0"><a href="#contact">Parler à IMPOSE</a></Button></>;
}
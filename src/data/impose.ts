import heroCover from "@/assets/impose-cover-hero.jpg";
import leaderCover from "@/assets/impose-cover-leader.jpg";
import innovationCover from "@/assets/impose-cover-innovation.jpg";
import industryCover from "@/assets/impose-cover-industry.jpg";

export type MagazineIssue = {
  id: number;
  number: string;
  title: string;
  date: string;
  image: string;
  description: string;
  featured: boolean;
};

export const magazineIssues: MagazineIssue[] = [
  { id: 30, number: "N°30", title: "Les bâtisseurs de demain", date: "Juillet 2026", image: heroCover, description: "Entreprendre, diriger et transformer avec ambition.", featured: true },
  { id: 29, number: "N°29", title: "Le leadership en mouvement", date: "Mai 2026", image: leaderCover, description: "Celles et ceux qui ouvrent de nouvelles voies.", featured: false },
  { id: 28, number: "N°28", title: "L’innovation qui se lève", date: "Mars 2026", image: innovationCover, description: "Les idées qui redessinent les économies africaines.", featured: false },
  { id: 27, number: "N°27", title: "Industries d’avenir", date: "Janvier 2026", image: industryCover, description: "Produire, investir et créer de la valeur sur le continent.", featured: false },
];

export type PackageOption = {
  id: string;
  name: string;
  priceFcfa: string;
  priceEur: string;
  description: string;
  features: string[];
  badge?: string;
  featured?: boolean;
};

export const packages: PackageOption[] = [
  { id: "discovery", name: "Pack Découverte", priceFcfa: "70 000 FCFA", priceEur: "≈ 107 €", description: "Pour faire ses premiers pas dans l’univers IMPOSE.", features: ["Article éditorial dédié", "Visuel de publication", "Relais sur un canal digital"] },
  { id: "growth", name: "Pack Croissance", priceFcfa: "90 000 FCFA", priceEur: "≈ 137 €", description: "Pour les entrepreneurs et PME qui développent leur visibilité.", features: ["Interview ou portrait", "Création des éléments visuels", "Relais multicanal", "Mise en avant sur le site"], badge: "Populaire", featured: true },
  { id: "impact", name: "Pack Impact", priceFcfa: "150 000 FCFA", priceEur: "≈ 229 €", description: "Une communication ambitieuse et une présence éditoriale renforcée.", features: ["Dossier éditorial enrichi", "Interview du dirigeant", "Campagne digitale dédiée", "Mise en avant prioritaire"] },
  { id: "signature", name: "Pack Signature", priceFcfa: "200 000 FCFA", priceEur: "≈ 305 €", description: "Une expérience premium pour affirmer votre image et votre positionnement.", features: ["Production éditoriale premium", "Shooting ou direction visuelle", "Diffusion multicanale", "Accompagnement personnalisé"] },
  { id: "annual", name: "Pack Exclusif Annuel", priceFcfa: "650 000 FCFA / an", priceEur: "≈ 991 € / an", description: "Une présence régulière pour les entreprises et organisations.", features: ["Programme éditorial sur 12 mois", "Présence récurrente", "Partenariat média prioritaire", "Suivi dédié"], badge: "Meilleure valeur" },
];

export const objectives = ["Mettre en avant mon entreprise", "Présenter un produit ou service", "Être interviewé", "Valoriser mon parcours", "Promouvoir un événement", "Communication institutionnelle", "Campagne publicitaire", "Partenariat média", "Autre"];

export const leadStatuses = ["NEW", "CONTACTED", "QUALIFIED", "OFFER_SENT", "NEGOTIATION", "WON", "LOST", "NURTURING"] as const;
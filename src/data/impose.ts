import jemimaCover from "@/assets/landingImage/coverImposeJemima copie.jpg";
import alexDegnyCover from "@/assets/landingImage/AlexDegny.jpg";
import agathonCover from "@/assets/landingImage/AgathonPolusa.jpg";
import alexiaCover from "@/assets/landingImage/Alexia.jpg";
import gwladysCover from "@/assets/landingImage/GWLADYS.jpg";
import deborahCover from "@/assets/landingImage/IMPOSE | COVER DEBORAH.png";
import stephaneCover from "@/assets/landingImage/Stéphane Bolou.png";
import olgaCover from "@/assets/landingImage/Olga Djadji.jpg";
import ouedraogoCover from "@/assets/landingImage/Ouedraogo.png";
import florenceCover from "@/assets/landingImage/Florence.png";
import josephBileyCover from "@/assets/landingImage/JOsephBIley.png";
import ndoyeCover from "@/assets/landingImage/Ndoye.png";
import brianCover from "@/assets/landingImage/Bryan.png";

export type MagazineIssue = {
  id: number;
  number: string;
  title: string;
  date: string;
  image: string;
  description: string;
  person: string;
  featured: boolean;
};

export const magazineIssues: MagazineIssue[] = [
  {
    id: 31,
    number: "N°31",
    title: "L'impact comme moteur : Quand le business devient une solution pour tous",
    date: "Septembre 2026",
    image: josephBileyCover,
    description: "Joseph-Olivier Biley — Co-Founder & CEO, Jool International. 125 Millions de dollars ATIDI pour l'investissement en Afrique.",
    person: "Joseph-Olivier Biley",
    featured: true,
  },
  {
    id: 28,
    number: "N°28",
    title: "Africa's Business Heroes",
    date: "Avril 2026",
    image: gwladysCover,
    description: "Gwladys Alahassa — Directrice Générale Qotto Bénin. Elles déplacent les lignes : le nouveau pouvoir féminin de l'innovation.",
    person: "Gwladys Alahassa",
    featured: true,
  },
  {
    id: 27,
    number: "N°27",
    title: "L'architecte de la réputation",
    date: "Mars 2026",
    image: ndoyeCover,
    description: "El Hadji Ndoye — Expert en Personal Branding pour Entrepreneurs & CEOs. Le CEO qui façonne les leaders de demain. Africa's Business Heroes 2026.",
    person: "El Hadji Ndoye",
    featured: true,
  },
  {
    id: 25,
    number: "N°25",
    title: "Pourquoi les investisseurs misent sur la finance africaine ?",
    date: "Janvier 2025",
    image: ouedraogoCover,
    description: "Jonathan Ouedraogo — Banque et Ingénierie Financière, Expert E-commerce. SEDAP & Programme TEF.",
    person: "Jonathan Ouedraogo",
    featured: false,
  },
  {
    id: 24,
    number: "N°24",
    title: "Vision, défis et leadership de l'Amazone de l'Énergie",
    date: "Décembre 2024",
    image: florenceCover,
    description: "Florence Eba — Snr Consultant & Director at Venture Konect. Le Sénégal soutient la Banque Africaine de l'Énergie.",
    person: "Florence Eba",
    featured: false,
  },
  {
    id: 23,
    number: "N°23",
    title: "L'écosystème des startups en Côte d'Ivoire",
    date: "Août 2024",
    image: alexiaCover,
    description: "Alexia Amicha — Sous-directrice du Développement de l'Entrepreneuriat et des Startups Technologiques.",
    person: "Alexia Amicha",
    featured: false,
  },
  {
    id: 22,
    number: "N°22",
    title: "Transforming life in Africa & CleanTech",
    date: "Octobre 2024",
    image: deborahCover,
    description: "Deborah Gael — Co-Founder and COO of Koolboks. Réfrigération solaire et accélération des énergies durables.",
    person: "Deborah Gael",
    featured: false,
  },
  {
    id: 221,
    number: "N°22",
    title: "$145 million to boost energy & Finance internationale",
    date: "Octobre 2024",
    image: brianCover,
    description: "Brian Hurfet — CEO de BHB Investments & Business Services et African Insights Academy. Ancien banquier d'affaires.",
    person: "Brian Hurfet",
    featured: false,
  },
  {
    id: 21,
    number: "N°21",
    title: "L'univers remarquable des startups en Afrique",
    date: "Juin 2024",
    image: alexDegnyCover,
    description: "Alex Degny — Président du CI20. 20 startups numériques représentent la Côte d'Ivoire à l'international.",
    person: "Alex Degny",
    featured: false,
  },
  {
    id: 11,
    number: "N°11",
    title: "2 Milliards disponibles pour la jeunesse ivoirienne",
    date: "Novembre 2024",
    image: stephaneCover,
    description: "Stéphane Bolou — Délégué Exécutif #Ci20 | Directeur Fund Management du Fonds Startup Boost Capital.",
    person: "Stéphane Bolou",
    featured: false,
  },
  {
    id: 10,
    number: "N°10",
    title: "Des institutions s'engagent dans l'autonomisation des jeunes",
    date: "Octobre 2024",
    image: olgaCover,
    description: "Olga Djadji — Présidente de la Fondation BKD (Bénédicte Janine Kacou Diagou). Impacter un million de jeunes.",
    person: "Olga Djadji",
    featured: false,
  },
  {
    id: 7,
    number: "N°07",
    title: "L'impact de la digitalisation sur la jeunesse africaine",
    date: "Juillet 2024",
    image: agathonCover,
    description: "Polus Agathon — Spécialiste en Communication Digitale, Formateur certifié Méta.",
    person: "Polus Agathon",
    featured: false,
  },
  {
    id: 3,
    number: "N°03",
    title: "100 personnalités qui ont changé l'Afrique",
    date: "Mars 2023",
    image: jemimaCover,
    description: "Jemima Kessie — Nouvelle génération de communicants en faveur des bonnes conditions des femmes.",
    person: "Jemima Kessie",
    featured: false,
  },
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
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
import alexZanBiCover from "@/assets/landingImage/Alex Zan Bi.jpeg";
import mohamedAlyDiabateCover from "@/assets/landingImage/Mohamed Aly Diabaté.jpeg";
import darlyNguemaCover from "@/assets/landingImage/Darly Nguema.jpeg";
import moroCover from "@/assets/landingImage/Moro Application.jpeg";
import zagbadiCover from "@/assets/landingImage/ zagbadi.JPG";
import grouilleurCover from "@/assets/landingImage/Grouilleur3.0.JPG";
import adingraCover from "@/assets/landingImage/wilfried Adingra.JPG";
import oulaiCover from "@/assets/landingImage/Daniel Oulai.JPG";
import danonCover from "@/assets/landingImage/Charlene Danon.JPG";
import mylenCharleneCover from "@/assets/landingImage/Mylen & Charlene.JPG";
import assaleCover from "@/assets/landingImage/Assalé Tiémoko.JPG";
import gueboCover from "@/assets/landingImage/Israel Guebo.JPG";
import auroreCover from "@/assets/landingImage/Axel Aurore.JPG";

import partner1 from "@/assets/landingImage/PartenaireImpose1.png";
import partner2 from "@/assets/landingImage/PartenaireImpose2.png";
import partner3 from "@/assets/landingImage/PartenaireImpose3.png";
import partner4 from "@/assets/landingImage/PartenaireImpose4.png";
import partner5 from "@/assets/landingImage/PartenaireImpose5.png";
import partnerMoro from "@/assets/landingImage/PartenaireImpose6.png";
import partnerKoolboks from "@/assets/landingImage/PartenaireImpose6.png.webp";
import partner7 from "@/assets/landingImage/PartenaireImpose7.png.webp";
import partner8 from "@/assets/landingImage/PartenaireImpose8.png";

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
    id: 30,
    number: "N°30",
    title: "Tout devient digital : Comprendre et maîtriser le virage incontournable",
    date: "Août 2026",
    image: alexZanBiCover,
    description: "Alex Zan Bi — Entrepreneur Digital & Créateur de Contenu (+300k abonnés). Fondateur Lewa Space & Cofondateur GetMedford.",
    person: "Alex Zan Bi",
    featured: true,
  },
  {
    id: 29,
    number: "N°29",
    title: "Quand la technologie tente de structurer l'informel africain",
    date: "Mai 2026",
    image: moroCover,
    description: "Inclusion financière, données et éducation financière : une nouvelle approche pour rendre les micro-entrepreneurs visibles et finançables. 1,7 Milliard FCFA dans l'UEMOA.",
    person: "Moro Application",
    featured: true,
  },
  {
    id: 28,
    number: "N°28",
    title: "Africa's Business Heroes — Le nouveau pouvoir féminin de l'innovation",
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
    id: 26,
    number: "N°26",
    title: "Transformer la passion en entreprise : Le pari lucide des créatifs africains",
    date: "Février 2026",
    image: mohamedAlyDiabateCover,
    description: "Mohamed Aly Diabaté — Filmmaker, Photojournalist & Manager Visualis Africa. 29 500 Milliards USD de richesses minières & Initiative IA Bill Gates / OpenAI.",
    person: "Mohamed Aly Diabaté",
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
    id: 211,
    number: "N°21",
    title: "L'inclusion financière dans le contexte africain",
    date: "Septembre 2025",
    image: darlyNguemaCover,
    description: "Darly Nguema — Analyste financière. L'accès universel et équitable aux services financiers numériques abordables.",
    person: "Darly Nguema",
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
    id: 20,
    number: "N°20",
    title: "Fintech : Vers une révolution inclusive de la finance en Afrique de l'Ouest",
    date: "Août 2025",
    image: zagbadiCover,
    description: "Régis Zagbadi — Expert Risques & Compliance FinTech UEMOA | Fondateur IZAQA. Bientôt les paiements instantanés pour tous, Mobile Money et PI-SPI.",
    person: "Régis Zagbadi",
    featured: true,
  },
  {
    id: 19,
    number: "N°19",
    title: "L'art contemporain, entre révolte esthétique et questionnements identitaires",
    date: "Juillet 2025",
    image: grouilleurCover,
    description: "Olatidoye Iburaim Olaniyi (Grouilleur 3.0) — Photographe professionnel. Prix Pierre Castel 2025 : « DJOLI » sacré vainqueur. Le champ du producteur devient notre frigo.",
    person: "Olatidoye Iburaim Olaniyi (Grouilleur 3.0)",
    featured: false,
  },
  {
    id: 18,
    number: "N°18",
    title: "La startup africaine qui redéfinit la mobilité urbaine",
    date: "Juin 2025",
    image: adingraCover,
    description: "Wilfried Adingra — Founder & CEO at GLSAfrica. Avec plus de 50 Millions de FCFA préparez l'avenir, incubez l'innovation & Un bond en avant dans l'IA.",
    person: "Wilfried Adingra",
    featured: false,
  },
  {
    id: 17,
    number: "N°17",
    title: "L'IA au service de l'agriculture durable en Afrique",
    date: "Mai 2024",
    image: oulaiCover,
    description: "Daniel Oulaï — PDG de la GRAINOTECH SAS, entrepreneur social engagé. +7000 inscrits en 2025 dont 55% venus de l'étranger & Google s'associe à des acteurs tech africains.",
    person: "Daniel Oulaï",
    featured: false,
  },
  {
    id: 16,
    number: "N°16",
    title: "« La littérature est un outil puissant pour toute chose qui demande de s'instruire »",
    date: "Avril 2024",
    image: danonCover,
    description: "Charlène Danon — Journaliste, scénariste-productrice et écrivaine. Financement : 49 jeunes bénéficient de 36 millions à Gagnoa & Gérez votre projet avec MORO.",
    person: "Charlène Danon",
    featured: false,
  },
  {
    id: 15,
    number: "N°15",
    title: "Puissance féminine : Entre ambition et audace",
    date: "Mars 2024",
    image: mylenCharleneCover,
    description: "Mylène Amon (Paper-artist) & Charlène Valmorin (My Place Events & AbidjanaisesInTech). L'IA Africaine anti-fake news & 4 Startups fintech accompagnées.",
    person: "Mylène Amon & Charlène Valmorin",
    featured: false,
  },
  {
    id: 14,
    number: "N°14",
    title: "« C'est le meilleur héritage que je puisse laisser à cette jeunesse »",
    date: "Février 2024",
    image: assaleCover,
    description: "Assalé Tiémoko — Député-Maire de Tiassalé et Président de mouvement ADCI. CI20 MEETUP : Un tournant décisif pour les startups ivoiriennes.",
    person: "Assalé Tiémoko",
    featured: false,
  },
  {
    id: 12,
    number: "N°12",
    title: "Médias, Innovation & Technologie IA transforment nos sociétés africaines",
    date: "Décembre 2024",
    image: gueboCover,
    description: "Israël Guébo — Vice-Président ADCI, Consultant en communication et médias. 20 Jeunes entrepreneurs en Corée du Sud & Sommet SACH 2025.",
    person: "Israël Guébo",
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
    id: 6,
    number: "N°06",
    title: "Passionjob, le chemin d'accès à votre épanouissement !",
    date: "Juin 2023",
    image: auroreCover,
    description: "Axelle Aurore — Choisir de vivre selon ses passions est un passeport pour la réussite ! #Mentorat (Re)Orientation Professionnelle.",
    person: "Axelle Aurore",
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

export interface PartnerItem {
  id?: number | string | undefined;
  name: string;
  logo: string;
  className: string;
  website?: string | undefined;
  order_index?: number | undefined;
  is_active?: boolean | undefined;
}

export interface MetricItem {
  id?: number | string | undefined;
  key: string;
  value: string;
  label: string;
  iconName: string;
  order_index?: number | undefined;
}

export const initialPartners: PartnerItem[] = [
  { id: 1, name: "#Ci20", logo: partner1, className: "h-9 sm:h-11 w-auto max-w-[140px]", is_active: true, order_index: 1 },
  { id: 2, name: "Djoulatchê", logo: partner2, className: "h-10 sm:h-12 w-auto max-w-[140px] rounded-sm", is_active: true, order_index: 2 },
  { id: 3, name: "AKILI", logo: partner3, className: "h-10 sm:h-12 w-auto max-w-[140px]", is_active: true, order_index: 3 },
  { id: 4, name: "Yolicard", logo: partner4, className: "h-8 sm:h-10 w-auto max-w-[140px]", is_active: true, order_index: 4 },
  { id: 5, name: "Fondation BKD", logo: partner5, className: "h-9 sm:h-11 w-auto max-w-[140px]", is_active: true, order_index: 5 },
  { id: 6, name: "moro", logo: partnerMoro, className: "h-9 sm:h-11 w-auto max-w-[140px]", is_active: true, order_index: 6 },
  { id: 7, name: "KOOLBOKS", logo: partnerKoolboks, className: "h-7 sm:h-9 w-auto max-w-[140px]", is_active: true, order_index: 7 },
  { id: 8, name: "Venture Konect", logo: partner7, className: "h-9 sm:h-11 w-auto max-w-[160px]", is_active: true, order_index: 8 },
  { id: 9, name: "INEXIUMUS", logo: partner8, className: "h-8 sm:h-10 w-auto max-w-[160px]", is_active: true, order_index: 9 },
];

export const initialMetrics: MetricItem[] = [
  { id: 1, key: "editions", value: "+31", label: "Éditions publiées", iconName: "Star", order_index: 1 },
  { id: 2, key: "pays", value: "+15", label: "Pays représentés", iconName: "Globe", order_index: 2 },
  { id: 3, key: "leaders", value: "+500", label: "Leaders mis en avant", iconName: "TrendingUp", order_index: 3 },
  { id: 4, key: "digital", value: "100%", label: "Média 100% Digital", iconName: "Zap", order_index: 4 },
];
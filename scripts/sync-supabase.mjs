import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const SUPABASE_URL = "https://uwrcztmhsobwsylsltrv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cmN6dG1oc29id3N5bHNsdHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjM1NTcsImV4cCI6MjEwNDI5OTU1N30.UgqCHCGcD1EwoQifr3K0BDzoWzNPjTReEfma-3jHsqk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const coversData = [
  {
    number: "N°31",
    title: "L'impact comme moteur : Quand le business devient une solution pour tous",
    person: "Joseph-Olivier Biley",
    date: "Septembre 2026",
    file: "JOsephBIley.png",
    description: "Joseph-Olivier Biley — Co-Founder & CEO, Jool International. 125 Millions de dollars ATIDI pour l'investissement en Afrique.",
    featured: true,
    order_index: 1,
  },
  {
    number: "N°30",
    title: "Tout devient digital : Comprendre et maîtriser le virage incontournable",
    person: "Alex Zan Bi",
    date: "Août 2026",
    file: "Alex Zan Bi.jpeg",
    description: "Alex Zan Bi — Entrepreneur Digital & Créateur de Contenu (+300k abonnés). Fondateur Lewa Space & Cofondateur GetMedford.",
    featured: true,
    order_index: 2,
  },
  {
    number: "N°29",
    title: "Quand la technologie tente de structurer l'informel africain",
    person: "Moro Application",
    date: "Mai 2026",
    file: "Moro Application.jpeg",
    description: "Inclusion financière, données et éducation financière : une nouvelle approche pour rendre les micro-entrepreneurs visibles et finançables. 1,7 Milliard FCFA dans l'UEMOA.",
    featured: true,
    order_index: 3,
  },
  {
    number: "N°28",
    title: "Africa's Business Heroes — Le nouveau pouvoir féminin de l'innovation",
    person: "Gwladys Alahassa",
    date: "Avril 2026",
    file: "GWLADYS.jpg",
    description: "Gwladys Alahassa — Directrice Générale Qotto Bénin. Elles déplacent les lignes : le nouveau pouvoir féminin de l'innovation.",
    featured: true,
    order_index: 4,
  },
  {
    number: "N°27",
    title: "L'architecte de la réputation",
    person: "El Hadji Ndoye",
    date: "Mars 2026",
    file: "Ndoye.png",
    description: "El Hadji Ndoye — Expert en Personal Branding pour Entrepreneurs & CEOs. Le CEO qui façonne les leaders de demain. Africa's Business Heroes 2026.",
    featured: true,
    order_index: 5,
  },
  {
    number: "N°26",
    title: "Transformer la passion en entreprise : Le pari lucide des créatifs africains",
    person: "Mohamed Aly Diabaté",
    date: "Février 2026",
    file: "Mohamed Aly Diabaté.jpeg",
    description: "Mohamed Aly Diabaté — Filmmaker, Photojournalist & Manager Visualis Africa. 29 500 Milliards USD de richesses minières & Initiative IA Bill Gates / OpenAI.",
    featured: true,
    order_index: 6,
  },
  {
    number: "N°25",
    title: "Pourquoi les investisseurs misent sur la finance africaine ?",
    person: "Jonathan Ouedraogo",
    date: "Janvier 2025",
    file: "Ouedraogo.png",
    description: "Jonathan Ouedraogo — Banque et Ingénierie Financière, Expert E-commerce. SEDAP & Programme TEF.",
    featured: false,
    order_index: 7,
  },
  {
    number: "N°24",
    title: "Vision, défis et leadership de l'Amazone de l'Énergie",
    person: "Florence Eba",
    date: "Décembre 2024",
    file: "Florence.png",
    description: "Florence Eba — Snr Consultant & Director at Venture Konect. Le Sénégal soutient la Banque Africaine de l'Énergie.",
    featured: false,
    order_index: 8,
  },
  {
    number: "N°23",
    title: "L'écosystème des startups en Côte d'Ivoire",
    person: "Alexia Amicha",
    date: "Août 2024",
    file: "Alexia.jpg",
    description: "Alexia Amicha — Sous-directrice du Développement de l'Entrepreneuriat et des Startups Technologiques.",
    featured: false,
    order_index: 9,
  },
  {
    number: "N°22",
    title: "Transforming life in Africa & CleanTech",
    person: "Deborah Gael",
    date: "Octobre 2024",
    file: "IMPOSE | COVER DEBORAH.png",
    description: "Deborah Gael — Co-Founder and COO of Koolboks. Réfrigération solaire et accélération des énergies durables.",
    featured: false,
    order_index: 10,
  },
  {
    number: "N°22",
    title: "$145 million to boost energy & Finance internationale",
    person: "Brian Hurfet",
    date: "Octobre 2024",
    file: "Bryan.png",
    description: "Brian Hurfet — CEO de BHB Investments & Business Services et African Insights Academy. Ancien banquier d'affaires.",
    featured: false,
    order_index: 11,
  },
  {
    number: "N°21",
    title: "L'inclusion financière dans le contexte africain",
    person: "Darly Nguema",
    date: "Septembre 2025",
    file: "Darly Nguema.jpeg",
    description: "Darly Nguema — Analyste financière. L'accès universel et équitable aux services financiers numériques abordables.",
    featured: false,
    order_index: 12,
  },
  {
    number: "N°21",
    title: "L'univers remarquable des startups en Afrique",
    person: "Alex Degny",
    date: "Juin 2024",
    file: "AlexDegny.jpg",
    description: "Alex Degny — Président du CI20. 20 startups numériques représentent la Côte d'Ivoire à l'international.",
    featured: false,
    order_index: 13,
  },
  {
    number: "N°20",
    title: "Fintech : Vers une révolution inclusive de la finance en Afrique de l'Ouest",
    person: "Régis Zagbadi",
    date: "Août 2025",
    file: " zagbadi.JPG",
    description: "Régis Zagbadi — Expert Risques & Compliance FinTech UEMOA | Fondateur IZAQA. Bientôt les paiements instantanés pour tous, Mobile Money et PI-SPI.",
    featured: true,
    order_index: 14,
  },
  {
    number: "N°19",
    title: "L'art contemporain, entre révolte esthétique et questionnements identitaires",
    person: "Olatidoye Iburaim Olaniyi (Grouilleur 3.0)",
    date: "Juillet 2025",
    file: "Grouilleur3.0.JPG",
    description: "Olatidoye Iburaim Olaniyi — Photographe professionnel. Prix Pierre Castel 2025 : « DJOLI » sacré vainqueur. Le champ du producteur devient notre frigo.",
    featured: false,
    order_index: 15,
  },
  {
    number: "N°18",
    title: "La startup africaine qui redéfinit la mobilité urbaine",
    person: "Wilfried Adingra",
    date: "Juin 2025",
    file: "wilfried Adingra.JPG",
    description: "Wilfried Adingra — Founder & CEO at GLSAfrica. Avec plus de 50 Millions de FCFA préparez l'avenir, incubez l'innovation & Un bond en avant dans l'IA.",
    featured: false,
    order_index: 16,
  },
  {
    number: "N°17",
    title: "L'IA au service de l'agriculture durable en Afrique",
    person: "Daniel Oulaï",
    date: "Mai 2024",
    file: "Daniel Oulai.JPG",
    description: "Daniel Oulaï — PDG de la GRAINOTECH SAS, entrepreneur social engagé. +7000 inscrits en 2025 & Google s'associe à des acteurs tech africains.",
    featured: false,
    order_index: 17,
  },
  {
    number: "N°16",
    title: "« La littérature est un outil puissant pour s'enrichir »",
    person: "Charlène Danon",
    date: "Avril 2024",
    file: "Charlene Danon.JPG",
    description: "Charlène Danon — Journaliste, scénariste-productrice et écrivaine. 49 jeunes bénéficient de 36 millions à Gagnoa & Gérez votre projet avec MORO.",
    featured: false,
    order_index: 18,
  },
  {
    number: "N°15",
    title: "Puissance féminine : Entre ambition et audace",
    person: "Mylène Amon & Charlène Valmorin",
    date: "Mars 2024",
    file: "Mylen & Charlene.JPG",
    description: "Mylène Amon (Paper-artist) & Charlène Valmorin (My Place Events & AbidjanaisesInTech). 4 Startups fintech accompagnées à hauteur de 1 milliard.",
    featured: false,
    order_index: 19,
  },
  {
    number: "N°14",
    title: "« C'est le meilleur héritage que je puisse laisser à cette jeunesse »",
    person: "Assalé Tiémoko",
    date: "Février 2024",
    file: "Assalé Tiémoko.JPG",
    description: "Assalé Tiémoko — Député-Maire de Tiassalé et Président de mouvement ADCI. CI20 MEETUP : Un tournant décisif pour les startups ivoiriennes.",
    featured: false,
    order_index: 20,
  },
  {
    number: "N°12",
    title: "Médias, Innovation & Technologie IA transforment nos sociétés africaines",
    person: "Israël Guébo",
    date: "Décembre 2024",
    file: "Israel Guebo.JPG",
    description: "Israël Guébo — Vice-Président ADCI, Consultant en communication et médias. 20 Jeunes entrepreneurs en Corée du Sud & Sommet SACH 2025.",
    featured: false,
    order_index: 21,
  },
  {
    number: "N°11",
    title: "2 Milliards disponibles pour la jeunesse ivoirienne",
    person: "Stéphane Bolou",
    date: "Novembre 2024",
    file: "Stéphane Bolou.png",
    description: "Stéphane Bolou — Délégué Exécutif #Ci20 | Directeur Fund Management du Fonds Startup Boost Capital.",
    featured: false,
    order_index: 22,
  },
  {
    number: "N°10",
    title: "Des institutions s'engagent dans l'autonomisation des jeunes",
    person: "Olga Djadji",
    date: "Octobre 2024",
    file: "Olga Djadji.jpg",
    description: "Olga Djadji — Présidente de la Fondation BKD (Bénédicte Janine Kacou Diagou). Impacter un million de jeunes.",
    featured: false,
    order_index: 23,
  },
  {
    number: "N°07",
    title: "L'impact de la digitalisation sur la jeunesse africaine",
    person: "Polus Agathon",
    date: "Juillet 2024",
    file: "AgathonPolusa.jpg",
    description: "Polus Agathon — Spécialiste en Communication Digitale, Formateur certifié Méta.",
    featured: false,
    order_index: 24,
  },
  {
    number: "N°06",
    title: "Passionjob, le chemin d'accès à votre épanouissement !",
    person: "Axelle Aurore",
    date: "Juin 2023",
    file: "Axel Aurore.JPG",
    description: "Axelle Aurore — Choisir de vivre selon ses passions est un passeport pour la réussite ! #Mentorat (Re)Orientation Professionnelle.",
    featured: false,
    order_index: 25,
  },
  {
    number: "N°03",
    title: "100 personnalités qui ont changé l'Afrique",
    person: "Jemima Kessie",
    date: "Mars 2023",
    file: "coverImposeJemima copie.jpg",
    description: "Jemima Kessie — Nouvelle génération de communicants en faveur des bonnes conditions des femmes.",
    featured: false,
    order_index: 26,
  },
];

const partnersData = [
  { name: "#Ci20", file: "PartenaireImpose1.png", className: "h-9 sm:h-11 w-auto max-w-[140px]", is_active: true, order_index: 1 },
  { name: "Djoulatchê", file: "PartenaireImpose2.png", className: "h-10 sm:h-12 w-auto max-w-[140px] rounded-sm", is_active: true, order_index: 2 },
  { name: "AKILI", file: "PartenaireImpose3.png", className: "h-10 sm:h-12 w-auto max-w-[140px]", is_active: true, order_index: 3 },
  { name: "Yolicard", file: "PartenaireImpose4.png", className: "h-8 sm:h-10 w-auto max-w-[140px]", is_active: true, order_index: 4 },
  { name: "Fondation BKD", file: "PartenaireImpose5.png", className: "h-9 sm:h-11 w-auto max-w-[140px]", is_active: true, order_index: 5 },
  { name: "moro", file: "PartenaireImpose6.png", className: "h-9 sm:h-11 w-auto max-w-[140px]", is_active: true, order_index: 6 },
  { name: "KOOLBOKS", file: "PartenaireImpose6.png.webp", className: "h-7 sm:h-9 w-auto max-w-[140px]", is_active: true, order_index: 7 },
  { name: "Venture Konect", file: "PartenaireImpose7.png.webp", className: "h-9 sm:h-11 w-auto max-w-[160px]", is_active: true, order_index: 8 },
  { name: "INEXIUMUS", file: "PartenaireImpose8.png", className: "h-8 sm:h-10 w-auto max-w-[160px]", is_active: true, order_index: 9 },
];

async function sync() {
  console.log("🚀 Début de la synchronisation vers Supabase...");

  const baseDir = path.resolve("./src/assets/landingImage");
  const tempDir = path.resolve("./.tmp_covers");
  execSync(`mkdir -p "${tempDir}"`);

  // 1. Upload Covers
  const uploadedCovers = [];
  for (const c of coversData) {
    const srcPath = path.join(baseDir, c.file);
    if (!existsSync(srcPath)) {
      console.warn(`⚠️ Fichier introuvable: ${srcPath}`);
      continue;
    }

    const safeName = c.file.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase().replace(/\.(jpg|jpeg|png)$/, ".jpg");
    const optimizedPath = path.join(tempDir, safeName);

    // Optimize with sips (max 1200px height, 85% jpeg quality)
    try {
      execSync(`sips -Z 1200 -s format jpeg -s formatOptions 85 "${srcPath}" --out "${optimizedPath}" 2>/dev/null`);
    } catch (err) {
      execSync(`sips -s format jpeg "${srcPath}" --out "${optimizedPath}" 2>/dev/null`);
    }

    const fileBuffer = readFileSync(optimizedPath);
    const storageKey = `covers/${safeName}`;

    console.log(`📤 Téléversement de ${c.number} - ${c.person} (${(fileBuffer.length / 1024).toFixed(1)} Ko)...`);
    const { error: uploadErr } = await supabase.storage
      .from("impose-media")
      .upload(storageKey, fileBuffer, { contentType: "image/jpeg", upsert: true });

    if (uploadErr) {
      console.error(`❌ Erreur upload ${storageKey}:`, uploadErr.message);
    }

    const { data: { publicUrl } } = supabase.storage.from("impose-media").getPublicUrl(storageKey);

    uploadedCovers.push({
      number: c.number,
      title: c.title,
      person: c.person,
      date: c.date,
      image_url: publicUrl,
      description: c.description,
      featured: c.featured,
      order_index: c.order_index,
    });
  }

  // 2. Upload Partners
  const uploadedPartners = [];
  for (const p of partnersData) {
    const srcPath = path.join(baseDir, p.file);
    if (!existsSync(srcPath)) continue;

    const safeName = p.file.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
    const fileBuffer = readFileSync(srcPath);
    const storageKey = `partners/${safeName}`;

    await supabase.storage
      .from("impose-media")
      .upload(storageKey, fileBuffer, { upsert: true });

    const { data: { publicUrl } } = supabase.storage.from("impose-media").getPublicUrl(storageKey);

    uploadedPartners.push({
      name: p.name,
      logo_url: publicUrl,
      class_name: p.className,
      website: p.website || "",
      order_index: p.order_index,
      is_active: p.is_active,
    });
  }

  // 3. Clean and Insert into public.covers
  console.log(`\n📦 Enregistrement de ${uploadedCovers.length} couvertures dans la table 'covers'...`);
  const { error: delErr } = await supabase.from("covers").delete().neq("id", 0);
  if (delErr) console.error("Erreur vidage covers:", delErr.message);

  const { data: insertedCovers, error: insErr } = await supabase.from("covers").insert(uploadedCovers).select();
  if (insErr) {
    console.error("❌ Erreur insertion covers:", insErr.message);
  } else {
    console.log(`✅ ${insertedCovers.length} couvertures insérées avec succès dans Supabase !`);
  }

  // 4. Clean and Insert into public.partners
  console.log(`📦 Enregistrement de ${uploadedPartners.length} partenaires dans la table 'partners'...`);
  await supabase.from("partners").delete().neq("id", 0);
  const { data: insertedPartners, error: insPartErr } = await supabase.from("partners").insert(uploadedPartners).select();
  if (insPartErr) {
    console.error("❌ Erreur insertion partners:", insPartErr.message);
  } else {
    console.log(`✅ ${insertedPartners.length} partenaires insérés avec succès dans Supabase !`);
  }

  // Cleanup temp dir
  execSync(`rm -rf "${tempDir}"`);
  console.log("\n🎉 Synchronisation Supabase terminée avec succès pour go.impose-ci.com !");
}

sync();

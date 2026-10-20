import { saveLeadLocally, type LeadData } from "./googleSheets";

// Make.com Custom Webhook URL
export const MAKE_WEBHOOK_URL: string =
  (import.meta.env["VITE_MAKE_WEBHOOK_URL"] as string | undefined)?.trim() ||
  "https://hook.eu1.make.com/q2im41xkrebe7aqal9xov5s29ejyn3ki";

export interface MakeWebhookPayload {
  // Direct English keys
  firstName: string;
  lastName: string;
  fullName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  country: string;
  sector: string;
  objective: string;
  selectedPackage: string;
  selectedPrestations: string[];
  message: string;
  source: string;
  createdAt: string;
  submittedAt: string;

  // French aliases for instant mapping in Make.com scenarios
  prenom: string;
  nom: string;
  nom_complet: string;
  entreprise: string;
  fonction: string;
  telephone: string;
  pays: string;
  secteur: string;
  objectif: string;
  formule: string;
  prestations: string;
}

export interface SendMakeLeadResult {
  success: boolean;
  status?: number;
  error?: string;
}

/**
 * Format lead into payload suitable for Make.com webhook
 */
export function buildMakePayload(
  lead: LeadData,
  options?: { selectedPrestations?: string[] }
): MakeWebhookPayload {
  const now = new Date();
  const prestations = options?.selectedPrestations || [];
  const fullName = `${lead.firstName || ""} ${lead.lastName || ""}`.trim();

  return {
    // English keys
    firstName: lead.firstName || "",
    lastName: lead.lastName || "",
    fullName: fullName || lead.company || "Prospect IMPOSE",
    company: lead.company || "",
    position: lead.position || "Non spécifié",
    email: lead.email || "",
    phone: lead.phone || "",
    country: lead.country || "",
    sector: lead.sector || "",
    objective: lead.objective || "",
    selectedPackage: lead.selectedPackage || "Sur devis",
    selectedPrestations: prestations,
    message: lead.message || "",
    source: lead.source || "Landing Page IMPOSE 100% Digital",
    createdAt: lead.createdAt || now.toISOString(),
    submittedAt: now.toLocaleString("fr-FR", { timeZone: "Africa/Abidjan" }),

    // French aliases for seamless Make.com mapping
    prenom: lead.firstName || "",
    nom: lead.lastName || "",
    nom_complet: fullName || lead.company || "Prospect IMPOSE",
    entreprise: lead.company || "",
    fonction: lead.position || "Non spécifié",
    telephone: lead.phone || "",
    pays: lead.country || "",
    secteur: lead.sector || "",
    objectif: lead.objective || "",
    formule: lead.selectedPackage || "Sur devis",
    prestations: prestations.join(", "),
  };
}

/**
 * Transmit lead to Make.com Webhook with automatic local backup
 */
export async function sendLeadToMake(
  lead: LeadData,
  options?: { selectedPrestations?: string[]; webhookUrl?: string }
): Promise<SendMakeLeadResult> {
  // Always save a local copy as backup first
  saveLeadLocally(lead);

  const targetUrl = (options?.webhookUrl || MAKE_WEBHOOK_URL).trim();

  if (!targetUrl) {
    console.warn("Make.com Webhook URL is not configured. Saved locally.");
    return { success: true };
  }

  const payload = buildMakePayload(lead, options);

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`Make.com webhook returned HTTP status: ${response.status}`);
      return {
        success: false,
        status: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return { success: true, status: response.status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur réseau";
    console.error("Erreur lors de l'envoi vers Make.com Webhook:", err);
    return { success: false, error: message };
  }
}

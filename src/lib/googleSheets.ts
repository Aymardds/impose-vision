export interface LeadData {
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  country: string;
  sector: string;
  objective: string;
  selectedPackage: string;
  message: string;
  source?: string;
  createdAt?: string;
}

// Fallback Google Apps Script URL or configured via environment variable
export const GOOGLE_SHEETS_WEBHOOK_URL =
  (import.meta.env["VITE_GOOGLE_SHEETS_URL"] as string | undefined) || "";

/**
 * Save lead to local backup in localStorage so no contact is ever lost
 */
export function saveLeadLocally(lead: LeadData) {
  try {
    const existing = JSON.parse(localStorage.getItem("impose_leads_backup") || "[]");
    const now = new Date().toISOString();
    const normalized = {
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      first_name: lead.firstName,
      last_name: lead.lastName,
      selected_package: lead.selectedPackage,
      created_at: lead.createdAt || now,
      savedLocallyAt: now,
    };
    existing.unshift(normalized);
    localStorage.setItem("impose_leads_backup", JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn("Could not save lead to localStorage", err);
  }
}

/**
 * Send lead to Google Sheet via Google Apps Script Web App
 */
export async function sendLeadToGoogleSheets(lead: LeadData): Promise<{ success: boolean; error?: string }> {
  // Always save a local copy as backup first
  saveLeadLocally(lead);

  const webhookUrl = GOOGLE_SHEETS_WEBHOOK_URL.trim();

  // If no webhook URL is configured yet, we log and resolve gracefully
  if (!webhookUrl) {
    console.info(
      "Google Sheets Webhook URL not yet configured. The lead was saved locally in backup.",
      lead
    );
    return { success: true };
  }

  try {
    // Google Apps Script requires mode: 'no-cors' or text/plain to avoid CORS preflight blocks
    const payload = {
      date: new Date().toLocaleString("fr-FR", { timeZone: "Africa/Abidjan" }),
      prenom: lead.firstName,
      nom: lead.lastName,
      entreprise: lead.company,
      fonction: lead.position || "Non spécifié",
      email: lead.email,
      telephone: lead.phone,
      pays: lead.country,
      secteur: lead.sector,
      objectif: lead.objective,
      formule: lead.selectedPackage || "Non spécifié",
      message: lead.message,
      source: lead.source || "Landing Page IMPOSE 100% Digital",
    };

    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur de connexion";
    console.error("Erreur lors de l'envoi vers Google Sheets:", err);
    return { success: false, error: message };
  }
}

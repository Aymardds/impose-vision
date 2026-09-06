/**
 * =========================================================================
 * SCRIPT GOOGLE APPS SCRIPT — CAPTURE DE LEADS IMPOSE MAGAZINE
 * =========================================================================
 * 
 * GUIDE DE MISE EN PLACE RAPIDE (2 MINUTES) :
 * 
 * 1. Ouvrez votre compte Google Drive et créez une nouvelle feuille :
 *    "Leads IMPOSE Magazine" (ou ouvrez une feuille existante).
 * 
 * 2. Dans le menu du haut, cliquez sur :
 *    Extensions > Apps Script
 * 
 * 3. Effacez le code existant et collez TOUT le code ci-dessous.
 * 
 * 4. Cliquez sur l'icône de disquette 💾 "Enregistrer le projet".
 * 
 * 5. Cliquez sur le bouton bleu "Déployer" en haut à droite > "Nouveau déploiement".
 *    - Type : Sélectionnez "Application Web" (icône engrenage).
 *    - Description : "Capture de leads IMPOSE"
 *    - Exécuter en tant que : "Moi (votre adresse email)"
 *    - Qui a accès : "Tout le monde" (IMPORTANT : permet au formulaire web d'envoyer les leads).
 * 
 * 6. Cliquez sur "Déployer" et validez les autorisations Google.
 * 
 * 7. Copiez l'URL de l'application Web générée :
 *    Exemple : https://script.google.com/macros/s/AKfycb.../exec
 * 
 * 8. Ajoutez cette URL dans votre fichier `.env` :
 *    VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/AKfycb.../exec
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Verrouille pendant 10s max pour éviter les conflits d'écriture simultanés
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Leads");

    // Crée l'onglet "Leads" s'il n'existe pas encore
    if (!sheet) {
      sheet = ss.insertSheet("Leads");
    }

    // Crée les en-têtes avec style luxe IMPOSE (noir & doré) si la feuille est neuve
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Date & Heure",
        "Prénom",
        "Nom",
        "Entreprise",
        "Fonction",
        "Email",
        "Téléphone / WhatsApp",
        "Pays",
        "Secteur d'activité",
        "Objectif",
        "Formule choisie",
        "Message",
        "Source"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#18181B"); // Fond sombre
      headerRange.setFontColor("#EAB308"); // Texte doré
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Analyse les données envoyées par le formulaire
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Ligne à insérer
    var row = [
      data.date || new Date().toLocaleString("fr-FR", { timeZone: "Africa/Abidjan" }),
      data.prenom || "",
      data.nom || "",
      data.entreprise || "",
      data.fonction || "",
      data.email || "",
      data.telephone || "",
      data.pays || "",
      data.secteur || "",
      data.objectif || "",
      data.formule || "",
      data.message || "",
      data.source || "Landing Page IMPOSE 100% Digital"
    ];

    sheet.appendRow(row);

    // Formatage de la date en colonne 1
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("left");

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", row: lastRow })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "Le Webhook IMPOSE Magazine est actif et fonctionnel." })
  ).setMimeType(ContentService.MimeType.JSON);
}

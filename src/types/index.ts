export interface MondialRelayData {
  'Numéro TouchPoint': string;
  'Intitulé TouchPoint': string;
  'Enseigne': string;
  'Adresse1': string;
  'Ville': string;
  'Code Postal': string;
  'Intitulé Département': string;
  'Latitude': number;
  'Longitude': number;
  'Téléphone': string;
  // Opening hours fields for each day with start/end times for 1st and 2nd periods
  'Heure Début 1ère Période Lundi': string;
  'Heure Fin 1ère Période Lundi': string;
  'Heure Début 2ème Période Lundi': string;
  'Heure Fin 2ème Période Lundi': string;
  'Heure Début 1ère Période Mardi': string;
  'Heure Fin 1ère Période Mardi': string;
  'Heure Début 2ème Période Mardi': string;
  'Heure Fin 2ème Période Mardi': string;
  'Heure Début 1ère Période Mercredi': string;
  'Heure Fin 1ère Période Mercredi': string;
  'Heure Début 2ème Période Mercredi': string;
  'Heure Fin 2ème Période Mercredi': string;
  'Heure Début 1ère Période Jeudi': string;
  'Heure Fin 1ère Période Jeudi': string;
  'Heure Début 2ème Période Jeudi': string;
  'Heure Fin 2ème Période Jeudi': string;
  'Heure Début 1ère Période Vendredi': string;
  'Heure Fin 1ère Période Vendredi': string;
  'Heure Début 2ème Période Vendredi': string;
  'Heure Fin 2ème Période Vendredi': string;
  'Heure Début 1ère Période Samedi': string;
  'Heure Fin 1ère Période Samedi': string;
  'Heure Début 2ème Période Samedi': string;
  'Heure Fin 2ème Période Samedi': string;
  'Heure Début 1ère Période Dimanche': string;
  'Heure Fin 1ère Période Dimanche': string;
  'Heure Début 2ème Période Dimanche': string;
  'Heure Fin 2ème Période Dimanche': string;
  [key: string]: string | number | undefined;
}

// French GMB template structure - exact column names from the template
export interface GMBData {
  'Code de magasin': string;
  "Nom de l'entreprise": string;
  "Ligne d'adresse\u00a01": string;
  "Ligne d'adresse\u00a02": string;
  "Ligne d'adresse\u00a03": string;
  "Ligne d'adresse\u00a04": string;
  "Ligne d'adresse\u00a05": string;
  'Sous-localité': string;
  'Localité': string;
  'Région administrative': string;
  'Pays/Région': string;
  'Code postal': string;
  'Latitude': number;
  'Longitude': number;
  'Numéro principal': string;
  'Autres numéros de téléphone': string;
  'Site Web': string;
  'Catégorie principale': string;
  'Catégories supplémentaires': string;
  'Horaires le dimanche': string;
  'Horaires le lundi': string;
  'Horaires le mardi': string;
  'Horaires le mercredi': string;
  'Horaires le jeudi': string;
  'Horaires le vendredi': string;
  'Horaires le samedi': string;
  "Horaires d'ouverture exceptionnels": string;
  "Fournie par l'établissement": string;
  'Date de création': string;
  'Photo du logo': string;
  'Photo de couverture': string;
  'Autres photos': string;
  'Libellés': string;
  'Numéro de téléphone pour les extensions de lieu AdWords': string;
  "Fournis par l'établissement: S'identifie comme géré par une femme (is_owned_by_women)": string;
  'Paiements: Cartes de crédit (pay_credit_card_types_accepted): American Express (american_express)': string;
  'Paiements: Cartes de crédit (pay_credit_card_types_accepted): MasterCard (mastercard)': string;
  'Paiements: Cartes de crédit (pay_credit_card_types_accepted): VISA (visa)': string;
  'Services: Wi-Fi (wi_fi)': string;
  'URL des pages Google\u00a0Adresses: Lien du menu ou des services (url_menu)': string;
  "URL des pages Google\u00a0Adresses: Liens pour commander à l'avance (url_order_ahead)": string;
}

export interface GlobalInputsType {
  description: string;
  serviceType: string;
}

export type ConversionStep = 'upload' | 'inputs' | 'preview' | 'export';
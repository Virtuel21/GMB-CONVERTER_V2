export interface MondialRelayData {
  'Numéro Relais': string;
  'Adresse1': string;
  'Ville': string;
  'Code Postal': string;
  'Latitude': number;
  'Longitude': number;
  'Enseigne': string;
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
  [key: string]: any;
}

// French GMB template structure - exact column names from the template
export interface GMBData {
  'Code de magasin': string;
  'Nom de l\'entreprise': string;
  'Ligne d\'adresse 1': string;
  'Ligne d\'adresse 2': string;
  'Localité': string;
  'Région administrative': string;
  'Code postal': string;
  'Pays/Région': string;
  'Latitude': number;
  'Longitude': number;
  'Catégorie principale': string;
  'Catégories supplémentaires': string;
  'Site Web': string;
  'Téléphone': string;
  'Description fournie par l\'établissement': string;
  'Horaires le lundi': string;
  'Horaires le mardi': string;
  'Horaires le mercredi': string;
  'Horaires le jeudi': string;
  'Horaires le vendredi': string;
  'Horaires le samedi': string;
  'Horaires le dimanche': string;
}

export interface GlobalInputsType {
  description: string;
  serviceType: string;
}

export type ConversionStep = 'upload' | 'inputs' | 'preview' | 'export';
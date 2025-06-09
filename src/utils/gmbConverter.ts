import { MondialRelayData, GMBData, GlobalInputsType } from '../types';

const formatTime = (time: string): string => {
  if (!time || time === '00:00:00' || time === '00:00') return '';
  
  // Handle different time formats
  const cleanTime = time.trim();
  
  // If it's already in HH:MM format, return as is
  if (/^\d{2}:\d{2}$/.test(cleanTime)) {
    return cleanTime;
  }
  
  // If it's in HH:MM:SS format, remove seconds
  if (/^\d{2}:\d{2}:\d{2}$/.test(cleanTime)) {
    return cleanTime.substring(0, 5);
  }
  
  // If it's in H:MM or H:MM:SS format, add leading zero
  if (/^\d:\d{2}(:\d{2})?$/.test(cleanTime)) {
    return '0' + cleanTime.substring(0, cleanTime.indexOf(':') + 3);
  }
  
  return '';
};

const isValidTime = (time: string): boolean => {
  const formatted = formatTime(time);
  return formatted !== '' && formatted !== '00:00';
};

const convertDayOpeningHours = (
  start1: string, 
  end1: string, 
  start2: string, 
  end2: string
): string => {
  const formattedStart1 = formatTime(start1);
  const formattedEnd1 = formatTime(end1);
  const formattedStart2 = formatTime(start2);
  const formattedEnd2 = formatTime(end2);
  
  const period1Valid = isValidTime(start1) && isValidTime(end1);
  const period2Valid = isValidTime(start2) && isValidTime(end2);
  
  // Check for full day (00:00 to 24:00 or 00:00 to 00:00 next day)
  if ((formattedStart1 === '00:00' && formattedEnd1 === '24:00') ||
      (formattedStart1 === '00:00' && formattedEnd2 === '24:00') ||
      (formattedStart2 === '00:00' && formattedEnd2 === '24:00')) {
    return '00:00-24:00';
  }
  
  // If both periods are valid
  if (period1Valid && period2Valid) {
    return `${formattedStart1}-${formattedEnd1},${formattedStart2}-${formattedEnd2}`;
  }
  
  // If only first period is valid
  if (period1Valid && !period2Valid) {
    return `${formattedStart1}-${formattedEnd1}`;
  }
  
  // If only second period is valid
  if (!period1Valid && period2Valid) {
    return `${formattedStart2}-${formattedEnd2}`;
  }
  
  // If no valid periods, return empty (closed)
  return '';
};

export const convertToGMBFormat = (
  mondialData: MondialRelayData[], 
  globalInputs: GlobalInputsType
): GMBData[] => {
  return mondialData.map((location) => {
    // Convert opening hours for each day using the new format
    const mondayHours = convertDayOpeningHours(
      location['Heure Début 1ère Période Lundi'] || '',
      location['Heure Fin 1ère Période Lundi'] || '',
      location['Heure Début 2ème Période Lundi'] || '',
      location['Heure Fin 2ème Période Lundi'] || ''
    );
    
    const tuesdayHours = convertDayOpeningHours(
      location['Heure Début 1ère Période Mardi'] || '',
      location['Heure Fin 1ère Période Mardi'] || '',
      location['Heure Début 2ème Période Mardi'] || '',
      location['Heure Fin 2ème Période Mardi'] || ''
    );
    
    const wednesdayHours = convertDayOpeningHours(
      location['Heure Début 1ère Période Mercredi'] || '',
      location['Heure Fin 1ère Période Mercredi'] || '',
      location['Heure Début 2ème Période Mercredi'] || '',
      location['Heure Fin 2ème Période Mercredi'] || ''
    );
    
    const thursdayHours = convertDayOpeningHours(
      location['Heure Début 1ère Période Jeudi'] || '',
      location['Heure Fin 1ère Période Jeudi'] || '',
      location['Heure Début 2ème Période Jeudi'] || '',
      location['Heure Fin 2ème Période Jeudi'] || ''
    );
    
    const fridayHours = convertDayOpeningHours(
      location['Heure Début 1ère Période Vendredi'] || '',
      location['Heure Fin 1ère Période Vendredi'] || '',
      location['Heure Début 2ème Période Vendredi'] || '',
      location['Heure Fin 2ème Période Vendredi'] || ''
    );
    
    const saturdayHours = convertDayOpeningHours(
      location['Heure Début 1ère Période Samedi'] || '',
      location['Heure Fin 1ère Période Samedi'] || '',
      location['Heure Début 2ème Période Samedi'] || '',
      location['Heure Fin 2ème Période Samedi'] || ''
    );
    
    const sundayHours = convertDayOpeningHours(
      location['Heure Début 1ère Période Dimanche'] || '',
      location['Heure Fin 1ère Période Dimanche'] || '',
      location['Heure Début 2ème Période Dimanche'] || '',
      location['Heure Fin 2ème Période Dimanche'] || ''
    );

    // Return data using exact French GMB column names
    return {
      'Code de magasin': location['Numéro Relais'] || '',
      "Nom de l'entreprise": location['Enseigne'] || '',
      "Ligne d'adresse\u00a01": location['Adresse1'] || '',
      "Ligne d'adresse\u00a02": '',
      "Ligne d'adresse\u00a03": '',
      "Ligne d'adresse\u00a04": '',
      "Ligne d'adresse\u00a05": '',
      'Sous-localité': '',
      'Localité': location['Ville'] || '',
      'Région administrative': '',
      'Pays/Région': 'France',
      'Code postal': location['Code Postal'] || '',
      'Latitude': parseFloat(location['Latitude']) || 0,
      'Longitude': parseFloat(location['Longitude']) || 0,
      'Numéro principal': '',
      'Autres numéros de téléphone': '',
      'Site Web': '',
      'Catégorie principale': globalInputs.serviceType,
      'Catégories supplémentaires': '',
      'Horaires le dimanche': sundayHours,
      'Horaires le lundi': mondayHours,
      'Horaires le mardi': tuesdayHours,
      'Horaires le mercredi': wednesdayHours,
      'Horaires le jeudi': thursdayHours,
      'Horaires le vendredi': fridayHours,
      'Horaires le samedi': saturdayHours,
      "Horaires d'ouverture exceptionnels": '',
      "Fournie par l'établissement": globalInputs.description,
      'Date de création': '',
      'Photo du logo': '',
      'Photo de couverture': '',
      'Autres photos': '',
      'Libellés': '',
      'Numéro de téléphone pour les extensions de lieu AdWords': '',
      "Fournis par l'établissement: S'identifie comme géré par une femme (is_owned_by_women)": '',
      'Paiements: Cartes de crédit (pay_credit_card_types_accepted): American Express (american_express)': '',
      'Paiements: Cartes de crédit (pay_credit_card_types_accepted): MasterCard (mastercard)': '',
      'Paiements: Cartes de crédit (pay_credit_card_types_accepted): VISA (visa)': '',
      'Services: Wi-Fi (wi_fi)': '',
      'URL des pages Google\u00a0Adresses: Lien du menu ou des services (url_menu)': '',
      "URL des pages Google\u00a0Adresses: Liens pour commander à l'avance (url_order_ahead)": ''
    };
  });
};
import { MondialRelayData, GMBData, GlobalInputsType } from '../types';

const toTimeString = (value: string | number | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'number') {
    const totalMinutes = Math.round(value * 24 * 60);
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return String(value);
};

const formatTime = (time: string | number | undefined): string => {
  const str = toTimeString(time);
  if (!str || str === '00:00:00' || str === '00:00') return '';

  const cleanTime = str.trim();
  
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

const isValidTime = (time: string | number | undefined): boolean => {
  const formatted = formatTime(time);
  return formatted !== '' && formatted !== '00:00';
};

const convertDayOpeningHours = (
  start1: string | number | undefined,
  end1: string | number | undefined,
  start2: string | number | undefined,
  end2: string | number | undefined
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
  console.log('[gmbConverter] Converting', mondialData.length, 'rows');
  return mondialData.map((location) => {
    // Convert opening hours for each day using the new format
    const mondayHours = convertDayOpeningHours(
      location['Heure début 1ère période Lundi'] || '',
      location['Heure fin 1ère période Lundi'] || '',
      location['Heure début 2ème période Lundi'] || '',
      location['Heure fin 2ème période Lundi'] || ''
    );

    const tuesdayHours = convertDayOpeningHours(
      location['Heure début 1ère période Mardi'] || '',
      location['Heure fin 1ère période Mardi'] || location['Heure fin 2ème période Mardi'] || '',
      location['Heure début 2ème période Mardi'] || '',
      location['Heure fin 2ème période Mardi'] || ''
    );

    const wednesdayHours = convertDayOpeningHours(
      location['Heure début 1ère période Mercredi'] || '',
      location['Heure fin 1ère période Mercredi'] || '',
      location['Heure début 2ème période Mercredi'] || '',
      location['Heure fin 2ème période Mercredi'] || ''
    );

    const thursdayHours = convertDayOpeningHours(
      location['Heure début 1ère période Jeudi'] || '',
      location['Heure fin 1ère période Jeudi'] || '',
      location['Heure début 2ème période Jeudi'] || '',
      location['Heure fin 2ème période Jeudi'] || ''
    );

    const fridayHours = convertDayOpeningHours(
      location['Heure début 1ère période Vendredi'] || '',
      location['Heure fin 1ère période Vendredi'] || '',
      location['Heure début 2ème période Vendredi'] || '',
      location['Heure fin 2ème période Vendredi'] || ''
    );

    const saturdayHours = convertDayOpeningHours(
      location['Heure début 1ère période Samedi'] || '',
      location['Heure fin 1ère période Samedi'] || '',
      location['Heure début 2ème période Samedi'] || '',
      location['Heure fin 2ème période Samedi'] || ''
    );

    const sundayHours = convertDayOpeningHours(
      location['Heure début 1ère période Dimanche'] || '',
      location['Heure fin 1ère période Dimanche'] || '',
      location['Heure début 2ème période Dimanche'] || '',
      location['Heure fin 2ème période Dimanche'] || ''
    );

    // Return data using exact French GMB column names
    return {
      'Code de magasin': location['Numéro TouchPoint'] || '',
      "Nom de l'entreprise": location['Enseigne'] || location['Intitulé TouchPoint'] || '',
      "Ligne d'adresse\u00a01": location['Adresse1'] || '',
      "Ligne d'adresse\u00a02": '',
      "Ligne d'adresse\u00a03": '',
      "Ligne d'adresse\u00a04": '',
      "Ligne d'adresse\u00a05": '',
      'Sous-localité': '',
      'Localité': location['Ville'] || '',
      'Région administrative': location['Intitulé Département'] || '',
      'Pays/Région': 'France',
      'Code postal': location['Code Postal'] || '',
      'Latitude': parseFloat(String(location['Latitude'])) || 0,
      'Longitude': parseFloat(String(location['Longitude'])) || 0,
      'Numéro principal': location['Téléphone'] || '',
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
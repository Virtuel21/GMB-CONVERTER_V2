import * as XLSX from 'xlsx';
import { GMBData } from '../types';

export const exportToGMBExcel = (data: GMBData[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Define the exact column order from the French GMB template
      const columnOrder = [
        'Code de magasin',
        "Nom de l'entreprise",
        "Ligne d'adresse\u00a01",
        "Ligne d'adresse\u00a02",
        "Ligne d'adresse\u00a03",
        "Ligne d'adresse\u00a04",
        "Ligne d'adresse\u00a05",
        'Sous-localité',
        'Localité',
        'Région administrative',
        'Pays/Région',
        'Code postal',
        'Latitude',
        'Longitude',
        'Numéro principal',
        'Autres numéros de téléphone',
        'Site Web',
        'Catégorie principale',
        'Catégories supplémentaires',
        'Horaires le dimanche',
        'Horaires le lundi',
        'Horaires le mardi',
        'Horaires le mercredi',
        'Horaires le jeudi',
        'Horaires le vendredi',
        'Horaires le samedi',
        "Horaires d'ouverture exceptionnels",
        "Fournie par l'établissement",
        'Date de création',
        'Photo du logo',
        'Photo de couverture',
        'Autres photos',
        'Libellés',
        'Numéro de téléphone pour les extensions de lieu AdWords',
        "Fournis par l'établissement: S'identifie comme géré par une femme (is_owned_by_women)",
        'Paiements: Cartes de crédit (pay_credit_card_types_accepted): American Express (american_express)',
        'Paiements: Cartes de crédit (pay_credit_card_types_accepted): MasterCard (mastercard)',
        'Paiements: Cartes de crédit (pay_credit_card_types_accepted): VISA (visa)',
        'Services: Wi-Fi (wi_fi)',
        'URL des pages Google\u00a0Adresses: Lien du menu ou des services (url_menu)',
        "URL des pages Google\u00a0Adresses: Liens pour commander à l'avance (url_order_ahead)"
      ];
      
      // Create header row
      const wsData = [columnOrder];
      
      // Add data rows in the correct order
      data.forEach(location => {
        const row = columnOrder.map(column => location[column as keyof GMBData] || '');
        wsData.push(row);
      });
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Set column widths for better readability
      const colWidths = columnOrder.map(() => ({ wch: 20 }));
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Import GMB');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Import_GMB_${timestamp}.xlsx`;
      
      // Write and download the file
      XLSX.writeFile(wb, filename);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
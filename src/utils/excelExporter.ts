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
        'Nom de l\'entreprise',
        'Ligne d\'adresse 1',
        'Ligne d\'adresse 2',
        'Localité',
        'Région administrative',
        'Code postal',
        'Pays/Région',
        'Latitude',
        'Longitude',
        'Catégorie principale',
        'Catégories supplémentaires',
        'Site Web',
        'Téléphone',
        'Description fournie par l\'établissement',
        'Horaires le lundi',
        'Horaires le mardi',
        'Horaires le mercredi',
        'Horaires le jeudi',
        'Horaires le vendredi',
        'Horaires le samedi',
        'Horaires le dimanche'
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
      const colWidths = [
        { wch: 15 }, // Code de magasin
        { wch: 30 }, // Nom de l'entreprise
        { wch: 40 }, // Ligne d'adresse 1
        { wch: 25 }, // Ligne d'adresse 2
        { wch: 20 }, // Localité
        { wch: 20 }, // Région administrative
        { wch: 12 }, // Code postal
        { wch: 15 }, // Pays/Région
        { wch: 12 }, // Latitude
        { wch: 12 }, // Longitude
        { wch: 25 }, // Catégorie principale
        { wch: 30 }, // Catégories supplémentaires
        { wch: 30 }, // Site Web
        { wch: 15 }, // Téléphone
        { wch: 50 }, // Description fournie par l'établissement
        { wch: 18 }, // Horaires le lundi
        { wch: 18 }, // Horaires le mardi
        { wch: 18 }, // Horaires le mercredi
        { wch: 18 }, // Horaires le jeudi
        { wch: 18 }, // Horaires le vendredi
        { wch: 18 }, // Horaires le samedi
        { wch: 18 }  // Horaires le dimanche
      ];
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
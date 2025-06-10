import * as XLSX from 'xlsx';
import { MondialRelayData } from '../types';

export const processExcelFile = (file: File): Promise<MondialRelayData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          throw new Error('File appears to be empty or invalid');
        }
        
        // Get headers from first row
        const headers = jsonData[0] as string[];
        
        // Validate required columns
        const requiredColumns = [
          'Numéro TouchPoint',
          'Intitulé TouchPoint',
          'Adresse1',
          'Ville',
          'Code Postal',
          'Intitulé Département',
          'Latitude',
          'Longitude',
          'Téléphone'
        ];
        
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }
        
        // Convert rows to objects
        const processedData: MondialRelayData[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as (string | number | undefined)[];
          if (row.length === 0) continue; // Skip empty rows

          const rowData: Record<string, string | number> = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index] || '';
          });
          
          // Ensure required fields have values
          if (rowData['Numéro TouchPoint'] && rowData['Adresse1'] && rowData['Ville']) {
            processedData.push(rowData as MondialRelayData);
          }
        }
        
        if (processedData.length === 0) {
          throw new Error('No valid data rows found in the file');
        }
        
        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};
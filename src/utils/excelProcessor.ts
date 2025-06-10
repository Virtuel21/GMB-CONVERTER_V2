import * as XLSX from 'xlsx';
import { MondialRelayData } from '../types';

export const processExcelFile = (file: File): Promise<MondialRelayData[]> => {
  console.log('[excelProcessor] Loading file:', file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        console.log('[excelProcessor] Workbook loaded');

        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        console.log('[excelProcessor] Using sheet:', worksheetName);
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
          'Enseigne',
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
          console.error('[excelProcessor] Missing columns:', missingColumns);
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }
        console.log('[excelProcessor] Required columns validated');
        
        // Convert rows to objects
        const processedData: MondialRelayData[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as (string | number | undefined)[];
          if (!row || row.every(cell => cell === undefined || cell === '')) continue; // Skip empty rows

          const rowData: Record<string, string | number> = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index] ?? '';
          });

          // Only require the TouchPoint id to consider the row valid
          if (rowData['Numéro TouchPoint']) {
            processedData.push(rowData as MondialRelayData);
          }
        }
        
        if (processedData.length === 0) {
          console.error('[excelProcessor] No valid data rows found');
          throw new Error('No valid data rows found in the file');
        }

        console.log(`[excelProcessor] Processed ${processedData.length} rows`);
        resolve(processedData);
      } catch (error) {
        console.error('[excelProcessor] Error while processing file', error);
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

import * as XLSX from 'xlsx';
import { GMBData } from '../types';

export const readGMBExcel = (file: File): Promise<GMBData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (jsonData.length < 2) {
          throw new Error('File appears to be empty or invalid');
        }

        const headers = jsonData[0] as string[];
        const processed: GMBData[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as (string | number | undefined)[];
          if (row.length === 0) continue;

          const rowData: Record<string, string | number> = {};
          headers.forEach((h, idx) => {
            rowData[h] = row[idx] || '';
          });
          if (rowData['Code de magasin']) {
            processed.push(rowData as unknown as GMBData);
          }
        }

        resolve(processed);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

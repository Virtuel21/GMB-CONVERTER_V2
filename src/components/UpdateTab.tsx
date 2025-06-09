import React, { useState, useCallback } from 'react';
import { GMBData } from '../types';
import { readGMBExcel } from '../utils/gmbExcelReader';
import { exportToGMBExcel } from '../utils/excelExporter';

const canonical = (value: string): string => value.toLowerCase().replace(/\s+/g, '');

export const UpdateTab: React.FC = () => {
  const [currentData, setCurrentData] = useState<GMBData[]>([]);
  const [generatedData, setGeneratedData] = useState<GMBData[]>([]);
  const [stats, setStats] = useState<{ newCount: number; duplicateCount: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCurrentUpload = useCallback(async (file: File) => {
    try {
      const data = await readGMBExcel(file);
      setCurrentData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to read current listings file');
    }
  }, []);

  const handleGeneratedUpload = useCallback(async (file: File) => {
    try {
      const data = await readGMBExcel(file);
      setGeneratedData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to read generated listings file');
    }
  }, []);

  const handleCompare = async () => {
    setIsProcessing(true);
    try {
      const existingCodes = new Set(currentData.map(l => canonical(String(l['Code de magasin'] || ''))));
      let duplicateCount = 0;
      const newRows = generatedData.filter(row => {
        const code = canonical(String(row['Code de magasin'] || ''));
        if (existingCodes.has(code)) {
          duplicateCount += 1;
          return false;
        }
        return true;
      });

      setStats({ newCount: newRows.length, duplicateCount });
      if (newRows.length > 0) {
        await exportToGMBExcel(newRows, 'gmb_update_only');
      } else {
        alert('No new locations found');
      }
    } catch (err) {
      console.error(err);
      alert('Comparison failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Current GMB Listings</h2>
          <input type="file" accept=".xlsx,.xls" onChange={e => e.target.files && handleCurrentUpload(e.target.files[0])} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">New Generated Listings</h2>
          <input type="file" accept=".xlsx,.xls" onChange={e => e.target.files && handleGeneratedUpload(e.target.files[0])} />
        </div>
        <button
          onClick={handleCompare}
          disabled={isProcessing || currentData.length === 0 || generatedData.length === 0}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Compare & Generate Update File'}
        </button>
        {stats && (
          <div className="text-sm text-slate-700">
            {stats.newCount} new locations identified, {stats.duplicateCount} duplicates skipped
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { GMBData } from '../types';
import { readGMBExcel } from '../utils/gmbExcelReader';
import { exportToGMBExcel } from '../utils/excelExporter';
import { optimizeSeo, SeoOptions } from '../utils/seoOptimizer';
import { removeAccentsFromData } from '../utils/diacritic';

export const SeoTab: React.FC = () => {
  const [originalData, setOriginalData] = useState<GMBData[]>([]);
  const [optimizedData, setOptimizedData] = useState<GMBData[]>([]);
  const [template, setTemplate] = useState('Locker Mondial Relay 24/7 - {Ville}');
  const [options, setOptions] = useState<Omit<SeoOptions, 'template'>>({
    includeCity: true,
    includePostalCode: true,
    includeStreet: true,
    removeSpecial: true,
    capitalize: true
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    try {
      const data = await readGMBExcel(file);
      setOriginalData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to read file');
    }
  }, []);

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOptimize = () => {
    setIsProcessing(true);
    try {
      const data = optimizeSeo(originalData, { template, ...options });
      setOptimizedData(data);
    } catch (err) {
      console.error(err);
      alert('Optimization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    await exportToGMBExcel(optimizedData, 'gmb_seo_optimized');
  };

  const handleRemoveAccents = () => {
    setOriginalData(prev => removeAccentsFromData(prev as any) as unknown as GMBData[]);
    setOptimizedData(prev => removeAccentsFromData(prev as any) as unknown as GMBData[]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Fichier GMB existant</h2>
          <input type="file" accept=".xlsx,.xls" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1">Template de nom</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeCity}
              onChange={() => toggleOption('includeCity')}
            />
            <span>Ajouter la ville ({'{Ville}'})</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includePostalCode}
              onChange={() => toggleOption('includePostalCode')}
            />
            <span>Ajouter le code postal ({'{CP}'})</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeStreet}
              onChange={() => toggleOption('includeStreet')}
            />
            <span>Ajouter la rue ({'{Adresse}'})</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.removeSpecial}
              onChange={() => toggleOption('removeSpecial')}
            />
            <span>Supprimer les caractères spéciaux</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.capitalize}
              onChange={() => toggleOption('capitalize')}
            />
            <span>Capitaliser la première lettre de chaque mot</span>
          </label>
        </div>
        <button
          onClick={handleRemoveAccents}
          disabled={originalData.length === 0}
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Supprimer les accents du fichier
        </button>
        <button
          onClick={handleOptimize}
          disabled={isProcessing || originalData.length === 0}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? 'Traitement...' : 'Appliquer les optimisations'}
        </button>
        {optimizedData.length > 0 && (
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
          >
            Exporter le fichier optimisé
          </button>
        )}
      </div>
    </div>
  );
};

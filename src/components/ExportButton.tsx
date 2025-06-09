import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { exportToGMBExcel } from '../utils/excelExporter';
import { GMBData } from '../types';

interface ExportButtonProps {
  data: GMBData[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToGMBExcel(data);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || data.length === 0}
      className={`
        inline-flex items-center px-6 py-3 font-medium rounded-lg transition-all duration-200 transform hover:scale-105
        ${exported 
          ? 'bg-green-600 text-white' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      `}
    >
      {isExporting ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          Exporting...
        </>
      ) : exported ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Exported!
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Export GMB Excel
        </>
      )}
    </button>
  );
};
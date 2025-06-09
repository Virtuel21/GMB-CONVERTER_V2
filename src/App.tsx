import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { GlobalInputs } from './components/GlobalInputs';
import { DataPreview } from './components/DataPreview';
import { ConversionStatus } from './components/ConversionStatus';
import { ExportButton } from './components/ExportButton';
import { UpdateTab } from './components/UpdateTab';
import { SeoTab } from './components/SeoTab';
import { processExcelFile } from './utils/excelProcessor';
import { convertToGMBFormat } from './utils/gmbConverter';
import { MondialRelayData, GMBData, GlobalInputsType } from './types';

function App() {
  const [originalData, setOriginalData] = useState<MondialRelayData[]>([]);
  const [convertedData, setConvertedData] = useState<GMBData[]>([]);
  const [globalInputs, setGlobalInputs] = useState<GlobalInputsType>({
    description: '',
    serviceType: 'Consigne automatique',
  });
  const [activeTab, setActiveTab] = useState<'convert' | 'update' | 'seo'>('convert');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'inputs' | 'preview' | 'export'>('upload');

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const data = await processExcelFile(file);
      setOriginalData(data);
      setCurrentStep('inputs');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Erreur lors du traitement du fichier. Veuillez vérifier le format et réessayer.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleConvert = useCallback(() => {
    setIsProcessing(true);
    try {
      const converted = convertToGMBFormat(originalData, globalInputs);
      setConvertedData(converted);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error converting data:', error);
      alert('Erreur lors de la conversion des données. Veuillez vérifier vos paramètres et réessayer.');
    } finally {
      setIsProcessing(false);
    }
  }, [originalData, globalInputs]);

  const handleReset = () => {
    setOriginalData([]);
    setConvertedData([]);
    setCurrentStep('upload');
    setGlobalInputs({
      description: '',
      serviceType: 'Consigne automatique',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Convertisseur Mondial Relay → GMB
              </h1>
              <p className="text-slate-600 mt-1">
                Convertissez les fichiers Excel Mondial Relay au format d'import Google My Business
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('convert')}
                className={`px-3 py-2 rounded-lg ${activeTab === 'convert' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Convertir
              </button>
              <button
                onClick={() => setActiveTab('update')}
                className={`px-3 py-2 rounded-lg ${activeTab === 'update' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Update
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-3 py-2 rounded-lg ${activeTab === 'seo' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                Optimisation SEO
              </button>
              {activeTab === 'convert' && currentStep !== 'upload' && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Recommencer
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'convert' && (
          <>
            {/* Progress Steps */}
            <ConversionStatus currentStep={currentStep} />

            <div className="mt-8 space-y-8">
              {/* Step 1: File Upload */}
              {currentStep === 'upload' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                      Télécharger le fichier Excel Mondial Relay
                    </h2>
                    <p className="text-slate-600">
                      Sélectionnez votre fichier Excel Mondial Relay pour commencer le processus de conversion
                    </p>
                  </div>
                  <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
                </div>
              )}

              {/* Step 2: Global Inputs */}
              {currentStep === 'inputs' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                      Configurer les paramètres globaux
                    </h2>
                    <p className="text-slate-600">
                      Ces paramètres seront appliqués à tous les emplacements de votre fichier
                    </p>
                  </div>
                  <GlobalInputs
                    values={globalInputs}
                    onChange={setGlobalInputs}
                    onConvert={handleConvert}
                    isProcessing={isProcessing}
                    dataCount={originalData.length}
                  />
                </div>
              )}

              {/* Step 3: Data Preview */}
              {currentStep === 'preview' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                          Aperçu des données converties
                        </h2>
                        <p className="text-slate-600">
                          Vérifiez les données converties avant l'export au format GMB
                        </p>
                      </div>
                      <ExportButton data={convertedData} />
                    </div>
                    <DataPreview data={convertedData} />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'update' && <UpdateTab />}
        {activeTab === 'seo' && <SeoTab />}
      </main>
    </div>
  );
}

export default App;
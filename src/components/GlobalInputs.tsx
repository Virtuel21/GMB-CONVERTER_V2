import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { GlobalInputsType } from '../types';

interface GlobalInputsProps {
  values: GlobalInputsType;
  onChange: (values: GlobalInputsType) => void;
  onConvert: () => void;
  isProcessing: boolean;
  dataCount: number;
}

export const GlobalInputs: React.FC<GlobalInputsProps> = ({
  values,
  onChange,
  onConvert,
  isProcessing,
  dataCount
}) => {
  const serviceTypes = [
    'Consigne automatique',
    'Point relais',
    'Point de retrait',
    'Centre de distribution',
    'Point de collecte'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Data Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <p className="text-blue-800">
            <span className="font-semibold">{dataCount}</span> emplacements chargés et prêts pour la conversion
          </p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Description fournie par l'établissement
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Entrez une description qui sera appliquée à tous les emplacements (ex: 'Point relais Mondial Relay pour la livraison et la collecte de colis')"
            value={values.description}
            onChange={(e) => onChange({ ...values, description: e.target.value })}
          />
          <p className="text-sm text-slate-500 mt-1">
            Cette description sera appliquée à tous les emplacements de votre fichier
          </p>
        </div>

        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-slate-700 mb-2">
            Catégorie principale
          </label>
          <select
            id="serviceType"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={values.serviceType}
            onChange={(e) => onChange({ ...values, serviceType: e.target.value })}
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <p className="text-sm text-slate-500 mt-1">
            Sélectionnez la catégorie d'entreprise principale pour tous les emplacements
          </p>
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onConvert}
          disabled={isProcessing || !values.description.trim()}
          className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Conversion en cours...
            </>
          ) : (
            <>
              Convertir au format GMB
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>

      {!values.description.trim() && (
        <p className="text-center text-sm text-slate-500">
          Veuillez entrer une description pour continuer
        </p>
      )}
    </div>
  );
};
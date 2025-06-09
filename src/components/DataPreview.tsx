import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, MapPin, Clock } from 'lucide-react';
import { GMBData } from '../types';

interface DataPreviewProps {
  data: GMBData[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<GMBData | null>(null);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const formatHours = (hours: string) => {
    if (!hours || hours === '') return 'Fermé';
    return hours;
  };

  const getHoursStatus = (hours: string) => {
    if (!hours || hours === '') return 'closed';
    if (hours === '00:00-24:00') return 'always-open';
    return 'open';
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-green-600 mr-2" />
          <p className="text-green-800">
            <span className="font-semibold">{data.length}</span> emplacements convertis avec succès au format GMB
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nom de l'entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Code de magasin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {currentData.map((location, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{location['Nom de l\'entreprise']}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {location['Ligne d\'adresse 1']}
                    </div>
                    <div className="text-sm text-slate-500">
                      {location['Localité']}, {location['Code postal']}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {location['Code de magasin']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {location['Catégorie principale']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLocation(location)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir les détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-slate-700">
                  Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(endIndex, data.length)}</span> sur{' '}
                  <span className="font-medium">{data.length}</span> résultats
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-700">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  Détails de l'emplacement
                </h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Informations de base</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Nom de l'entreprise :</span>
                      <p className="font-medium">{selectedLocation['Nom de l\'entreprise']}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Code de magasin :</span>
                      <p className="font-medium">{selectedLocation['Code de magasin']}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Catégorie :</span>
                      <p className="font-medium">{selectedLocation['Catégorie principale']}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Coordonnées :</span>
                      <p className="font-medium">{selectedLocation['Latitude']}, {selectedLocation['Longitude']}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Adresse</h4>
                  <div className="text-sm space-y-1">
                    <p>{selectedLocation['Ligne d\'adresse 1']}</p>
                    <p>{selectedLocation['Localité']}, {selectedLocation['Code postal']}</p>
                    <p>{selectedLocation['Pays/Région']}</p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Horaires d'ouverture
                  </h4>
                  <div className="space-y-2">
                    {[
                      { day: 'Lundi', hours: selectedLocation['Horaires le lundi'] },
                      { day: 'Mardi', hours: selectedLocation['Horaires le mardi'] },
                      { day: 'Mercredi', hours: selectedLocation['Horaires le mercredi'] },
                      { day: 'Jeudi', hours: selectedLocation['Horaires le jeudi'] },
                      { day: 'Vendredi', hours: selectedLocation['Horaires le vendredi'] },
                      { day: 'Samedi', hours: selectedLocation['Horaires le samedi'] },
                      { day: 'Dimanche', hours: selectedLocation['Horaires le dimanche'] }
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex justify-between items-center py-1">
                        <span className="text-slate-600 font-medium">{day}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          getHoursStatus(hours) === 'closed' 
                            ? 'bg-red-100 text-red-700'
                            : getHoursStatus(hours) === 'always-open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {formatHours(hours)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selectedLocation['Description fournie par l\'établissement'] && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Description</h4>
                    <p className="text-sm text-slate-600">{selectedLocation['Description fournie par l\'établissement']}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
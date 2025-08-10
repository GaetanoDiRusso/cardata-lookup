import React from 'react';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { 
  getStatusColor, 
  getStatusIcon, 
  getStatusText, 
  getAvailableMedia, 
  handleViewMedia 
} from '../utils/dataRetrievalUtils';
import { DataRetrievalStatusRenderer } from '../DataRetrievalStatusRenderer';

export type DataRetrievalResultsProps = {
  existingRetrievals: PVehicleDataRetrieval[];
  retrievalType: VehicleDataRetrievalType;
};

export const DataRetrievalResults: React.FC<DataRetrievalResultsProps> = ({
  existingRetrievals,
  retrievalType
}) => {
  const hasResults = existingRetrievals.length > 0;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">📋</span>
        {hasResults ? `Resultados (${existingRetrievals.length})` : 'Sin resultados'}
      </h4>
      
      {hasResults ? (
        <div className="space-y-3">
          {existingRetrievals.map((retrieval) => {
            const availableMedia = getAvailableMedia(retrieval);
            
            return (
              <div key={retrieval.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(retrieval.status)}`}>
                      <span className="mr-1">{getStatusIcon(retrieval.status)}</span>
                      {getStatusText(retrieval.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(retrieval.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Data Retrieval Status Message */}
                <DataRetrievalStatusRenderer 
                  retrieval={retrieval} 
                  retrievalType={retrievalType} 
                />
                
                {/* Media Action Buttons */}
                {retrieval.status === 'completed' && availableMedia.length > 0 && (
                  <div className="space-y-4">
                    {availableMedia.map((media) => {
                      // If there's only one file, show a single button
                      if (media.count === 1) {
                        return (
                          <div key={media.type} className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewMedia(media.type as 'pdf' | 'image' | 'video', retrieval, 0)}
                              className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            >
                              <span className="mr-1">{media.icon}</span>
                              {media.label}
                            </button>
                          </div>
                        );
                      }
                      
                      // If there are multiple files, show individual buttons for each
                      const urls = media.type === 'pdf' ? retrieval.pdfUrls : 
                                  media.type === 'image' ? retrieval.imageUrls : 
                                  retrieval.videoUrls;
                      
                      return (
                        <div key={media.type} className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-700">{media.icon} {media.label}</span>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                              {media.count} archivos
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {urls?.map((url, index) => (
                              <button
                                key={`${media.type}-${index}`}
                                onClick={() => handleViewMedia(media.type as 'pdf' | 'image' | 'video', retrieval, index)}
                                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                              >
                                <span className="mr-1">{media.icon}</span>
                                {media.type === 'pdf' ? `PDF ${index + 1}` : 
                                 media.type === 'image' ? `Imagen ${index + 1}` : 
                                 `Video ${index + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* No Media Available */}
                {retrieval.status === 'completed' && availableMedia.length === 0 && (
                  <div className="text-sm text-gray-500 italic">
                    Sin archivos multimedia disponibles
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-center">
          <div className="text-gray-400 text-4xl mb-3">📊</div>
          <p className="text-gray-500 text-sm mb-2">No se han consultado datos para este tipo aún</p>
          <p className="text-xs text-gray-400">Haz clic en el botón para realizar la primera consulta</p>
        </div>
      )}
    </div>
  );
}; 
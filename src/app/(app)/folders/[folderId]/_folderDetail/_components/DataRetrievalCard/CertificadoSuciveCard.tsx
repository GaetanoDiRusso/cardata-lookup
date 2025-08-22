import React, { useState } from 'react';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { generateCertificadoSuciveDataRetrieval } from '@/services';
import { DataRetrievalHeader } from './DataRetrievalHeader';
import { MobileActionButton } from './MobileActionButton';
import { ErrorMessage } from './ErrorMessage';
import { DataRetrievalResults } from './DataRetrievalResults';

export type CertificadoSuciveCardProps = {
  folderId: string;
  retrievalType: VehicleDataRetrievalType;
  label: string;
  description: string;
  existingRetrievals: PVehicleDataRetrieval[];
  isCardCollapsed: boolean;
  onToggleCollapse: () => void;
  addNewDataRetrieval: (dataRetrieval: PVehicleDataRetrieval) => void;
  newDataRetrievalIds: Set<string>;
};

export const CertificadoSuciveCard: React.FC<CertificadoSuciveCardProps> = ({
  folderId,
  retrievalType,
  label,
  description,
  existingRetrievals,
  isCardCollapsed,
  onToggleCollapse,
  addNewDataRetrieval,
  newDataRetrievalIds
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState('');

  const buttonText = 'Descargar';

  const validateRequestNumber = (): boolean => {
    if (!requestNumber.trim()) {
      setError('El número de trámite es requerido para emitir certificado SUCIVE');
      return false;
    }
    return true;
  };

  const handleRetrieveData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!validateRequestNumber()) {
        return;
      }

      const result = await generateCertificadoSuciveDataRetrieval({
        folderId,
        requestNumber: requestNumber.trim(),
      });

      addNewDataRetrieval(result);
    } catch (error: any) {
      console.error('Error in handleRetrieveData:', error);
      setError(error.message || 'Error inesperado al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const isActionDisabled = isLoading || !requestNumber.trim();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-visible">
      <DataRetrievalHeader
        label={label}
        description={description}
        buttonText={buttonText}
        isLoading={isLoading}
        isCardCollapsed={isCardCollapsed}
        onToggleCollapse={onToggleCollapse}
        onAction={handleRetrieveData}
        isActionDisabled={isActionDisabled}
      />

      {/* Collapsible Content */}
      {!isCardCollapsed && (
        <div className="p-6">
          <MobileActionButton
            buttonText={buttonText}
            label={label}
            isLoading={isLoading}
            onAction={handleRetrieveData}
            isDisabled={isActionDisabled}
          />

          <ErrorMessage error={error} />

          {/* Request Number Input */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Datos del Trámite
            </h4>
            
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="mr-2">📋</span>
                <label htmlFor="requestNumber" className="text-sm font-medium text-blue-700">
                  Número de Trámite
                </label>
              </div>
              <input
                id="requestNumber"
                type="text"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                placeholder="Ingrese el número de trámite"
                className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <p className="text-xs text-blue-600 mt-1">
                Este valor es requerido para emitir el certificado SUCIVE
              </p>
            </div>
          </div>

          <DataRetrievalResults
            existingRetrievals={existingRetrievals}
            retrievalType={retrievalType}
            newDataRetrievalIds={newDataRetrievalIds}
          />
        </div>
      )}
    </div>
  );
}; 
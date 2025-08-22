import React, { useState } from 'react';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { DataRetrievalHeader } from './DataRetrievalHeader';
import { MobileActionButton } from './MobileActionButton';
import { ErrorMessage } from './ErrorMessage';
import { DataRetrievalResults } from './DataRetrievalResults';
import {
  generateDebtDataRetrieval,
  generateInfractionsDataRetrieval,
  generateMatriculaDataRetrieval,
  generatePaymentAgreementDataRetrieval,
} from '@/services';

export type SimpleQueryCardProps = {
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

export const SimpleQueryCard: React.FC<SimpleQueryCardProps> = ({
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

  const getButtonText = (): string => {
    return 'Consultar';
  };

  const generateDataRetrieval = async () => {
    switch (retrievalType) {
      case 'infracciones':
        return await generateInfractionsDataRetrieval({ folderId });
      case 'deuda':
        return await generateDebtDataRetrieval({ folderId });
      case 'consultar_matricula':
        return await generateMatriculaDataRetrieval({ folderId });
      case 'consultar_convenio':
        return await generatePaymentAgreementDataRetrieval({ folderId });
      default:
        throw new Error(`Tipo de consulta no soportado: ${retrievalType}`);
    }
  };

  const handleRetrieveData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await generateDataRetrieval();

      addNewDataRetrieval(result);
    } catch (error: any) {
      setError(error.message || 'Error inesperado al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = getButtonText();

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
        isActionDisabled={isLoading}
      />

      {/* Collapsible Content */}
      {!isCardCollapsed && (
        <div className="p-6">
          <MobileActionButton
            buttonText={buttonText}
            label={label}
            isLoading={isLoading}
            onAction={handleRetrieveData}
            isDisabled={isLoading}
          />

          <ErrorMessage error={error} />

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
import React, { useState } from 'react';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { DefaultSession } from 'next-auth';
import { 
  SimpleQueryCard,
  SolicitarCertificadoCard,
  CertificadoSuciveCard
} from './DataRetrievalCard/index';
import { SolicitarCertificadoFormData } from '@/server/domain/entities/SolicitarCertificadoFormData';

export type DataRetrievalCardProps = {
  folderId: string;
  retrievalType: VehicleDataRetrievalType;
  label: string;
  description: string;
  existingRetrievals: PVehicleDataRetrieval[];
  user?: DefaultSession['user'];
  prefilledData?: SolicitarCertificadoFormData;
  addNewDataRetrieval: (dataRetrieval: PVehicleDataRetrieval) => void;
  newDataRetrievalIds: Set<string>;
}

export const DataRetrievalCard = ({ 
  folderId, 
  retrievalType, 
  label, 
  description, 
  existingRetrievals,
  user,
  prefilledData,
  addNewDataRetrieval,
  newDataRetrievalIds,
}: DataRetrievalCardProps) => {
  const [isCardCollapsed, setIsCardCollapsed] = useState(true);

  // Render the appropriate component based on retrieval type
  switch (retrievalType) {
    case 'infracciones':
    case 'deuda':
    case 'consultar_matricula':
    case 'consultar_convenio':
      return (
        <SimpleQueryCard
          folderId={folderId}
          retrievalType={retrievalType}
          label={label}
          description={description}
          existingRetrievals={existingRetrievals}
          isCardCollapsed={isCardCollapsed}
          onToggleCollapse={() => setIsCardCollapsed(!isCardCollapsed)}
          addNewDataRetrieval={addNewDataRetrieval}
          newDataRetrievalIds={newDataRetrievalIds}
        />
      );

    case 'solicitar_certificado':
      return (
        <SolicitarCertificadoCard
          folderId={folderId}
          retrievalType={retrievalType}
          label={label}
          description={description}
          existingRetrievals={existingRetrievals}
          user={user}
          prefilledData={prefilledData}
          isCardCollapsed={isCardCollapsed}
          onToggleCollapse={() => setIsCardCollapsed(!isCardCollapsed)}
          addNewDataRetrieval={addNewDataRetrieval}
          newDataRetrievalIds={newDataRetrievalIds}
        />
      );

    case 'certificado_sucive':
      return (
        <CertificadoSuciveCard
          folderId={folderId}
          retrievalType={retrievalType}
          label={label}
          description={description}
          existingRetrievals={existingRetrievals}
          isCardCollapsed={isCardCollapsed}
          onToggleCollapse={() => setIsCardCollapsed(!isCardCollapsed)}
          addNewDataRetrieval={addNewDataRetrieval}
          newDataRetrievalIds={newDataRetrievalIds}
        />
      );

    default:
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center text-gray-500">
            <p>Tipo de consulta no soportado: {retrievalType}</p>
          </div>
        </div>
      );
  }
}; 
import React from 'react';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';

export type DataRetrievalStatusRendererProps = {
  retrieval: PVehicleDataRetrieval;
  retrievalType: VehicleDataRetrievalType;
};

export const DataRetrievalStatusRenderer = ({ retrieval, retrievalType }: DataRetrievalStatusRendererProps) => {
  // Only render for completed retrievals with data
  if (retrieval.status !== 'completed' || !retrieval.data) {
    return null;
  }

  try {
    const data = retrieval.data as any;

    switch (retrievalType) {
      case 'infracciones':
        return renderInfractionsStatus(data);
      case 'deuda':
        return renderDebtStatus(data);
      case 'consultar_matricula':
        return renderMatriculaStatus(data);
      case 'consultar_convenio':
        return renderPaymentAgreementStatus(data);
      case 'solicitar_certificado':
        return renderSolicitarCertificadoStatus(data);
      case 'certificado_sucive':
        return renderCertificadoSuciveStatus(data);
      // Add more cases here as you add more data retrieval types
      default:
        return null;
    }
  } catch (error) {
    console.error('Error parsing retrieval data:', error);
    return null;
  }
};

// Infractions status renderer
const renderInfractionsStatus = (data: any) => {
  const hasInfractions = data.hasInfractions;

  if (typeof hasInfractions !== 'boolean') {
    return null;
  }

  const bgColor = hasInfractions ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  const textColor = hasInfractions ? 'text-red-700' : 'text-green-700';
  const icon = hasInfractions ? '⚠️' : '✅';

  return (
    <div className={`mb-3 p-3 rounded border ${bgColor}`}>
      <div className="flex items-center">
        <span className="mr-2">{icon}</span>
        <p className={`text-sm font-medium ${textColor}`}>
          {hasInfractions 
            ? "El vehiculo SI parece tener infracciones pendientes de pago, "
            : "El vehiculo parece no tener infracciones pendientes de pago, "
          }
          <span className="font-bold text-black">por favor corrobore los documentos</span>
        </p>
      </div>
    </div>
  );
};

// Debt status renderer
const renderDebtStatus = (data: any) => {
  // Since debt consultation doesn't return actual debt data, just show completion message
  return (
    <div className="mb-3 p-3 rounded border bg-blue-50 border-blue-200">
      <div className="flex items-center">
        <span className="mr-2">📋</span>
        <p className="text-sm font-medium text-blue-700">
          Consulta de deudas completada. Por favor revise los documentos adjuntos para verificar el estado de deudas.
        </p>
      </div>
    </div>
  );
}; 

// Matricula status renderer
const renderMatriculaStatus = (data: any) => {
  // Since matricula consultation returns registration status data, show completion message
  return (
    <div className="mb-3 p-3 rounded border bg-purple-50 border-purple-200">
      <div className="flex items-center">
        <span className="mr-2">📋</span>
        <p className="text-sm font-medium text-purple-700">
          Consulta de matrícula completada. Por favor revise los documentos adjuntos para verificar el estado de la matrícula.
        </p>
      </div>
    </div>
  );
}; 

// Payment Agreement status renderer
const renderPaymentAgreementStatus = (data: any) => {
  // Since payment agreement consultation returns agreement data, show completion message
  return (
    <div className="mb-3 p-3 rounded border bg-orange-50 border-orange-200">
      <div className="flex items-center">
        <span className="mr-2">📋</span>
        <p className="text-sm font-medium text-orange-700">
          Consulta de convenios de pago completada. Por favor revise los documentos adjuntos para verificar el estado de los convenios.
        </p>
      </div>
    </div>
  );
};

// Solicitar Certificado status renderer
const renderSolicitarCertificadoStatus = (data: any) => {
  const transactionNumber = data.transactionNumber;

  if (!transactionNumber) {
    return null;
  }

  return (
    <div className="mb-3 p-3 rounded border bg-yellow-50 border-yellow-200">
      <div className="flex items-center">
        <span className="mr-2">📄</span>
        <p className="text-sm font-medium text-yellow-700">
          Solicitud de certificado SUCIVE completada. Número de tramite: <span className="font-bold text-black">{transactionNumber}</span>
        </p>
      </div>
    </div>
  );
};

// Certificado SUCIVE status renderer
const renderCertificadoSuciveStatus = (data: any) => {
  // Since certificado SUCIVE emission returns the certificate PDF, show completion message
  return (
    <div className="mb-3 p-3 rounded border bg-green-50 border-green-200">
      <div className="flex items-center">
        <span className="mr-2">📄</span>
        <p className="text-sm font-medium text-green-700">
          Emisión de certificado SUCIVE completada. El certificado está disponible para descargar en los documentos adjuntos.
        </p>
      </div>
    </div>
  );
}; 
import React, { useState } from 'react';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { generateSolicitarCertificadoDataRetrieval } from '@/services';
import { DefaultSession } from 'next-auth';
import { DataRetrievalHeader } from './DataRetrievalHeader';
import { MobileActionButton } from './MobileActionButton';
import { ErrorMessage } from './ErrorMessage';
import { DataRetrievalResults } from './DataRetrievalResults';
import { SolicitarCertificadoFormData } from '@/server/domain/entities/SolicitarCertificadoFormData';

export type SolicitarCertificadoCardProps = {
  folderId: string;
  retrievalType: VehicleDataRetrievalType;
  label: string;
  description: string;
  existingRetrievals: PVehicleDataRetrieval[];
  user?: DefaultSession['user'];
  prefilledData?: SolicitarCertificadoFormData;
  isCardCollapsed: boolean;
  onToggleCollapse: () => void;
  addNewDataRetrieval: (dataRetrieval: PVehicleDataRetrieval) => void;
  newDataRetrievalIds: Set<string>;
};

export const SolicitarCertificadoCard: React.FC<SolicitarCertificadoCardProps> = ({
  folderId,
  retrievalType,
  label,
  description,
  existingRetrievals,
  user,
  prefilledData,
  isCardCollapsed,
  onToggleCollapse,
  addNewDataRetrieval,
  newDataRetrievalIds
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // User data state for solicitar certificado
  const [fullName, setFullName] = useState(prefilledData?.fullName || user?.name || '');
  const [identificationType, setIdentificationType] = useState<'CI' | 'RUT'>(prefilledData?.identificationType || 'CI');
  const [identificationNumber, setIdentificationNumber] = useState(prefilledData?.identificationNumber || '');
  const [email, setEmail] = useState(prefilledData?.email || user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(prefilledData?.phoneNumber || '');
  const [address, setAddress] = useState(prefilledData?.address || '');

  const buttonText = 'Solicitar';

  const validateUserData = (): boolean => {
    if (!fullName.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }
    if (!identificationNumber.trim()) {
      setError('El número de identificación es requerido');
      return false;
    }
    if (!email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!phoneNumber.trim()) {
      setError('El número de teléfono es requerido');
      return false;
    }
    if (!address.trim()) {
      setError('La dirección es requerida');
      return false;
    }
    return true;
  };

  const handleRetrieveData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!validateUserData()) {
        return;
      }

      const result = await generateSolicitarCertificadoDataRetrieval({
        folderId,
        userData: {
          fullName: fullName.trim(),
          identificationType,
          identificationNumber: identificationNumber.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
        }
      });

      addNewDataRetrieval(result);
    } catch (error: any) {
      console.error('Error in handleRetrieveData:', error);
      setError(error.message || 'Error inesperado al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const isActionDisabled = isLoading || !fullName.trim() || !identificationNumber.trim() || !email.trim() || !phoneNumber.trim() || !address.trim();

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

          {/* User Data Input Fields */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Datos del Solicitante
            </h4>
            
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="mr-2">👤</span>
                <label className="text-sm font-medium text-green-700">
                  Datos del Solicitante (prellenados con la última consulta)
                </label>
              </div>
              


              {/* User Data Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-green-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nombre y apellido"
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                {/* Identification Type */}
                <div>
                  <label htmlFor="identificationType" className="block text-sm font-medium text-green-700 mb-1">
                    Tipo de Identificación *
                  </label>
                  <select
                    id="identificationType"
                    value={identificationType}
                    onChange={(e) => setIdentificationType(e.target.value as 'CI' | 'RUT')}
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="CI">Cédula de Identidad</option>
                    <option value="RUT">RUT</option>
                  </select>
                </div>

                {/* Identification Number */}
                <div>
                  <label htmlFor="identificationNumber" className="block text-sm font-medium text-green-700 mb-1">
                    Número de Identificación *
                  </label>
                  <input
                    id="identificationNumber"
                    type="text"
                    value={identificationNumber}
                    onChange={(e) => setIdentificationNumber(e.target.value)}
                    placeholder="Número de CI o RUT"
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-green-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-green-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Número de teléfono"
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-green-700 mb-1">
                    Dirección *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Dirección completa"
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <p className="text-xs text-green-600 mt-3">
                * Campos obligatorios para solicitar el certificado SUCIVE
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
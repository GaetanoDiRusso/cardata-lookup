import React, { useState, useEffect } from 'react';
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { callServerAction } from '@/utils/server-actions.utils';
import { 
  generateInfractionsDataRetrieval,
  generateDebtDataRetrieval,
  generateMatriculaDataRetrieval,
  generatePaymentAgreementDataRetrieval,
  generateSolicitarCertificadoDataRetrieval,
  generateCertificadoSuciveDataRetrieval
} from '@/server/infraestructure/server-actions/VehicleDataRetrievalActions';
import { 
  getStatusColor, 
  getStatusIcon, 
  getStatusText, 
  getAvailableMedia, 
  handleViewMedia 
} from './utils/dataRetrievalUtils';
import { DataRetrievalStatusRenderer } from './DataRetrievalStatusRenderer';
import { DefaultSession } from 'next-auth';

export type DataRetrievalCardProps = {
  folderId: string;
  retrievalType: VehicleDataRetrievalType;
  label: string;
  description: string;
  existingRetrievals: PVehicleDataRetrieval[];
  user?: DefaultSession['user']; // Using any for now, we can refine this later
}

export const DataRetrievalCard = ({ 
  folderId, 
  retrievalType, 
  label, 
  description, 
  existingRetrievals,
  user
}: DataRetrievalCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState('');
  
  // Collapsible card state
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  
  // User data state for solicitar certificado
  const [useMyData, setUseMyData] = useState(true);
  const [fullName, setFullName] = useState(user?.name || '');
  const [identificationType, setIdentificationType] = useState<'CI' | 'RUT'>('CI');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  // Helper function to get the appropriate button text for each retrieval type
  const getButtonText = (type: VehicleDataRetrievalType): string => {
    switch (type) {
      case 'infracciones':
      case 'deuda':
      case 'consultar_matricula':
      case 'consultar_convenio':
        return 'Consultar';
      case 'solicitar_certificado':
        return 'Solicitar';
      case 'certificado_sucive':
        return 'Descargar';
      default:
        return 'Consultar';
    }
  };

  const buttonText = getButtonText(retrievalType);

  // Check if there are any inputs to show
  const hasInputs = retrievalType === 'certificado_sucive' || retrievalType === 'solicitar_certificado';

  // Check if there are results to show
  const hasResults = existingRetrievals.length > 0;

  const handleRetrieveData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate request number for certificado_sucive
      if (retrievalType === 'certificado_sucive' && !requestNumber.trim()) {
        setError('El número de trámite es requerido para emitir certificado SUCIVE');
        return;
      }

      // Validate user data for solicitar_certificado
      if (retrievalType === 'solicitar_certificado') {
        if (!fullName.trim()) {
          setError('El nombre completo es requerido');
          return;
        }
        if (!identificationNumber.trim()) {
          setError('El número de identificación es requerido');
          return;
        }
        if (!email.trim()) {
          setError('El email es requerido');
          return;
        }
        if (!phoneNumber.trim()) {
          setError('El número de teléfono es requerido');
          return;
        }
        if (!address.trim()) {
          setError('La dirección es requerida');
          return;
        }
      }

      let result;
      
      // Handle different retrieval types
      switch (retrievalType) {
        case 'infracciones':
          result = await callServerAction(generateInfractionsDataRetrieval({
            folderId,
          }));
          break;
        case 'deuda':
          result = await callServerAction(generateDebtDataRetrieval({
            folderId,
          }));
          break;
        case 'consultar_matricula':
          result = await callServerAction(generateMatriculaDataRetrieval({
            folderId,
          }));
          break;
        case 'consultar_convenio':
          result = await callServerAction(generatePaymentAgreementDataRetrieval({
            folderId,
          }));
          break;
        case 'solicitar_certificado':
          result = await callServerAction(generateSolicitarCertificadoDataRetrieval({
            folderId,
            userData: {
              fullName: fullName.trim(),
              identificationType,
              identificationNumber: identificationNumber.trim(),
              email: email.trim(),
              phoneNumber: phoneNumber.trim(),
              address: address.trim(),
            }
          }));
          break;
        case 'certificado_sucive':
          result = await callServerAction(generateCertificadoSuciveDataRetrieval({
            folderId,
            requestNumber: requestNumber.trim(),
          }));
          break;
        default:
          throw new Error(`Tipo de consulta no soportado: ${retrievalType}`);
      }

      // If we get here, the call was successful - refresh the page to show new results
      window.location.reload();
    } catch (error: any) {
      console.error('Error in handleRetrieveData:', error);
      setError(error.message || 'Error inesperado al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  // Render request number input for certificado_sucive
  const renderRequestNumberInput = () => {
    if (retrievalType !== 'certificado_sucive') {
      return null;
    }

    return (
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
    );
  };

  // Render user data input fields for solicitar certificado
  const renderUserDataInput = () => {
    if (retrievalType !== 'solicitar_certificado') {
      return null;
    }

    return (
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center mb-3">
          <span className="mr-2">👤</span>
          <label className="text-sm font-medium text-green-700">
            Datos del Solicitante
          </label>
        </div>
        
        {/* Use My Data Checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useMyData}
              onChange={(e) => setUseMyData(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-green-700">
              Usar mis datos de perfil (recomendado)
            </span>
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
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-visible">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 overflow-visible">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Collapse Button */}
            <button
              onClick={() => setIsCardCollapsed(!isCardCollapsed)}
              className="mr-3 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center shadow-sm"
              title={isCardCollapsed ? "Expandir tarjeta" : "Colapsar tarjeta"}
            >
              <svg
                className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                  isCardCollapsed ? 'rotate-0' : 'rotate-180'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Title and Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{label}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          
          {/* Action Button - Only show when not collapsed */}
          {!isCardCollapsed && (
            <div className="hidden lg:block relative">
              <button
                onClick={handleRetrieveData}
                disabled={isLoading || 
                  (retrievalType === 'certificado_sucive' && !requestNumber.trim()) ||
                  (retrievalType === 'solicitar_certificado' && (!fullName.trim() || !identificationNumber.trim() || !email.trim() || !phoneNumber.trim() || !address.trim()))
                }
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center group relative text-sm"
                title={`${buttonText} ${label}`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="mr-1">🔍</span>
                )}
                {buttonText}
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                  {buttonText} {label}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCardCollapsed && (
        <div className="p-6">
          {/* Mobile Action Button - Visible only on mobile */}
          <div className="lg:hidden mb-4">
            <button
              onClick={handleRetrieveData}
              disabled={isLoading || 
                (retrievalType === 'certificado_sucive' && !requestNumber.trim()) ||
                (retrievalType === 'solicitar_certificado' && (!fullName.trim() || !identificationNumber.trim() || !email.trim() || !phoneNumber.trim() || !address.trim()))
              }
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {buttonText === 'Emitir' ? 'Emitiendo...' : buttonText === 'Solicitar' ? 'Solicitando...' : 'Consultando...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🔍</span>
                  {buttonText} {label}
                </div>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {/* Inputs Section */}
          {hasInputs && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                {retrievalType === 'certificado_sucive' ? 'Datos del Trámite' : 'Datos del Solicitante'}
              </h4>
              {renderRequestNumberInput()}
              {renderUserDataInput()}
            </div>
          )}

          {/* Results Section */}
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
        </div>
      )}
    </div>
  );
}; 
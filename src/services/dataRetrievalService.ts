import axios, { AxiosResponse } from 'axios';
import { PVehicleDataRetrieval } from '@/models/PScrapingResult';
import { API_PATHS } from '@/constants/apiPaths';
import { DataRetrievalError } from './DataRetrievalError';
import { API_BASE_URL } from '@/constants/config';

/**
 * User data interface for certificado requests
 */
export interface UserData {
  fullName: string;
  identificationType: 'CI' | 'RUT';
  identificationNumber: string;
  email: string;
  phoneNumber: string;
  address: string;
}

// Create axios instance with common configuration
const axiosInstance = axios.create({
  timeout: 300000, // 5 minutes timeout for long-running operations
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generic function to make API calls with proper error handling
 * Throws DataRetrievalError on failure, returns data directly on success
 */
async function makeApiCall<T>(path: string, data: any): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.post(
      `${API_BASE_URL}${path}`,
      data
    );

    return response.data;
  } catch (error: any) {
    console.error(`API call to ${path} failed:`, error);
    
    // Create a simple error for now
    throw new DataRetrievalError(
      {} as any, // Empty enum value
      error.response?.data?.error || error.message || 'API call failed',
      `Failed to call ${path}`
    );
  }
}

export type GenerateInfractionsDataRetrievalData = {
  folderId: string;
};

/**
 * Get infractions data
 * @throws {DataRetrievalError} When the API call fails
 */
export async function generateInfractionsDataRetrieval(data: GenerateInfractionsDataRetrievalData): Promise<PVehicleDataRetrieval> {
  console.log(`📞 [DataRetrievalService] Calling infractions API for folder: ${data.folderId}`);
  return makeApiCall<PVehicleDataRetrieval>(API_PATHS.DATA_RETRIEVAL.INFRACTIONS, data);
}

export type GenerateDebtDataRetrievalData = {
    folderId: string;
  };

/**
 * Get debt data
 * @throws {DataRetrievalError} When the API call fails
 */
export async function generateDebtDataRetrieval(data: GenerateDebtDataRetrievalData): Promise<PVehicleDataRetrieval> {
  console.log(`📞 [DataRetrievalService] Calling debt API for folder: ${data.folderId}`);
  return makeApiCall<PVehicleDataRetrieval>(API_PATHS.DATA_RETRIEVAL.DEBT, data);
}

export type GenerateMatriculaDataRetrievalData = {
    folderId: string;
};

/**
 * Get matrícula data
 * @throws {DataRetrievalError} When the API call fails
 */
export async function generateMatriculaDataRetrieval(data: GenerateMatriculaDataRetrievalData): Promise<PVehicleDataRetrieval> {
  console.log(`📞 [DataRetrievalService] Calling matrícula API for folder: ${data.folderId}`);
  return makeApiCall<PVehicleDataRetrieval>(API_PATHS.DATA_RETRIEVAL.MATRICULA, data);
}

export type GeneratePaymentAgreementDataRetrievalData = {
    folderId: string;
};

/**
 * Get payment agreement data
 * @throws {DataRetrievalError} When the API call fails
 */
export async function generatePaymentAgreementDataRetrieval(data: GeneratePaymentAgreementDataRetrievalData): Promise<PVehicleDataRetrieval> {
  console.log(`📞 [DataRetrievalService] Calling payment agreement API for folder: ${data.folderId}`);
  return makeApiCall<PVehicleDataRetrieval>(API_PATHS.DATA_RETRIEVAL.PAYMENT_AGREEMENT, data);
}

export type GenerateSolicitarCertificadoDataRetrievalData = {
    folderId: string;
    userData: {
      fullName: string;
      identificationType: 'CI' | 'RUT';
      identificationNumber: string;
      email: string;
      phoneNumber: string;
      address: string;
    };
  };

/**
 * Solicitar certificado
 * @throws {DataRetrievalError} When the API call fails
 */
export async function generateSolicitarCertificadoDataRetrieval(
  data: GenerateSolicitarCertificadoDataRetrievalData
): Promise<PVehicleDataRetrieval> {
  console.log(`📞 [DataRetrievalService] Calling solicitar certificado API for folder: ${data.folderId}`);
  return makeApiCall<PVehicleDataRetrieval>(
    API_PATHS.DATA_RETRIEVAL.SOLICITAR_CERTIFICADO,
    data
  );
}

export type GenerateCertificadoSuciveDataRetrievalData = {
    folderId: string;
    requestNumber: string;
};

/**
 * Get certificado SUCIVE
 * @throws {DataRetrievalError} When the API call fails
 */
export async function generateCertificadoSuciveDataRetrieval(
  data: GenerateCertificadoSuciveDataRetrievalData
): Promise<PVehicleDataRetrieval> {
  console.log(`📞 [DataRetrievalService] Calling certificado SUCIVE API for folder: ${data.folderId}`);
  return makeApiCall<PVehicleDataRetrieval>(
    API_PATHS.DATA_RETRIEVAL.CERTIFICADO_SUCIVE,
    data
  );
}

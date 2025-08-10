import { DATA_RETRIEVAL_SERVICE_URL } from '../../config';
import { VehicleDataRetrievalType } from '@/models/PScrapingResult';

export interface IGenerateAndSaveScrappedDataRes<T> {
  imagePathsUrls: string[];
  pdfPathsUrls: string[];
  videoPathsUrls: string[];
  data: T;
}

export interface DataRetrievalServiceRequest {
  userId: string;
  vehicleData: {
    matricula: string;
    padron?: string;
    departamento?: string;
  };
  requestNumber?: string; // Add requestNumber at root level
  requesterData?: {
    fullName: string;
    identificationType: 'CI' | 'RUT';
    identificationNumber: string;
    email: string;
    phoneNumber?: string;
    address?: string;
  };
}

export interface DataRetrievalServiceResponse<T> extends IGenerateAndSaveScrappedDataRes<T> {
  // Remove success and error properties since we now throw errors
}

export class DataRetrievalService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = DATA_RETRIEVAL_SERVICE_URL;
  }

  /**
   * Makes a request to the data retrieval service
   */
  private async makeRequest<T>(
    endpoint: string,
    data: DataRetrievalServiceRequest
  ): Promise<DataRetrievalServiceResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error calling data retrieval service at ${endpoint}:`, error);
      // Throw the error instead of returning an error object
      throw error;
    }
  }

  /**
   * Retrieves infractions data
   */
  async getInfractionsData(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string }
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/infractions', {
      userId,
      vehicleData,
    });
  }

  /**
   * Retrieves debt data
   */
  async getDebtData(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string }
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/debt', {
      userId,
      vehicleData,
    });
  }

  /**
   * Retrieves payment agreement data
   */
  async getPaymentAgreementData(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string }
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/payment-agreement', {
      userId,
      vehicleData,
    });
  }

  /**
   * Retrieves matricula requerida data
   */
  async getMatriculaRequeridaData(
    userId: string,
    vehicleData: { matricula: string }
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/matriculas-requeridas', {
      userId,
      vehicleData: { matricula: vehicleData.matricula },
    });
  }

  /**
   * Requests certificado SUCIVE
   */
  async solicitarCertificadoSucive(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string },
    requesterData: {
      fullName: string;
      identificationType: 'CI' | 'RUT';
      identificationNumber: string;
      email: string;
      phoneNumber?: string;
      address?: string;
    }
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/solicitar-certificado-sucive', {
      userId,
      vehicleData,
      requesterData,
    });
  }

  /**
   * Emits certificado SUCIVE
   */
  async emitirCertificadoSucive(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string },
    requestNumber?: string
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/emitir-certificado-sucive', {
      userId,
      vehicleData,
      requestNumber, // Pass requestNumber at root level
    });
  }

  /**
   * Generic method to retrieve data based on type
   */
  async retrieveDataByType(
    type: VehicleDataRetrievalType,
    userId: string,
    vehicleData: { matricula: string; padron?: string; departamento?: string },
    requestNumber?: string,
    requesterData?: {
      fullName: string;
      identificationType: 'CI' | 'RUT';
      identificationNumber: string;
      email: string;
      phoneNumber?: string;
      address?: string;
    }
  ): Promise<DataRetrievalServiceResponse<any>> {
    switch (type) {
      case 'infracciones':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for infractions data retrieval');
        }
        return this.getInfractionsData(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        });
      case 'deuda':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for debt data retrieval');
        }
        return this.getDebtData(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        });
      case 'consultar_convenio':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for payment agreement data retrieval');
        }
        return this.getPaymentAgreementData(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        });
      case 'consultar_matricula':
        return this.getMatriculaRequeridaData(userId, { matricula: vehicleData.matricula });
      case 'solicitar_certificado':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for certificado solicitation');
        }
        if (!requesterData) {
          throw new Error('Requester data is required for certificado solicitation');
        }
        return this.solicitarCertificadoSucive(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        }, requesterData);
      case 'certificado_sucive':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for certificado emission');
        }
        return this.emitirCertificadoSucive(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        }, requestNumber); // Pass requestNumber here
      default:
        throw new Error(`Unsupported data retrieval type: ${type}`);
    }
  }
}

// Export singleton instance
export const dataRetrievalService = new DataRetrievalService(); 
import { LogEntry, Logger } from '@/server/domain/utils/Logger';
import { DATA_RETRIEVAL_SERVICE_URL } from '../../config';
import { VehicleDataRetrievalType } from '@/models/PScrapingResult';

export interface IGenerateAndSaveScrappedDataRes<T> {
  imagePathsUrls: string[];
  pdfPathsUrls: string[];
  videoPathsUrls: string[];
  data: T;
  logs: LogEntry[];
  success: boolean;
  error?: string;
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

export interface DataRetrievalServiceResponse<T> extends IGenerateAndSaveScrappedDataRes<T> {}

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
    data: DataRetrievalServiceRequest,
    logger: Logger
  ): Promise<DataRetrievalServiceResponse<T>> {
    try {
      const REQUEST_URL = `${this.baseUrl}${endpoint}`;
      logger.info('Making request to data retrieval service', {
        REQUEST_URL,
        data,
      });

      const response = await fetch(REQUEST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      logger.info('Received response from data retrieval service', {
        responseOk: response.ok,
        responseStatus: response.status,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        logger.error('Error calling data retrieval service', {
          errorData,
        });
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      logger.error('Error calling data retrieval service', {
        error,
      });
      // Throw the error instead of returning an error object
      throw error;
    }
  }

  /**
   * Retrieves infractions data
   */
  async getInfractionsData(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string },
    logger: Logger
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/infractions', {
      userId,
      vehicleData,
    }, logger);
  }

  /**
   * Retrieves debt data
   */
  async getDebtData(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string },
    logger: Logger
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/debt', {
      userId,
      vehicleData,
    }, logger);
  }

  /**
   * Retrieves payment agreement data
   */
  async getPaymentAgreementData(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string },
    logger: Logger
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/payment-agreement', {
      userId,
      vehicleData,
    }, logger);
  }

  /**
   * Retrieves matricula requerida data
   */
  async getMatriculaRequeridaData(
    userId: string,
    vehicleData: { matricula: string },
    logger: Logger
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/matriculas-requeridas', {
      userId,
      vehicleData: { matricula: vehicleData.matricula },
    }, logger);
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
    },
    logger: Logger
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/solicitar-certificado-sucive', {
      userId,
      vehicleData,
      requesterData,
    }, logger);
  }

  /**
   * Emits certificado SUCIVE
   */
  async emitirCertificadoSucive(
    userId: string,
    vehicleData: { matricula: string; padron: string; departamento?: string },
    logger: Logger,
    requestNumber?: string
  ): Promise<DataRetrievalServiceResponse<any>> {
    return this.makeRequest<any>('/api/emitir-certificado-sucive', {
      userId,
      vehicleData,
      requestNumber, // Pass requestNumber at root level
    }, logger);
  }

  /**
   * Generic method to retrieve data based on type
   */
  async retrieveDataByType(
    type: VehicleDataRetrievalType,
    userId: string,
    vehicleData: { matricula: string; padron?: string; departamento?: string },
    logger: Logger,
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
    logger.info('Retrieving data by type', {
      type,
      vehicleData,
      requestNumber,
      requesterData,
    });

    switch (type) {
      case 'infracciones':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for infractions data retrieval');
        }
        return this.getInfractionsData(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        }, logger);
      case 'deuda':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for debt data retrieval');
        }
        return this.getDebtData(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        }, logger);
      case 'consultar_convenio':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for payment agreement data retrieval');
        }
        return this.getPaymentAgreementData(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        }, logger);
      case 'consultar_matricula':
        return this.getMatriculaRequeridaData(userId, { matricula: vehicleData.matricula }, logger);
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
        }, requesterData, logger);
      case 'certificado_sucive':
        if (!vehicleData.padron) {
          throw new Error('Padron is required for certificado emission');
        }
        return this.emitirCertificadoSucive(userId, { 
          matricula: vehicleData.matricula, 
          padron: vehicleData.padron, 
          departamento: vehicleData.departamento 
        }, logger, requestNumber);
      default:
        throw new Error(`Unsupported data retrieval type: ${type}`);
    }
  }
}

// Export singleton instance
export const dataRetrievalService = new DataRetrievalService(); 
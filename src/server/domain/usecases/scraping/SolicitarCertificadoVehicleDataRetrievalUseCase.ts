import { BaseVehicleDataRetrievalUseCase } from './BaseVehicleDataRetrievalUseCase';
import { VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { FolderUseCases } from '../folder/FolderUseCases';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { VehicleDataRetrieval } from '../../entities/VehicleDataRetrieval';
import { dataRetrievalService } from '../../../data/scraping/DataRetrievalService';
import { IVehicleDataRetrievalRepository } from '../../interfaces/IVehicleDataRetrievalRepository';
import { Logger } from '../../utils/Logger';

export type GenerateSolicitarCertificadoVehicleDataRetrievalParams = {
  folderId: string;
  requesterData: {
    fullName: string;
    identificationType: 'CI' | 'RUT';
    identificationNumber: string;
    email: string;
    phoneNumber?: string;
    address?: string;
  };
};

export class SolicitarCertificadoVehicleDataRetrievalUseCase extends BaseVehicleDataRetrievalUseCase {
  constructor(
    vehicleDataRetrievalRepository: IVehicleDataRetrievalRepository,
    private readonly folderUseCases: FolderUseCases
  ) {
    super(vehicleDataRetrievalRepository);
  }

  protected getDataRetrievalType(): VehicleDataRetrievalType {
    return 'solicitar_certificado';
  }

  protected validateParams(params: GenerateSolicitarCertificadoVehicleDataRetrievalParams): void {
    if (!params.folderId) {
      throw new Error('El ID de la carpeta es requerido');
    }
  }

  protected async callDataRetrievalService(
    userId: string, 
    params: GenerateSolicitarCertificadoVehicleDataRetrievalParams,
    logger: Logger
  ): Promise<{
    data: any;
    imagePathsUrls?: string[];
    pdfPathsUrls?: string[];
    videoPathsUrls?: string[];
    success: boolean;
    error?: string;
  }> {
    logger.info('Starting callDataRetrievalService', {
      params,
    });

    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, { userId });
    if (!folder) {
      logger.error('Folder not found', {
        folderId: params.folderId,
      });
      throw new Error(`Folder with id ${params.folderId} not found.`);
    }

    const vehicleData = {
      matricula: folder.vehicle.vehicleData.plateNumber,
      padron: folder.vehicle.vehicleData.registrationNumber,
      departamento: folder.vehicle.vehicleData.department,
    };

    logger.info('Calling solicitarCertificadoSucive service', {
      vehicleData,
      requesterData: params.requesterData,
      userId,
    });

    // Call the SUCIVE certificate solicitation service with requester data - it will throw on error
    const result = await dataRetrievalService.solicitarCertificadoSucive(userId, vehicleData, params.requesterData, logger);

    // Include the logs from the service
    logger.addLogs(result.logs);
    
    if (result.success) {
      logger.info('solicitarCertificadoSucive service succeeded');
    } else {
      logger.error('solicitarCertificadoSucive service failed', {
        error: result.error,
      });
    }

    // If we get here, the service succeeded
    return {
      data: result.data,
      imagePathsUrls: result.imagePathsUrls,
      pdfPathsUrls: result.pdfPathsUrls,
      videoPathsUrls: result.videoPathsUrls,
      success: result.success,
      error: result.error || undefined,
    };
  }

  // Public method that orchestrates the entire SUCIVE certificate solicitation workflow
  async generateSolicitarCertificadoVehicleDataRetrieval(
    params: GenerateSolicitarCertificadoVehicleDataRetrievalParams, 
    userContext: ICurrentUserContext,
    logger: Logger
  ): Promise<VehicleDataRetrieval> {
    return this.generateVehicleDataRetrieval(params.folderId, params, userContext, logger);
  }
} 
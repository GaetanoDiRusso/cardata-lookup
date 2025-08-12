import { VehicleDataRetrieval } from '../../entities/VehicleDataRetrieval';
import { FolderUseCases } from '../folder/FolderUseCases';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { BaseVehicleDataRetrievalUseCase } from './BaseVehicleDataRetrievalUseCase';
import { dataRetrievalService } from '../../../data/scraping/DataRetrievalService';
import { IVehicleDataRetrievalRepository } from '../../interfaces/IVehicleDataRetrievalRepository';
import { LogEntry, Logger } from '../../utils/Logger';

export interface GenerateCertificadoSuciveVehicleDataRetrievalParams {
  folderId: string;
  requestNumber: string;
}

export class CertificadoSuciveVehicleDataRetrievalUseCase extends BaseVehicleDataRetrievalUseCase {
  constructor(
    vehicleDataRetrievalRepository: IVehicleDataRetrievalRepository,
    private readonly folderUseCases: FolderUseCases
  ) {
    super(vehicleDataRetrievalRepository);
  }

  protected getDataRetrievalType() {
    return 'certificado_sucive' as const;
  }

  protected validateParams(params: GenerateCertificadoSuciveVehicleDataRetrievalParams): void {
    if (!params.folderId) {
      throw new Error('Folder ID is required');
    }
    if (!params.requestNumber) {
      throw new Error('Request number is required for SUCIVE certificate emission');
    }
  }

  protected async callDataRetrievalService(
    userId: string, 
    params: GenerateCertificadoSuciveVehicleDataRetrievalParams,
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

    // Get folder and extract vehicle data
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, { userId });
    if (!folder) {
      logger.error('Folder not found', {
        folderId: params.folderId,
      });
      throw new Error(`Folder with id ${params.folderId} not found.`);
    }

    logger.info('Folder found', {
      folderId: params.folderId,
    });

    const vehicleData = {
      matricula: folder.vehicle.vehicleData.plateNumber,
      padron: folder.vehicle.vehicleData.registrationNumber,
      departamento: folder.vehicle.vehicleData.department,
    };

    logger.info('Calling emitirCertificadoSucive service', {
      vehicleData,
      requestNumber: params.requestNumber,
      userId,
    });

    // Call the SUCIVE certificate service - it will throw on error
    const result = await dataRetrievalService.emitirCertificadoSucive(
      userId,
      vehicleData, 
      logger,
      params.requestNumber
    );

    // Include the logs from the service
    logger.addLogs(result.logs);

    if (result.success) {
      logger.info('emitirCertificadoSucive service succeeded');
    } else {
      logger.error('emitirCertificadoSucive service failed', {
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

  // Public method that orchestrates the entire SUCIVE certificate workflow
  async generateCertificadoSuciveVehicleDataRetrieval(
    params: GenerateCertificadoSuciveVehicleDataRetrievalParams, 
    userContext: ICurrentUserContext,
    logger: Logger
  ): Promise<VehicleDataRetrieval> {
    return this.generateVehicleDataRetrieval(params.folderId, params, userContext, logger);
  }
} 
import { VehicleDataRetrieval } from '../../entities/VehicleDataRetrieval';
import { FolderUseCases } from '../folder/FolderUseCases';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { BaseVehicleDataRetrievalUseCase } from './BaseVehicleDataRetrievalUseCase';
import { dataRetrievalService } from '../../../data/scraping/DataRetrievalService';
import { IVehicleDataRetrievalRepository } from '../../interfaces/IVehicleDataRetrievalRepository';
import { Logger } from '../../utils/Logger';

export interface GenerateInfractionsVehicleDataRetrievalParams {
  folderId: string;
}

export class InfraccionesVehicleDataRetrievalUseCase extends BaseVehicleDataRetrievalUseCase {
  constructor(
    vehicleDataRetrievalRepository: IVehicleDataRetrievalRepository,
    private readonly folderUseCases: FolderUseCases
  ) {
    super(vehicleDataRetrievalRepository);
  }

  protected getDataRetrievalType() {
    return 'infracciones' as const;
  }

  protected validateParams(params: GenerateInfractionsVehicleDataRetrievalParams): void {
    if (!params.folderId) {
      throw new Error('Folder ID is required');
    }
  }

  protected async callDataRetrievalService(
    userId: string, 
    params: GenerateInfractionsVehicleDataRetrievalParams,
    logger: Logger
  ): Promise<{
    data: any;
    imagePathsUrls?: string[];
    pdfPathsUrls?: string[];
    videoPathsUrls?: string[];
    success: boolean;
    error?: string;
  }> {
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

    logger.info('Calling getInfractionsData service', {
      vehicleData,
      userId,
    });

    // Call the infractions service - it will throw on error
    const result = await dataRetrievalService.getInfractionsData(userId, vehicleData, logger);

    // Include the logs from the service
    logger.addLogs(result.logs);

    if (result.success) {
      logger.info('getInfractionsData service succeeded');
    } else {
      logger.error('getInfractionsData service failed', {
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

  // Public method that orchestrates the entire infractions workflow
  async generateInfractionsVehicleDataRetrieval(
    params: GenerateInfractionsVehicleDataRetrievalParams, 
    userContext: ICurrentUserContext,
    logger: Logger
  ): Promise<VehicleDataRetrieval> {
    return this.generateVehicleDataRetrieval(params.folderId, params, userContext, logger);
  }
}
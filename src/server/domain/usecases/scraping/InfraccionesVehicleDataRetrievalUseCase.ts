import { VehicleDataRetrieval } from '../../entities/VehicleDataRetrieval';
import { FolderUseCases } from '../folder/FolderUseCases';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { BaseVehicleDataRetrievalUseCase } from './BaseVehicleDataRetrievalUseCase';
import { dataRetrievalService } from '../../../data/scraping/DataRetrievalService';
import { IVehicleDataRetrievalRepository } from '../../interfaces/IVehicleDataRetrievalRepository';

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
    params: GenerateInfractionsVehicleDataRetrievalParams
  ): Promise<{
    data: any;
    imagePathsUrls?: string[];
    pdfPathsUrls?: string[];
    videoPathsUrls?: string[];
  }> {
    // Get folder and extract vehicle data
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, { userId });
    if (!folder) {
      throw new Error(`Folder with id ${params.folderId} not found or you don't have permission to access it`);
    }

    const vehicleData = {
      matricula: folder.vehicle.vehicleData.plateNumber,
      padron: folder.vehicle.vehicleData.registrationNumber,
      departamento: folder.vehicle.vehicleData.department,
    };

    // Call the infractions service - it will throw on error
    const result = await dataRetrievalService.getInfractionsData(userId, vehicleData);

    // If we get here, the service succeeded
    return {
      data: result.data,
      imagePathsUrls: result.imagePathsUrls,
      pdfPathsUrls: result.pdfPathsUrls,
      videoPathsUrls: result.videoPathsUrls,
    };
  }

  // Public method that orchestrates the entire infractions workflow
  async generateInfractionsVehicleDataRetrieval(
    params: GenerateInfractionsVehicleDataRetrievalParams, 
    userContext: ICurrentUserContext
  ): Promise<VehicleDataRetrieval> {
    return this.generateVehicleDataRetrieval(params.folderId, params, userContext);
  }

  // Keep the existing method for backward compatibility during transition
  async getInfractionsVehicleDataRetrievalStatus(
    params: { folderId: string },
    userContext: ICurrentUserContext
  ): Promise<VehicleDataRetrieval | null> {
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, userContext);
    if (!folder) {
      return null;
    }

    // This method would need to be updated to work with the new structure
    // For now, return null to indicate it needs to be refactored
    return null;
  }
}
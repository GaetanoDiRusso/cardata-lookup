import { VehicleDataRetrievalUseCases } from './VehicleDataRetrievalUseCases';
import { VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { FolderUseCases } from '../folder/FolderUseCases';
import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../../entities/VehicleDataRetrieval';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';

export interface InfractionsVehicleDataRetrievalData {
  hasInfractions: boolean;
}

export interface GenerateInfractionsVehicleDataRetrievalParams {
  folderId: string;
}

export interface GetInfractionsVehicleDataRetrievalResultParams {
  folderId: string;
}

export interface GetInfractionsVehicleDataRetrievalStatusParams {
  folderId: string;
}

export interface GetInfractionsVehicleDataRetrievalByIdParams {
  id: string;
}

export interface GetInfractionsVehicleDataRetrievalsPrevByFolderIdParams {
  folderId: string;
}

export class InfractionsVehicleDataRetrievalUseCase {
  constructor(
    private readonly vehicleDataRetrievalUseCases: VehicleDataRetrievalUseCases,
    private readonly folderUseCases: FolderUseCases,
  ) {}

  async generateInfractionsVehicleDataRetrieval(params: GenerateInfractionsVehicleDataRetrievalParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrieval> {
    // Validate that the folder exists and belongs to the user
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, userContext);
    if (!folder) {
      throw new Error(`Folder with id ${params.folderId} not found or you don't have permission to access it`);
    }

    // Get vehicle data from the folder's vehicle
    const vehicleData = {
      registrationNumber: folder.vehicle.vehicleData.registrationNumber,
      plateNumber: folder.vehicle.vehicleData.plateNumber,
      brand: folder.vehicle.vehicleData.brand,
      model: folder.vehicle.vehicleData.model,
      year: folder.vehicle.vehicleData.year,
      department: 'Montevideo', // Default department - could be stored in folder if needed
    };

    // Generate the vehicle data retrieval (this handles the entire process)
    return await this.vehicleDataRetrievalUseCases.generateVehicleDataRetrieval({
      folderId: params.folderId,
      dataRetrievalType: 'infracciones',
      vehicleData
    }, userContext);
  }

  async getInfractionsVehicleDataRetrievalResult(params: GetInfractionsVehicleDataRetrievalResultParams, userContext: ICurrentUserContext): Promise<InfractionsVehicleDataRetrievalData | null> {
    // First check if the folder belongs to the user
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, userContext);
    if (!folder) {
      return null; // Return null if folder doesn't exist or user doesn't have access
    }

    const vehicleDataRetrieval = await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalByFolderIdAndType({
      folderId: params.folderId,
      dataRetrievalType: 'infracciones'
    }, userContext);

    if (!vehicleDataRetrieval || !vehicleDataRetrieval.isCompleted()) {
      return null;
    }

    return vehicleDataRetrieval.data as InfractionsVehicleDataRetrievalData;
  }

  async getInfractionsVehicleDataRetrievalStatus(params: GetInfractionsVehicleDataRetrievalStatusParams, userContext: ICurrentUserContext): Promise<{
    status: string;
    hasInfractions?: boolean;
    lastUpdated?: string;
    hasMedia: boolean;
  } | null> {
    // First check if the folder belongs to the user
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, userContext);
    if (!folder) {
      return null; // Return null if folder doesn't exist or user doesn't have access
    }

    const vehicleDataRetrieval = await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalByFolderIdAndType({
      folderId: params.folderId,
      dataRetrievalType: 'infracciones'
    }, userContext);

    if (!vehicleDataRetrieval) {
      return null;
    }

    return {
      status: vehicleDataRetrieval.status,
      hasInfractions: vehicleDataRetrieval.isCompleted() ? (vehicleDataRetrieval.data as InfractionsVehicleDataRetrievalData)?.hasInfractions : undefined,
      lastUpdated: vehicleDataRetrieval.updatedAt.toISOString(),
      hasMedia: vehicleDataRetrieval.imageUrls.length > 0 || vehicleDataRetrieval.pdfUrls.length > 0 || vehicleDataRetrieval.videoUrls.length > 0,
    };
  }

  async getInfractionsVehicleDataRetrievalById(params: GetInfractionsVehicleDataRetrievalByIdParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrieval | null> {
    const retrieval = await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalById({ id: params.id }, userContext);
    
    if (!retrieval) {
      return null;
    }

    // Check if the retrieval belongs to a folder owned by the user
    const folder = await this.folderUseCases.findFolderById({ folderId: retrieval.folderId }, userContext);
    if (!folder) {
      return null; // Return null if user doesn't have access to the folder
    }

    return retrieval;
  }

  async getInfractionsVehicleDataRetrievalsPrevByFolderId(params: GetInfractionsVehicleDataRetrievalsPrevByFolderIdParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrievalPrev[]> {
    // First check if the folder belongs to the user
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, userContext);
    if (!folder) {
      return []; // Return empty array if folder doesn't exist or user doesn't have access
    }

    return await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalsPrevByFolderId({ folderId: params.folderId }, userContext);
  }
} 
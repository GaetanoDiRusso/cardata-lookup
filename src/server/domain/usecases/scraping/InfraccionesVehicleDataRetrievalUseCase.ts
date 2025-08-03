import { VehicleDataRetrievalUseCases } from './VehicleDataRetrievalUseCases';
import { VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { FolderUseCases } from '../folder/FolderUseCases';
import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../../entities/VehicleDataRetrieval';

export interface InfractionsVehicleDataRetrievalData {
  hasInfractions: boolean;
}

export interface InfractionsVehicleDataRetrievalRequest {
  folderId: string;
}

export class InfractionsVehicleDataRetrievalUseCase {
  constructor(
    private readonly vehicleDataRetrievalUseCases: VehicleDataRetrievalUseCases,
    private readonly folderUseCases: FolderUseCases,
  ) {}

  async generateInfractionsVehicleDataRetrieval(request: InfractionsVehicleDataRetrievalRequest): Promise<VehicleDataRetrieval> {
    // Validate that the folder exists and get its data
    const folder = await this.folderUseCases.findFolderById(request.folderId);
    if (!folder) {
      throw new Error(`Folder with id ${request.folderId} not found`);
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
    return await this.vehicleDataRetrievalUseCases.generateVehicleDataRetrieval(
      request.folderId,
      'infracciones',
      vehicleData
    );
  }

  async getInfractionsVehicleDataRetrievalResult(folderId: string): Promise<InfractionsVehicleDataRetrievalData | null> {
    const vehicleDataRetrieval = await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalByFolderIdAndType(
      folderId,
      'infracciones'
    );

    if (!vehicleDataRetrieval || !vehicleDataRetrieval.isCompleted()) {
      return null;
    }

    return vehicleDataRetrieval.data as InfractionsVehicleDataRetrievalData;
  }

  async getInfractionsVehicleDataRetrievalStatus(folderId: string): Promise<{
    status: string;
    hasInfractions?: boolean;
    lastUpdated?: string;
    hasMedia: boolean;
  } | null> {
    const vehicleDataRetrieval = await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalByFolderIdAndType(
      folderId,
      'infracciones'
    );

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

  async getInfractionsVehicleDataRetrievalById(id: string): Promise<VehicleDataRetrieval | null> {
    return await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalById(id);
  }

  async getInfractionsVehicleDataRetrievalsPrevByFolderId(folderId: string): Promise<VehicleDataRetrievalPrev[]> {
    return await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalsPrevByFolderId(folderId);
  }
} 
import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../../entities/VehicleDataRetrieval';
import { IVehicleDataRetrievalRepository, ICreateVehicleDataRetrievalData, IUpdateVehicleDataRetrievalData } from '../../interfaces/IScrapingResultRepository';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';

export type CreateVehicleDataRetrievalDTO = ICreateVehicleDataRetrievalData;
export type UpdateVehicleDataRetrievalDTO = IUpdateVehicleDataRetrievalData;

export class VehicleDataRetrievalUseCases {
  constructor(private readonly vehicleDataRetrievalRepository: IVehicleDataRetrievalRepository) {}

  // Create operations
  async createVehicleDataRetrieval(data: CreateVehicleDataRetrievalDTO): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.create(data);
  }

  // Read operations
  async findVehicleDataRetrievalById(id: string): Promise<VehicleDataRetrieval | null> {
    return await this.vehicleDataRetrievalRepository.findById(id);
  }

  async findVehicleDataRetrievalByFolderIdAndType(folderId: string, dataRetrievalType: VehicleDataRetrievalType): Promise<VehicleDataRetrieval | null> {
    return await this.vehicleDataRetrievalRepository.findByFolderIdAndType(folderId, dataRetrievalType);
  }

  async findVehicleDataRetrievalsPrevByFolderId(folderId: string): Promise<VehicleDataRetrievalPrev[]> {
    return await this.vehicleDataRetrievalRepository.findAllPrevByFolderId(folderId);
  }

  // Update operations
  async updateVehicleDataRetrieval(id: string, data: UpdateVehicleDataRetrievalDTO): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.update(id, data);
  }

  async updateVehicleDataRetrievalStatus(id: string, status: VehicleDataRetrievalStatus): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.updateStatus(id, status);
  }

  // Delete operations
  async deleteVehicleDataRetrieval(id: string): Promise<void> {
    await this.vehicleDataRetrievalRepository.delete(id);
  }

  async deleteVehicleDataRetrievalsByFolderId(folderId: string): Promise<void> {
    await this.vehicleDataRetrievalRepository.deleteByFolderId(folderId);
  }

  // Business logic methods
  async startVehicleDataRetrieval(folderId: string, dataRetrievalType: VehicleDataRetrievalType): Promise<VehicleDataRetrieval> {
    // Check if a retrieval already exists for this folder and type
    const existingRetrieval = await this.findVehicleDataRetrievalByFolderIdAndType(folderId, dataRetrievalType);
    
    if (existingRetrieval && existingRetrieval.isInProgress()) {
      throw new Error(`Vehicle data retrieval already in progress for folder ${folderId} and type ${dataRetrievalType}`);
    }

    // If there's an existing retrieval but it's not in progress, create a new one
    // This allows users to start a new retrieval even if there was a previous one

    // Create new retrieval
    return await this.createVehicleDataRetrieval({
      folderId,
      dataRetrievalType,
      status: 'pending',
    });
  }

  async completeVehicleDataRetrieval(
    id: string, 
    data: any, 
    imageUrls: string[] = [], 
    pdfUrls: string[] = [], 
    videoUrls: string[] = []
  ): Promise<VehicleDataRetrieval> {
    return await this.updateVehicleDataRetrieval(id, {
      status: 'completed',
      data,
      imageUrls,
      pdfUrls,
      videoUrls,
      completedAt: new Date(),
    });
  }

  async failVehicleDataRetrieval(
    id: string, 
    errorDetails: string
  ): Promise<VehicleDataRetrieval> {
    return await this.updateVehicleDataRetrieval(id, {
      status: 'failed',
    });
  }
} 
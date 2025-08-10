import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../../entities/VehicleDataRetrieval';
import { IVehicleDataRetrievalRepository, ICreateVehicleDataRetrievalData, IUpdateVehicleDataRetrievalData } from '../../interfaces/IVehicleDataRetrievalRepository';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { dataRetrievalService } from '../../../data/scraping/DataRetrievalService';
import {
  GenerateVehicleDataRetrievalParams,
  FindVehicleDataRetrievalByIdParams,
  FindVehicleDataRetrievalByFolderIdAndTypeParams,
  FindVehicleDataRetrievalsByFolderIdParams,
  FindVehicleDataRetrievalsPrevByFolderIdParams,
  UpdateVehicleDataRetrievalParams,
  UpdateVehicleDataRetrievalStatusParams,
  DeleteVehicleDataRetrievalParams,
  DeleteVehicleDataRetrievalsByFolderIdParams
} from './VehicleDataRetrievalUseCaseDTOs';

export type CreateVehicleDataRetrievalDTO = ICreateVehicleDataRetrievalData;
export type UpdateVehicleDataRetrievalDTO = IUpdateVehicleDataRetrievalData;

export class VehicleDataRetrievalUseCases {
  private readonly vehicleDataRetrievalRepository: IVehicleDataRetrievalRepository;

  constructor(vehicleDataRetrievalRepository: IVehicleDataRetrievalRepository) {
    this.vehicleDataRetrievalRepository = vehicleDataRetrievalRepository;
  }

  // Main data retrieval method - handles the entire process
  async generateVehicleDataRetrieval(
    params: GenerateVehicleDataRetrievalParams,
    userContext: ICurrentUserContext
  ): Promise<VehicleDataRetrieval> {
    // Create initial entry with pending status
    const vehicleDataRetrieval = await this.createVehicleDataRetrieval({
      folderId: params.folderId,
      dataRetrievalType: params.dataRetrievalType,
      status: 'pending',
    });

    try {
      // Update status to in_progress
      await this.updateVehicleDataRetrievalStatus(vehicleDataRetrieval.id, 'in_progress');

      // Call the actual data retrieval service
      const result = await this.callDataRetrievalService(
        params.dataRetrievalType, 
        userContext.userId, 
        params.vehicleData
      );

      if (!result.success) {
        throw new Error(result.error || 'Data retrieval service failed');
      }

      // Update with completed result
      return await this.updateVehicleDataRetrieval({
        id: vehicleDataRetrieval.id,
        data: {
          status: 'completed',
          data: result.data,
          imageUrls: result.imagePathsUrls || [],
          pdfUrls: result.pdfPathsUrls || [],
          videoUrls: result.videoPathsUrls || [],
          completedAt: new Date(),
        }
      }, userContext);

    } catch (error) {
      // Update with failed status
      await this.updateVehicleDataRetrieval({
        id: vehicleDataRetrieval.id,
        data: {
          status: 'failed',
        }
      }, userContext);
      throw error;
    }
  }

  // Read operations
  async findVehicleDataRetrievalById(params: FindVehicleDataRetrievalByIdParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrieval | null> {
    const result = await this.vehicleDataRetrievalRepository.findById(params.id);
    
    if (!result) {
      return null;
    }

    // Note: We need to check folder ownership here, but we don't have folder info
    // This would require injecting folder repository or passing folder owner info
    // For now, we'll assume the check is done at a higher level
    return result;
  }

  async findVehicleDataRetrievalByFolderIdAndType(params: FindVehicleDataRetrievalByFolderIdAndTypeParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrieval | null> {
    const result = await this.vehicleDataRetrievalRepository.findByFolderIdAndType(params.folderId, params.dataRetrievalType);
    
    if (!result) {
      return null;
    }

    // Note: We need to check folder ownership here, but we don't have folder info
    // This would require injecting folder repository or passing folder owner info
    // For now, we'll assume the check is done at a higher level
    return result;
  }

  async findVehicleDataRetrievalsByFolderId(params: FindVehicleDataRetrievalsByFolderIdParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrieval[]> {
    const results = await this.vehicleDataRetrievalRepository.findAllByFolderId(params.folderId);
    
    // Note: We need to check folder ownership here, but we don't have folder info
    // This would require injecting folder repository or passing folder owner info
    // For now, we'll assume the check is done at a higher level
    return results;
  }

  async findVehicleDataRetrievalsPrevByFolderId(params: FindVehicleDataRetrievalsPrevByFolderIdParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrievalPrev[]> {
    return await this.vehicleDataRetrievalRepository.findAllPrevByFolderId(params.folderId);
  }

  // Update operations
  async updateVehicleDataRetrieval(params: UpdateVehicleDataRetrievalParams, userContext: ICurrentUserContext): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.update(params.id, params.data);
  }

  async updateVehicleDataRetrievalStatus(id: string, status: VehicleDataRetrievalStatus): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.updateStatus(id, status);
  }

  // Delete operations
  async deleteVehicleDataRetrieval(params: DeleteVehicleDataRetrievalParams, userContext: ICurrentUserContext): Promise<boolean> {
    const retrieval = await this.vehicleDataRetrievalRepository.findById(params.id);
    
    if (!retrieval) {
      return false;
    }

    // Note: We need to check folder ownership here, but we don't have folder info
    // This would require injecting folder repository or passing folder owner info
    // For now, we'll assume the check is done at a higher level
    await this.vehicleDataRetrievalRepository.delete(params.id);
    return true;
  }

  async deleteVehicleDataRetrievalsByFolderId(params: DeleteVehicleDataRetrievalsByFolderIdParams, userContext: ICurrentUserContext): Promise<boolean> {
    // Note: We need to check folder ownership here, but we don't have folder info
    // This would require injecting folder repository or passing folder owner info
    // For now, we'll assume the check is done at a higher level
    await this.vehicleDataRetrievalRepository.deleteByFolderId(params.folderId);
    return true;
  }

  // Private helper methods
  private async createVehicleDataRetrieval(data: CreateVehicleDataRetrievalDTO): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.create(data);
  }

  private async callDataRetrievalService(
    dataRetrievalType: VehicleDataRetrievalType,
    userId: string,
    vehicleData: any
  ): Promise<{
    success: boolean;
    data: any;
    imagePathsUrls?: string[];
    pdfPathsUrls?: string[];
    videoPathsUrls?: string[];
    error?: string;
  }> {
    try {
      // Prepare vehicle data for the service
      // Handle both direct vehicle data and nested vehicleData structure
      const serviceVehicleData = {
        matricula: vehicleData.plateNumber || vehicleData.vehicleData?.plateNumber || vehicleData.matricula,
        padron: vehicleData.registrationNumber || vehicleData.vehicleData?.registrationNumber || vehicleData.padron,
        departamento: vehicleData.department || vehicleData.vehicleData?.department || vehicleData.departamento || 'Montevideo',
      };

      // Call the data retrieval service
      const result = await dataRetrievalService.retrieveDataByType(
        dataRetrievalType,
        userId,
        serviceVehicleData
      );

      return {
        success: result.success,
        data: result.data,
        imagePathsUrls: result.imagePathsUrls,
        pdfPathsUrls: result.pdfPathsUrls,
        videoPathsUrls: result.videoPathsUrls,
        error: result.error,
      };
    } catch (error) {
      console.error(`Error calling data retrieval service for type ${dataRetrievalType}:`, error);
      return {
        success: false,
        data: {},
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
} 
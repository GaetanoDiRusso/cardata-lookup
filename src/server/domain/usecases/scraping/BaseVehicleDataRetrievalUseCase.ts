import { VehicleDataRetrieval } from '../../entities/VehicleDataRetrieval';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { IVehicleDataRetrievalRepository } from '../../interfaces/IVehicleDataRetrievalRepository';
import { LogEntry, Logger } from '../../utils/Logger';

export abstract class BaseVehicleDataRetrievalUseCase {
  constructor(
    protected readonly vehicleDataRetrievalRepository: IVehicleDataRetrievalRepository
  ) {}

  // Abstract methods that each specific type must implement
  protected abstract getDataRetrievalType(): VehicleDataRetrievalType;
  protected abstract validateParams(params: any): void;
  protected abstract callDataRetrievalService(userId: string, params: any, logger: Logger): Promise<{
    data: any;
    imagePathsUrls?: string[];
    pdfPathsUrls?: string[];
    videoPathsUrls?: string[];
    success: boolean;
    error?: string;
  }>;

  // Common workflow method that orchestrates the entire process
  async generateVehicleDataRetrieval(
    folderId: string,
    params: any,
    userContext: ICurrentUserContext,
    logger: Logger
  ): Promise<VehicleDataRetrieval> {
    // Validate the specific type's parameters
    this.validateParams(params);

    // Create initial entry with pending status
    const vehicleDataRetrieval = await this.createVehicleDataRetrieval({
      folderId,
      dataRetrievalType: this.getDataRetrievalType(),
      status: 'pending',
    });

    logger.info('Created vehicle data retrieval', {
      folderId,
      params,
      userContext,
      vehicleDataRetrieval,
    });

    try {
      // Update status to in_progress
      await this.updateVehicleDataRetrievalStatus(vehicleDataRetrieval.id, 'in_progress');

      logger.info('Updated vehicle data retrieval status to in_progress');

      // Call the specific type's data retrieval service
      const result = await this.callDataRetrievalService(userContext.userId, params, logger);

      logger.info('Received result from data retrieval service');

      logger.info('Updating vehicle data retrieval with completed result');

      const dataRetrievalResultStatus: VehicleDataRetrievalStatus = result.success ? 'completed' : 'failed';

      // Update with completed result
      return await this.updateVehicleDataRetrieval({
        id: vehicleDataRetrieval.id,
        data: {
          // Update the status of the vehicle data retrieval, and the data retrieved
          status: dataRetrievalResultStatus,
          data: result.data,
          imageUrls: result.imagePathsUrls || [],
          pdfUrls: result.pdfPathsUrls || [],
          videoUrls: result.videoPathsUrls || [],
          completedAt: new Date(),
          logs: logger.getLogs(),
        }
      }, userContext);

    } catch (error) {
      logger.error('Error in generateVehicleDataRetrieval', {
        error,
      });

      // Update with failed status
      await this.updateVehicleDataRetrieval({
        id: vehicleDataRetrieval.id,
        data: {
          status: 'failed',
          logs: logger.getLogs(),
        }
      }, userContext);
      throw error;
    }
  }

  // Private helper methods for common operations
  private async createVehicleDataRetrieval(data: {
    folderId: string;
    dataRetrievalType: VehicleDataRetrievalType;
    status: VehicleDataRetrievalStatus;
  }): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.create(data);
  }

  private async updateVehicleDataRetrievalStatus(id: string, status: VehicleDataRetrievalStatus): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.updateStatus(id, status);
  }

  private async updateVehicleDataRetrieval(data: {
    id: string;
    data: {
      status: VehicleDataRetrievalStatus;
      data?: any;
      imageUrls?: string[];
      pdfUrls?: string[];
      videoUrls?: string[];
      completedAt?: Date;
      logs?: LogEntry[];
    };
  }, userContext: ICurrentUserContext): Promise<VehicleDataRetrieval> {
    return await this.vehicleDataRetrievalRepository.update(data.id, data.data);
  }
} 
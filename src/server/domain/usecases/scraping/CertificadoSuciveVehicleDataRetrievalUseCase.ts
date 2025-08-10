import { VehicleDataRetrieval } from '../../entities/VehicleDataRetrieval';
import { FolderUseCases } from '../folder/FolderUseCases';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { BaseVehicleDataRetrievalUseCase } from './BaseVehicleDataRetrievalUseCase';
import { dataRetrievalService } from '../../../data/scraping/DataRetrievalService';
import { IVehicleDataRetrievalRepository } from '../../interfaces/IVehicleDataRetrievalRepository';

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
    params: GenerateCertificadoSuciveVehicleDataRetrievalParams
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

    // Call the SUCIVE certificate service - it will throw on error
    const result = await dataRetrievalService.emitirCertificadoSucive(
      userId, 
      vehicleData, 
      params.requestNumber
    );

    // If we get here, the service succeeded
    return {
      data: result.data,
      imagePathsUrls: result.imagePathsUrls,
      pdfPathsUrls: result.pdfPathsUrls,
      videoPathsUrls: result.videoPathsUrls,
    };
  }

  // Public method that orchestrates the entire SUCIVE certificate workflow
  async generateCertificadoSuciveVehicleDataRetrieval(
    params: GenerateCertificadoSuciveVehicleDataRetrievalParams, 
    userContext: ICurrentUserContext
  ): Promise<VehicleDataRetrieval> {
    return this.generateVehicleDataRetrieval(params.folderId, params, userContext);
  }
} 
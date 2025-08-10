import { BaseVehicleDataRetrievalUseCase } from './BaseVehicleDataRetrievalUseCase';
import { VehicleDataRetrievalType } from '@/models/PScrapingResult';
import { FolderUseCases } from '../folder/FolderUseCases';
import { ICurrentUserContext } from '../../interfaces/ICurrentUserContext';
import { VehicleDataRetrieval } from '../../entities/VehicleDataRetrieval';
import { dataRetrievalService } from '../../../data/scraping/DataRetrievalService';
import { IVehicleDataRetrievalRepository } from '../../interfaces/IVehicleDataRetrievalRepository';

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
    params: GenerateSolicitarCertificadoVehicleDataRetrievalParams
  ): Promise<{
    data: any;
    imagePathsUrls?: string[];
    pdfPathsUrls?: string[];
    videoPathsUrls?: string[];
  }> {
    const folder = await this.folderUseCases.findFolderById({ folderId: params.folderId }, { userId });
    if (!folder) {
      throw new Error(`No se encontró la carpeta con ID ${params.folderId} o no tienes permisos para acceder a ella`);
    }

    const vehicleData = {
      matricula: folder.vehicle.vehicleData.plateNumber,
      padron: folder.vehicle.vehicleData.registrationNumber,
      departamento: folder.vehicle.vehicleData.department,
    };

    // Call the SUCIVE certificate solicitation service with requester data - it will throw on error
    const result = await dataRetrievalService.solicitarCertificadoSucive(userId, vehicleData, params.requesterData);

    // If we get here, the service succeeded
    return {
      data: result.data,
      imagePathsUrls: result.imagePathsUrls,
      pdfPathsUrls: result.pdfPathsUrls,
      videoPathsUrls: result.videoPathsUrls,
    };
  }

  // Public method that orchestrates the entire SUCIVE certificate solicitation workflow
  async generateSolicitarCertificadoVehicleDataRetrieval(
    params: GenerateSolicitarCertificadoVehicleDataRetrievalParams, 
    userContext: ICurrentUserContext
  ): Promise<VehicleDataRetrieval> {
    return this.generateVehicleDataRetrieval(params.folderId, params, userContext);
  }
} 
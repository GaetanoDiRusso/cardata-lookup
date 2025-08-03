import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../entities/VehicleDataRetrieval';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';

export interface ICreateVehicleDataRetrievalData {
  folderId: string;
  dataRetrievalType: VehicleDataRetrievalType;
  status: VehicleDataRetrievalStatus;
  data?: any;
  imageUrls?: string[];
  pdfUrls?: string[];
  videoUrls?: string[];
}

export interface IUpdateVehicleDataRetrievalData {
  status?: VehicleDataRetrievalStatus;
  data?: any;
  imageUrls?: string[];
  pdfUrls?: string[];
  videoUrls?: string[];
  startedAt?: Date;
  completedAt?: Date;
}

export interface IVehicleDataRetrievalRepository {
  // Create operations
  create(data: ICreateVehicleDataRetrievalData): Promise<VehicleDataRetrieval>;
  
  // Read operations
  findById(id: string): Promise<VehicleDataRetrieval | null>;
  findByFolderIdAndType(folderId: string, dataRetrievalType: VehicleDataRetrievalType): Promise<VehicleDataRetrieval | null>;
  findAllPrevByFolderId(folderId: string): Promise<VehicleDataRetrievalPrev[]>;
  
  // Update operations
  update(id: string, data: IUpdateVehicleDataRetrievalData): Promise<VehicleDataRetrieval>;
  updateStatus(id: string, status: VehicleDataRetrievalStatus): Promise<VehicleDataRetrieval>;
  
  // Delete operations
  delete(id: string): Promise<void>;
  deleteByFolderId(folderId: string): Promise<void>;
} 
import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../entities/VehicleDataRetrieval';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';
import { LogEntry } from '@/server/domain/utils/Logger';

export interface ICreateVehicleDataRetrievalData {
  folderId: string;
  dataRetrievalType: VehicleDataRetrievalType;
  status: VehicleDataRetrievalStatus;
  data?: any;
  imageUrls?: string[];
  pdfUrls?: string[];
  videoUrls?: string[];
  logs?: LogEntry[];
}

export interface IUpdateVehicleDataRetrievalData {
  status?: VehicleDataRetrievalStatus;
  data?: any;
  imageUrls?: string[];
  pdfUrls?: string[];
  videoUrls?: string[];
  startedAt?: Date;
  completedAt?: Date;
  logs?: LogEntry[];
}

export interface IVehicleDataRetrievalRepository {
  // Create operations
  create(data: ICreateVehicleDataRetrievalData): Promise<VehicleDataRetrieval>;
  
  // Read operations
  findById(id: string): Promise<VehicleDataRetrieval | null>;
  findByFolderIdAndType(folderId: string, dataRetrievalType: VehicleDataRetrievalType): Promise<VehicleDataRetrieval | null>;
  findAllByFolderId(folderId: string): Promise<VehicleDataRetrieval[]>;
  findAllPrevByFolderId(folderId: string): Promise<VehicleDataRetrievalPrev[]>;
  
  // Update operations
  update(id: string, data: IUpdateVehicleDataRetrievalData): Promise<VehicleDataRetrieval>;
  updateStatus(id: string, status: VehicleDataRetrievalStatus): Promise<VehicleDataRetrieval>;
  
  // Delete operations
  delete(id: string): Promise<void>;
  deleteByFolderId(folderId: string): Promise<void>;
} 
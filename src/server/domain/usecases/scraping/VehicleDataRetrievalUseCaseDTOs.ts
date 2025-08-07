import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';

export interface GenerateVehicleDataRetrievalParams {
  folderId: string;
  dataRetrievalType: VehicleDataRetrievalType;
  vehicleData: any;
}

export interface FindVehicleDataRetrievalByIdParams {
  id: string;
}

export interface FindVehicleDataRetrievalByFolderIdAndTypeParams {
  folderId: string;
  dataRetrievalType: VehicleDataRetrievalType;
}

export interface FindVehicleDataRetrievalsByFolderIdParams {
  folderId: string;
}

export interface FindVehicleDataRetrievalsPrevByFolderIdParams {
  folderId: string;
}

export interface UpdateVehicleDataRetrievalParams {
  id: string;
  data: {
    status?: VehicleDataRetrievalStatus;
    data?: any;
    imageUrls?: string[];
    pdfUrls?: string[];
    videoUrls?: string[];
    startedAt?: Date;
    completedAt?: Date;
  };
}

export interface UpdateVehicleDataRetrievalStatusParams {
  id: string;
  status: VehicleDataRetrievalStatus;
}

export interface DeleteVehicleDataRetrievalParams {
  id: string;
}

export interface DeleteVehicleDataRetrievalsByFolderIdParams {
  folderId: string;
} 
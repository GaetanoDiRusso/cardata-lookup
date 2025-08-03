export type VehicleDataRetrievalType = 
  | 'infracciones' 
  | 'deuda' 
  | 'certificado_sucive' 
  | 'solicitar_certificado' 
  | 'consultar_matricula' 
  | 'consultar_convenio';

export type VehicleDataRetrievalStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface PVehicleDataRetrieval {
  id: string;
  folderId: string;
  dataRetrievalType: VehicleDataRetrievalType;
  status: VehicleDataRetrievalStatus;
  data: any; // The structured data result
  imageUrls: string[]; // URLs to stored image files
  pdfUrls: string[]; // URLs to stored PDF files
  videoUrls: string[]; // URLs to stored video files
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface PVehicleDataRetrievalPrev {
  id: string;
  folderId: string;
  dataRetrievalType: VehicleDataRetrievalType;
  status: VehicleDataRetrievalStatus;
  lastUpdated: string; // ISO date string
  hasMedia: boolean;
  dataSummary?: string; // Brief summary of the data
} 
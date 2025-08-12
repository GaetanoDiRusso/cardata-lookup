import { PVehicleDataRetrieval, PVehicleDataRetrievalPrev, VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';
import { LogEntry } from '../utils/Logger';

export class VehicleDataRetrieval {
  constructor(
    public readonly id: string,
    public readonly folderId: string,
    public readonly dataRetrievalType: VehicleDataRetrievalType,
    public readonly status: VehicleDataRetrievalStatus,
    public readonly data: any,
    public readonly imageUrls: string[],
    public readonly pdfUrls: string[],
    public readonly videoUrls: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly logs: LogEntry[],
    public readonly startedAt?: Date,
    public readonly completedAt?: Date,
  ) {}

  toPresentation(): PVehicleDataRetrieval {
    return {
      id: this.id,
      folderId: this.folderId,
      dataRetrievalType: this.dataRetrievalType,
      status: this.status,
      data: this.data,
      imageUrls: this.imageUrls,
      pdfUrls: this.pdfUrls,
      videoUrls: this.videoUrls,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
    };
  }

  toPrev(): PVehicleDataRetrievalPrev {
    return {
      id: this.id,
      folderId: this.folderId,
      dataRetrievalType: this.dataRetrievalType,
      status: this.status,
      lastUpdated: this.updatedAt.toISOString(),
      hasMedia: this.hasMedia(),
      dataSummary: this.getDataSummary(),
    };
  }

  private hasMedia(): boolean {
    return this.imageUrls.length > 0 || this.pdfUrls.length > 0 || this.videoUrls.length > 0;
  }

  private getDataSummary(): string | undefined {
    switch (this.dataRetrievalType) {
      case 'infracciones':
        return this.data?.hasInfractions ? 'Has infractions' : 'No infractions';
      case 'deuda':
        return this.data?.hasDebt ? 'Has debt' : 'No debt';
      case 'certificado_sucive':
        return this.data?.certificateNumber ? `Certificate: ${this.data.certificateNumber}` : 'No certificate';
      default:
        return undefined;
    }
  }

  // Business logic methods
  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isFailed(): boolean {
    return this.status === 'failed';
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  isInProgress(): boolean {
    return this.status === 'in_progress';
  }
}

export class VehicleDataRetrievalPrev {
  constructor(
    public readonly id: string,
    public readonly folderId: string,
    public readonly dataRetrievalType: VehicleDataRetrievalType,
    public readonly status: VehicleDataRetrievalStatus,
    public readonly lastUpdated: string,
    public readonly hasMedia: boolean,
    public readonly dataSummary?: string,
  ) {}
} 
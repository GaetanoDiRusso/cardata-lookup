import mongoose from 'mongoose';
import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '@/server/domain/entities/VehicleDataRetrieval';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';

const VehicleDataRetrievalSchema = new mongoose.Schema({
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: [true, 'Please provide the folder id'],
    index: true,
  },
  dataRetrievalType: {
    type: String,
    required: [true, 'Please provide the data retrieval type'],
    enum: ['infracciones', 'deuda', 'certificado_sucive', 'solicitar_certificado', 'consultar_matricula', 'consultar_convenio'],
    index: true,
  },
  status: {
    type: String,
    required: [true, 'Please provide the status'],
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending',
    index: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  imageUrls: [{
    type: String,
  }],
  pdfUrls: [{
    type: String,
  }],
  videoUrls: [{
    type: String,
  }],
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Compound indexes for efficient queries
VehicleDataRetrievalSchema.index({ folderId: 1, dataRetrievalType: 1 });
VehicleDataRetrievalSchema.index({ status: 1, createdAt: -1 });

// Transform MongoDB document to domain entity
export const VehicleDataRetrievalSchemaToDomain = (retrieval: any): VehicleDataRetrieval => {
  return new VehicleDataRetrieval(
    retrieval._id.toString(),
    retrieval.folderId.toString(),
    retrieval.dataRetrievalType,
    retrieval.status,
    retrieval.data,
    retrieval.imageUrls || [],
    retrieval.pdfUrls || [],
    retrieval.videoUrls || [],
    retrieval.createdAt,
    retrieval.updatedAt,
    retrieval.startedAt,
    retrieval.completedAt,
  );
};

// Transform MongoDB document to preview domain entity
export const VehicleDataRetrievalSchemaToPrevDomain = (retrieval: any): VehicleDataRetrievalPrev => {
  return new VehicleDataRetrievalPrev(
    retrieval._id.toString(),
    retrieval.folderId.toString(),
    retrieval.dataRetrievalType,
    retrieval.status,
    retrieval.updatedAt.toISOString(),
    (retrieval.imageUrls?.length || 0) + (retrieval.pdfUrls?.length || 0) + (retrieval.videoUrls?.length || 0) > 0,
    undefined, // dataSummary will be calculated in the entity
  );
};

export default mongoose.models.VehicleDataRetrieval || mongoose.model('VehicleDataRetrieval', VehicleDataRetrievalSchema); 
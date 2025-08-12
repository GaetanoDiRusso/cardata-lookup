import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../../domain/entities/VehicleDataRetrieval';
import { IVehicleDataRetrievalRepository, ICreateVehicleDataRetrievalData, IUpdateVehicleDataRetrievalData } from '../../domain/interfaces/IVehicleDataRetrievalRepository';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';
import VehicleDataRetrievalModel, { VehicleDataRetrievalSchemaToDomain, VehicleDataRetrievalSchemaToPrevDomain } from './VehicleDataRetrievalSchema';

export class VehicleDataRetrievalRepositoryMongoDBImp implements IVehicleDataRetrievalRepository {
  async create(data: ICreateVehicleDataRetrievalData): Promise<VehicleDataRetrieval> {
    const vehicleDataRetrieval = new VehicleDataRetrievalModel({
      folderId: data.folderId,
      dataRetrievalType: data.dataRetrievalType,
      status: data.status,
      data: data.data || {},
      imageUrls: data.imageUrls || [],
      pdfUrls: data.pdfUrls || [],
      videoUrls: data.videoUrls || [],
      logs: data.logs || [],
    });

    const savedResult = await vehicleDataRetrieval.save();
    return VehicleDataRetrievalSchemaToDomain(savedResult);
  }

  async findById(id: string): Promise<VehicleDataRetrieval | null> {
    const result = await VehicleDataRetrievalModel.findById(id);
    return result ? VehicleDataRetrievalSchemaToDomain(result) : null;
  }

  async findByFolderIdAndType(folderId: string, dataRetrievalType: VehicleDataRetrievalType): Promise<VehicleDataRetrieval | null> {
    const result = await VehicleDataRetrievalModel.findOne({ folderId, dataRetrievalType }).sort({ createdAt: -1 });
    return result ? VehicleDataRetrievalSchemaToDomain(result) : null;
  }

  async findAllByFolderId(folderId: string): Promise<VehicleDataRetrieval[]> {
    const results = await VehicleDataRetrievalModel.find({ folderId }).sort({ createdAt: -1 });
    return results.map(VehicleDataRetrievalSchemaToDomain);
  }

  async findAllPrevByFolderId(folderId: string): Promise<VehicleDataRetrievalPrev[]> {
    const results = await VehicleDataRetrievalModel.find({ folderId }).sort({ createdAt: -1 });
    return results.map(VehicleDataRetrievalSchemaToPrevDomain);
  }

  async update(id: string, data: IUpdateVehicleDataRetrievalData): Promise<VehicleDataRetrieval> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.status !== undefined) updateData.status = data.status;
    if (data.data !== undefined) updateData.data = data.data;
    if (data.startedAt !== undefined) updateData.startedAt = data.startedAt;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;

    // Handle media URLs
    if (data.imageUrls !== undefined) updateData.imageUrls = data.imageUrls;
    if (data.pdfUrls !== undefined) updateData.pdfUrls = data.pdfUrls;
    if (data.videoUrls !== undefined) updateData.videoUrls = data.videoUrls;

    if (data.logs !== undefined) updateData.logs = data.logs;

    const result = await VehicleDataRetrievalModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!result) {
      throw new Error(`VehicleDataRetrieval with id ${id} not found`);
    }

    return VehicleDataRetrievalSchemaToDomain(result);
  }

  async updateStatus(id: string, status: VehicleDataRetrievalStatus): Promise<VehicleDataRetrieval> {
    return await this.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    await VehicleDataRetrievalModel.findByIdAndDelete(id);
  }

  async deleteByFolderId(folderId: string): Promise<void> {
    await VehicleDataRetrievalModel.deleteMany({ folderId });
  }
} 
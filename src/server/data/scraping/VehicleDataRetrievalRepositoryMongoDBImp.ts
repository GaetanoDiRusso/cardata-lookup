import mongoose from 'mongoose';
import { VehicleDataRetrieval, VehicleDataRetrievalPrev } from '../../domain/entities/VehicleDataRetrieval';
import { IVehicleDataRetrievalRepository, ICreateVehicleDataRetrievalData, IUpdateVehicleDataRetrievalData } from '../../domain/interfaces/IVehicleDataRetrievalRepository';
import { VehicleDataRetrievalType, VehicleDataRetrievalStatus } from '@/models/PScrapingResult';
import VehicleDataRetrievalModel, { VehicleDataRetrievalSchemaToDomain, VehicleDataRetrievalSchemaToPrevDomain } from './VehicleDataRetrievalSchema';
import { connectDB } from '../mongodb';

export class VehicleDataRetrievalRepositoryMongoDBImp implements IVehicleDataRetrievalRepository {
  async create(data: ICreateVehicleDataRetrievalData): Promise<VehicleDataRetrieval> {
    await connectDB()

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
    await connectDB()

    const result = await VehicleDataRetrievalModel.findById(id);
    return result ? VehicleDataRetrievalSchemaToDomain(result) : null;
  }

  async findByFolderIdAndType(folderId: string, dataRetrievalType: VehicleDataRetrievalType): Promise<VehicleDataRetrieval | null> {
    await connectDB()

    const result = await VehicleDataRetrievalModel.findOne({ folderId, dataRetrievalType }).sort({ createdAt: -1 });
    return result ? VehicleDataRetrievalSchemaToDomain(result) : null;
  }

  async findAllByFolderId(folderId: string): Promise<VehicleDataRetrieval[]> {
    await connectDB()

    const results = await VehicleDataRetrievalModel.find({ folderId }).sort({ createdAt: -1 });
    return results.map(VehicleDataRetrievalSchemaToDomain);
  }

  async findAllPrevByFolderId(folderId: string): Promise<VehicleDataRetrievalPrev[]> {
    await connectDB()

    const results = await VehicleDataRetrievalModel.find({ folderId }).sort({ createdAt: -1 });
    return results.map(VehicleDataRetrievalSchemaToPrevDomain);
  }

  async findLatestByTypeAndUser(dataRetrievalType: VehicleDataRetrievalType, userId: string): Promise<VehicleDataRetrieval | null> {
    await connectDB()

    // Convert userId string to ObjectId for proper MongoDB comparison
    const userIdObjectId = new mongoose.Types.ObjectId(userId);

    // Find the latest retrieval of the specified type for the user
    // We need to join with folders to get the user ID
    const result = await VehicleDataRetrievalModel.aggregate([
      {
        $lookup: {
          from: 'folders',
          localField: 'folderId',
          foreignField: '_id',
          as: 'folder'
        }
      },
      {
        $unwind: '$folder'
      },
      {
        $match: {
          'folder.ownerId': userIdObjectId,
          dataRetrievalType: dataRetrievalType
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (result.length === 0) {
      return null;
    }

    return VehicleDataRetrievalSchemaToDomain(result[0]);
  }



  async update(id: string, data: IUpdateVehicleDataRetrievalData): Promise<VehicleDataRetrieval> {
    await connectDB()

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
    await connectDB()

    return await this.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    await connectDB()

    await VehicleDataRetrievalModel.findByIdAndDelete(id);
  }

  async deleteByFolderId(folderId: string): Promise<void> {
    await connectDB()

    await VehicleDataRetrievalModel.deleteMany({ folderId });
  }
} 
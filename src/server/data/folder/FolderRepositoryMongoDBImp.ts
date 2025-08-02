import FolderSchema, { FolderSchemaToDomain, FolderSchemaToPrevDomain } from './FolderSchema'
import VehicleSchema from '../vehicle/VehicleSchema'
import PersonSchema from '../person/PersonSchema'
import { ICreateFolderData, IFolderRepository } from '@/server/domain/interfaces/IFolderRepository'
import { connectDB } from '../mongodb'
import { FolderPrev, Folder } from '@/server/domain/entities/Folder'
import mongoose from 'mongoose'
import { Person } from '@/server/domain/entities/Person'

export class FolderRepositoryMongoDBImp implements IFolderRepository {
  async findAllPrevByUserId(userId: string): Promise<FolderPrev[]> {
    await connectDB()
    const folders = await FolderSchema.find({ userId })
    return folders.map(FolderSchemaToPrevDomain)
  }
  async findByFolderId(folderId: string): Promise<Folder | null> {
    await connectDB()
    const folder = await FolderSchema.findById(folderId)
    return folder ? FolderSchemaToDomain(folder) : null
  }

  /**
   * Create a new folder.
   * Also creates the vehicle, buyer and seller.
   * @param folder - The folder to create with the vehicle, buyer and seller data
   * @returns The created folder
   */
  async create(folder: ICreateFolderData): Promise<Folder> {
    try {
      await connectDB()
      
      // Start a new session for the transaction
      const session = await mongoose.startSession()

      try {
        // Start the transaction
        session.startTransaction()

        // Create the vehicle.
        // Note that the vehicle is not reusable, it is created for each folder.
        const vehicle = await VehicleSchema.create([folder.vehicle], { session })

        // Create the buyer
        // Note that the buyer is not reusable, it is created for each folder.
        const buyer = await PersonSchema.create([folder.buyer], { session })

        // Create the seller
        // Note that the seller is not reusable, it is created for each folder.
        const seller = await PersonSchema.create([folder.seller], { session })
        
        // Create the folder with references to the created entities
        const result = await FolderSchema.create([{
          ownerId: folder.ownerId,
          vehicle: vehicle[0]._id,
          buyer: buyer[0]._id,
          seller: seller[0]._id,
        }], { session })

        // Update the vehicle, buyer and seller with the folder id
        await VehicleSchema.updateOne({ _id: vehicle[0]._id }, { $set: { folderId: result[0]._id } }, { session })
        await PersonSchema.updateOne({ _id: buyer[0]._id }, { $set: { folderId: result[0]._id } }, { session })
        await PersonSchema.updateOne({ _id: seller[0]._id }, { $set: { folderId: result[0]._id } }, { session })
        
        // Commit the transaction
        await session.commitTransaction()
        
        // Populate the references to get the full data
        const populatedFolder = await FolderSchema.findById(result[0]._id)
          .populate('vehicle')
          .populate('buyer')
          .populate('seller')
        
        return FolderSchemaToDomain(populatedFolder)
      } catch (error) {
        // If an error occurs, abort the transaction
        await session.abortTransaction()
        throw error
      } finally {
        // End the session
        session.endSession()
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async delete(folderId: string): Promise<void> {
    await connectDB()
    await FolderSchema.findByIdAndDelete(folderId)
  }
} 
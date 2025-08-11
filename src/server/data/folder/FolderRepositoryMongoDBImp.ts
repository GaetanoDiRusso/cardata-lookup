import FolderSchema, { FolderSchemaToDomain, FolderSchemaToPrevDomain } from './FolderSchema'
import VehicleSchema from '../vehicle/VehicleSchema'
import PersonSchema from '../person/PersonSchema'
import { ICreateFolderData, IFolderRepository } from '@/server/domain/interfaces/IFolderRepository'
import { connectDB } from '../mongodb'
import { FolderPrev, Folder } from '@/server/domain/entities/Folder'
import mongoose from 'mongoose'

export class FolderRepositoryMongoDBImp implements IFolderRepository {
  async findAllPrevByUserId(userId: string): Promise<FolderPrev[]> {
    await connectDB()
    const folders = await FolderSchema.find({ ownerId: userId })
      .populate('vehicle')
      .populate('buyer')
      .populate('seller')
    return folders.map(FolderSchemaToPrevDomain)
  }

  async findByFolderId(folderId: string): Promise<Folder | null> {
    await connectDB()
    const folder = await FolderSchema.findById(folderId)
      .populate('vehicle')
      .populate('buyer')
      .populate('seller')
    return folder ? FolderSchemaToDomain(folder) : null
  }

  async findByVehicleRegistration(registrationNumber: string): Promise<FolderPrev[]> {
    await connectDB()
    const vehicles = await VehicleSchema.find({ registrationNumber })
      .populate({
        path: 'folderId',
        populate: [
          { path: 'vehicle' },
          { path: 'buyer' },
          { path: 'seller' }
        ]
      })
    
    const folders = vehicles.map(v => v.folderId).filter(Boolean)
    return folders.map(FolderSchemaToPrevDomain)
  }

  async findByPersonIdentification(identificationNumber: string): Promise<FolderPrev[]> {
    await connectDB()
    const people = await PersonSchema.find({ identificationNumber })
      .populate({
        path: 'folderId',
        populate: [
          { path: 'vehicle' },
          { path: 'buyer' },
          { path: 'seller' }
        ]
      })
    
    const folders = people.map(p => p.folderId).filter(Boolean)
    return folders.map(FolderSchemaToPrevDomain)
  }

  /**
   * Create a new folder.
   * Creates vehicle and people entries for this specific folder.
   * @param folder - The folder to create with the vehicle, buyer and seller data (optional)
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

        console.log('>>> folder.vehicle', folder.vehicle);

        // Step 1: Create the vehicle (without folderId)
        const vehicle = await VehicleSchema.create([{
          ...folder.vehicle,
          // folderId will be updated after folder creation
        }], { session })

        console.log('>>> vehicle RESULTS', vehicle);

        // Step 2: Create the buyer (only if provided)
        let buyer = null;
        if (folder.buyer) {
          buyer = await PersonSchema.create([{
            ...folder.buyer,
            role: 'buyer',
            // folderId will be updated after folder creation
          }], { session })
        }

        // Step 3: Create the seller (only if provided)
        let seller = null;
        if (folder.seller) {
          seller = await PersonSchema.create([{
            ...folder.seller,
            role: 'seller',
            // folderId will be updated after folder creation
          }], { session })
        }
        
        // Step 4: Create the folder with references to the created entities
        const folderDoc = await FolderSchema.create([{
          ownerId: folder.ownerId,
          vehicle: vehicle[0]._id,
          buyer: buyer ? buyer[0]._id : undefined,
          seller: seller ? seller[0]._id : undefined,
        }], { session })

        const folderId = folderDoc[0]._id

        // Step 5: Update the vehicle, buyer, and seller with the folder id
        await VehicleSchema.updateOne(
          { _id: vehicle[0]._id }, 
          { $set: { folderId: folderId } }, 
          { session }
        )
        
        if (buyer) {
          await PersonSchema.updateOne(
            { _id: buyer[0]._id }, 
            { $set: { folderId: folderId } }, 
            { session }
          )
        }
        
        if (seller) {
          await PersonSchema.updateOne(
            { _id: seller[0]._id }, 
            { $set: { folderId: folderId } }, 
            { session }
          )
        }
        
        // Commit the transaction
        await session.commitTransaction()
        
        // Populate the references to get the full data
        const populatedFolder = await FolderSchema.findById(folderId)
          .populate('vehicle')
          .populate('buyer')
          .populate('seller')
        
        return FolderSchemaToDomain(populatedFolder)
      } catch (error) {
        console.error(error)
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
    
    // Start a new session for the transaction
    const session = await mongoose.startSession()

    try {
      // Start the transaction
      session.startTransaction()

      // Delete the folder
      await FolderSchema.findByIdAndDelete(folderId, { session })
      
      // Delete the vehicle for this folder
      await VehicleSchema.deleteMany({ folderId }, { session })
      
      // Delete the people for this folder
      await PersonSchema.deleteMany({ folderId }, { session })
      
      // Commit the transaction
      await session.commitTransaction()
    } catch (error) {
      // If an error occurs, abort the transaction
      await session.abortTransaction()
      throw error
    } finally {
      // End the session
      session.endSession()
    }
  }
} 
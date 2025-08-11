import mongoose from 'mongoose';

import { Folder, FolderPrev } from '@/server/domain/entities/Folder';
import { VehicleSchemaToDomain, VehicleSchemaToPrevDomain } from '../vehicle/VehicleSchema';
import { PersonSchemaToDomain, PersonSchemaToPrevDomain } from '../person/PersonSchema';

const FolderSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the owner id'],
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Please provide the vehicle id'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: false, // Made optional
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: false, // Made optional
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const FolderSchemaToDomain = (folder: any): Folder => {
  const vehicle = VehicleSchemaToDomain(folder.vehicle)
  const seller = folder.seller ? PersonSchemaToDomain(folder.seller) : null
  const buyer = folder.buyer ? PersonSchemaToDomain(folder.buyer) : null

  return new Folder(
    folder._id.toString(),
    folder.ownerId.toString(),
    vehicle,
    seller,
    buyer,
    folder.createdAt,
    folder.updatedAt,
  )
}

export const FolderSchemaToPrevDomain = (folder: any): FolderPrev => {
  const vehicle = VehicleSchemaToDomain(folder.vehicle)
  const buyer = folder.buyer ? PersonSchemaToDomain(folder.buyer) : null

  return new FolderPrev(
    folder._id.toString(),
    folder.ownerId.toString(),
    vehicle,
    buyer,
    folder.createdAt,
  )
}

export default mongoose.models.Folder || mongoose.model('Folder', FolderSchema);
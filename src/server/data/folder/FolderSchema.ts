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
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: [true, 'Please provide the buyer id'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: [true, 'Please provide the seller id'],
  },
  buyerExtraData: {
    type: Object,
  },
  sellerExtraData: {
    type: Object,
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
  const buyer = PersonSchemaToDomain(folder.buyer)
  const seller = PersonSchemaToDomain(folder.seller)

  return new Folder(
    folder._id.toString(),
    folder.ownerId.toString(),
    vehicle,
    buyer,
    seller,
    folder.buyerExtraData,
    folder.sellerExtraData,
    folder.createdAt,
    folder.updatedAt,
  )
}

export const FolderSchemaToPrevDomain = (folder: any): FolderPrev => {
  const vehicle = VehicleSchemaToPrevDomain(folder.vehicle)
  const buyer = PersonSchemaToPrevDomain(folder.buyer)
  const seller = PersonSchemaToPrevDomain(folder.seller)

  return new FolderPrev(folder._id.toString(), folder.ownerId.toString(), vehicle, buyer, seller)
}

export default mongoose.models.Folder || mongoose.model('Folder', FolderSchema);
import { Vehicle, VehiclePrev } from '@/server/domain/entities/Vehicle';
import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: false, // Optional - will be updated after folder creation
    },
    registrationNumber: {
        type: String,
        required: [true, 'Please provide the registration number'],
        // Not unique - same vehicle can appear in multiple folders with different plates
    },
    plateNumber: {
        type: String,
        required: [true, 'Please provide the plate number'],
    },
    brand: {
        type: String,
        required: [true, 'Please provide the vehicle brand'],
    },
    model: {
        type: String,
        required: [true, 'Please provide the vehicle model'],
    },
    year: {
        type: Number,
        required: [true, 'Please provide the vehicle year'],
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

// Create a compound index on registrationNumber and folderId to ensure uniqueness per folder
VehicleSchema.index({ registrationNumber: 1, folderId: 1 }, { unique: true });

// Create an index on registrationNumber to easily find all instances of the same vehicle
VehicleSchema.index({ registrationNumber: 1 });

export const VehicleSchemaToDomain = (vehicle: any): Vehicle => {
    return new Vehicle(
        vehicle._id.toString(),
        {
            registrationNumber: vehicle.registrationNumber,
            plateNumber: vehicle.plateNumber,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
        },
        vehicle.folderId?.toString() || '',
        vehicle.createdAt,
        vehicle.updatedAt,
    )
}

export const VehicleSchemaToPrevDomain = (vehicle: any): VehiclePrev => {
    return new VehiclePrev(
        vehicle._id.toString(),
        {
            registrationNumber: vehicle.registrationNumber,
            plateNumber: vehicle.plateNumber,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
        },
        vehicle.folderId?.toString() || '',
        vehicle.createdAt,
        vehicle.updatedAt,
    )
}

export default mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema); 
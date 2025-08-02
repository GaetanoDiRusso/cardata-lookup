import { isValidDepartmentCode } from '@/server/constants/departments';
import { Vehicle, VehiclePrev } from '@/server/domain/entities/Vehicle';
import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: false, // This is because we need to create the vehicle before the folder
    },
    plateNumber: {
        type: String,
        required: [true, 'Please provide the plate number'],
    },
    registrationNumber: {
        type: String,
        required: [true, 'Please provide the registration number'],
    },
    department: {
        type: String,
        required: [true, 'Please provide the department'],
        validate: {
          validator: (value: string) => isValidDepartmentCode(value),
          message: 'Invalid department code'
        },
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
    type: {
        type: String,
        required: [true, 'Please specify the vehicle type'],
    },
    cylinders: {
        type: Number,
        required: [true, 'Please provide the number of cylinders'],
    },
    fuel: {
        type: String,
        required: [true, 'Please provide the fuel type'],
    },
    attributes: {
        type: [String],
        required: [true, 'Please provide the vehicle attribute'],
    },
    engineCapacity: {
        type: Number,
        required: [true, 'Please provide the engine capacity'],
    },
    totalWeight: {
        type: Number,
        required: [true, 'Please provide the total weight'],
    },
    engineNumber: {
        type: String,
        required: [true, 'Please provide the engine number'],
    },
    chassisNumber: {
        type: String,
        required: [true, 'Please provide the chassis number'],
    },
    axles: {
        type: Number,
        required: [true, 'Please provide the number of axles'],
    },
    passengers: {
        type: Number,
        required: [true, 'Please provide the passenger capacity'],
    },
    ownerName: {
        type: String,
        required: [true, 'Please provide the owner name'],
    },
    ownerIdentification: {
        type: String,
        required: [true, 'Please provide the owner identification'],
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

export const VehicleSchemaToDomain = (vehicle: any): Vehicle => {
    return new Vehicle(
        vehicle._id.toString(),
        {
            plateNumber: vehicle.plateNumber,
            registrationNumber: vehicle.registrationNumber,
            department: vehicle.department,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            cylinders: vehicle.cylinders,
            fuel: vehicle.fuel,
            attribute: vehicle.attribute,
            engineCapacity: vehicle.engineCapacity,
            totalWeight: vehicle.totalWeight,
            engineNumber: vehicle.engineNumber,
            chassisNumber: vehicle.chassisNumber,
            axles: vehicle.axles,
            passengers: vehicle.passengers,
            ownerName: vehicle.ownerName,
            ownerIdentification: vehicle.ownerIdentification,
        },
        vehicle.folderId.toString(),
        vehicle.createdAt,
        vehicle.updatedAt,
    )
}

export const VehicleSchemaToPrevDomain = (vehicle: any): VehiclePrev => {
    return new VehiclePrev(
        vehicle._id.toString(),
        {
            plateNumber: vehicle.plateNumber,
            registrationNumber: vehicle.registrationNumber,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
        },
        vehicle.folderId.toString(),
        vehicle.createdAt,
        vehicle.updatedAt,
    )
}

export default mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema); 
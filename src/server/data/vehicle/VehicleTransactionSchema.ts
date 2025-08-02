import { PVehicleTransaction } from '@/models/PFolder';
import mongoose from 'mongoose';
import { PersonSchemaToPPerson } from '../person/PersonSchema';

const VehicleTransactionSchema = new mongoose.Schema({
    // Reference to the user who created this transaction
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the user who created this transaction'],
    },

    // References to other entities
    vehicle: {
        plateNumber: {
            type: String,
            required: [true, 'Please provide the license plate'],
        },
        registrationNumber: {
            type: String,
            required: [true, 'Please provide the registration number'],
        },
        department: {
            type: String,
            required: [true, 'Please provide the department'],
        },
        brand: {
            type: String,
            required: [true, 'Please provide the brand'],
        },
        model: {
            type: String,
            required: [true, 'Please provide the model'],
        },
        year: {
            type: Number,
            required: [true, 'Please provide the year'],
        },
        type: {
            type: String,
            required: [true, 'Please provide the type'],
        },
        cylinders: {
            type: Number,
            required: [true, 'Please provide the cylinders'],
        },
        fuel: {
            type: String,
            required: [true, 'Please provide the fuel'],
        },
        attribute: {
            type: String,
            required: false,
        },
        engineCapacity: {
            type: String,
            required: [true, 'Please provide the engine capacity'],
        },
        totalWeight: {
            type: Number,
            required: [true, 'Please provide the total weight'],
        },
        engineNumber: {
            type: String,
            required: [true, 'Please provide the motor number'],
        },
        chassisNumber: {
            type: String,
            required: [true, 'Please provide the chassis number'],
        },
        axles: {
            type: Number,
            required: [true, 'Please provide the axles'],
        },
        passengers: {
            type: Number,
            required: [true, 'Please provide the passengers'],
        },
        owner: {
            type: String,
            required: [true, 'Please provide the owner'],
        },
        ownerIdentification: {
            type: String,
            required: [true, 'Please provide the owner identification'],
        },
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: [true, 'Please provide the seller reference'],
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: [true, 'Please provide the buyer reference'],
    },

    // Transaction Details
    transactionDate: {
        type: Date,
        default: Date.now,
        required: false,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled', 'Rejected'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'Check', 'Other'],
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    notes: {
        type: String,
        required: false,
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

export default mongoose.models.VehicleTransaction || mongoose.model('VehicleTransaction', VehicleTransactionSchema);

export const VehicleTransactionSchemaToPVehicleTransaction = (vehicleTransaction: any): PVehicleTransaction => {
    return {
        id: vehicleTransaction._id.toString(),
        vehicle: {
            plateNumber: vehicleTransaction.vehicle.plateNumber,
            registrationNumber: vehicleTransaction.vehicle.registrationNumber,
            department: vehicleTransaction.vehicle.department,
            brand: vehicleTransaction.vehicle.brand,
            model: vehicleTransaction.vehicle.model,
            year: vehicleTransaction.vehicle.year,
            type: vehicleTransaction.vehicle.type,
            cylinders: vehicleTransaction.vehicle.cylinders,
            fuel: vehicleTransaction.vehicle.fuel,
            engineCapacity: vehicleTransaction.vehicle.engineCapacity,
            totalWeight: vehicleTransaction.vehicle.totalWeight,
            engineNumber: vehicleTransaction.vehicle.engineNumber,
            chassisNumber: vehicleTransaction.vehicle.chassisNumber,
            axles: vehicleTransaction.vehicle.axles,
            passengers: vehicleTransaction.vehicle.passengers,
            owner: vehicleTransaction.vehicle.owner,
            ownerIdentification: vehicleTransaction.vehicle.ownerIdentification,
            attribute: vehicleTransaction.vehicle.attribute,
        },
        buyer: PersonSchemaToPPerson(vehicleTransaction.buyer),
        seller: PersonSchemaToPPerson(vehicleTransaction.seller),
        buyerExtraData: vehicleTransaction.buyerExtraData,
        sellerExtraData: vehicleTransaction.sellerExtraData,
        createdAt: vehicleTransaction.createdAt,
        updatedAt: vehicleTransaction.updatedAt,
    };
};

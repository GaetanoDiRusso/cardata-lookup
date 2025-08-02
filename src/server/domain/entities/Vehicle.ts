import { PVehicle, PVehiclePrev } from "@/models/PVehicle";

export type VehicleData = Omit<PVehicle, 'id'>;

export class Vehicle {
    constructor(
        readonly id: string,
        readonly vehicleData: VehicleData,
        readonly folderId: string,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    toPresentation(): PVehicle {
        return {
            id: this.id,
            plateNumber: this.vehicleData.plateNumber,
            registrationNumber: this.vehicleData.registrationNumber,
            department: this.vehicleData.department,
            brand: this.vehicleData.brand,
            model: this.vehicleData.model,
            year: this.vehicleData.year,
            type: this.vehicleData.type,
            cylinders: this.vehicleData.cylinders,
            fuel: this.vehicleData.fuel,
            attribute: this.vehicleData.attribute,
            engineCapacity: this.vehicleData.engineCapacity,
            totalWeight: this.vehicleData.totalWeight,
            engineNumber: this.vehicleData.engineNumber,
            chassisNumber: this.vehicleData.chassisNumber,
            axles: this.vehicleData.axles,
            passengers: this.vehicleData.passengers,
            ownerName: this.vehicleData.ownerName,
            ownerIdentification: this.vehicleData.ownerIdentification,
        }
    }
}

type VehicleDataPrev = Omit<PVehiclePrev, 'id'>;

export class VehiclePrev {
    constructor(
        readonly id: string,
        readonly vehicleDataPrev: VehicleDataPrev,
        readonly folderId: string,
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    toPresentation(): PVehiclePrev {
        return {
            id: this.id,
            plateNumber: this.vehicleDataPrev.plateNumber,
            registrationNumber: this.vehicleDataPrev.registrationNumber,
            brand: this.vehicleDataPrev.brand,
            model: this.vehicleDataPrev.model,
            year: this.vehicleDataPrev.year,
        }
    }
}

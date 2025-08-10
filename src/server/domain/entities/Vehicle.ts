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
            registrationNumber: this.vehicleData.registrationNumber,
            plateNumber: this.vehicleData.plateNumber,
            brand: this.vehicleData.brand,
            model: this.vehicleData.model,
            year: this.vehicleData.year,
            department: this.vehicleData.department,
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
            registrationNumber: this.vehicleDataPrev.registrationNumber,
            plateNumber: this.vehicleDataPrev.plateNumber,
            brand: this.vehicleDataPrev.brand,
            model: this.vehicleDataPrev.model,
            year: this.vehicleDataPrev.year,
        }
    }
}

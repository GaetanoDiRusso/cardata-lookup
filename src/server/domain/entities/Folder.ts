import { Person, PersonPrev } from "./Person";
import { Vehicle, VehiclePrev } from "./Vehicle";
import { PFolder, PFolderPrev } from "@/models/PFolder";

export class Folder {
    constructor(
        readonly id: string,
        readonly ownerId: string, // User who owns this folder
        readonly vehicle: Vehicle,
        readonly seller: Person, // Person selling the vehicle
        readonly buyer: Person, // Person buying the vehicle
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    toPresentation(): PFolder {
        return {
            id: this.id,
            ownerId: this.ownerId,
            vehicle: this.vehicle.toPresentation(),
            seller: this.seller.toPresentation(),
            buyer: this.buyer.toPresentation(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}

export class FolderPrev {
    constructor(
        readonly id: string,
        readonly ownerId: string,
        readonly vehicle: Vehicle,
        readonly buyer: Person,
        readonly createdAt: Date,
    ) {}

    toPresentation(): PFolderPrev {
        return {
            id: this.id,
            ownerId: this.ownerId,
            vehicle: {
                brand: this.vehicle.vehicleData.brand,
                model: this.vehicle.vehicleData.model,
                year: this.vehicle.vehicleData.year,
                registrationNumber: this.vehicle.vehicleData.registrationNumber,
                plateNumber: this.vehicle.vehicleData.plateNumber,
            },
            buyerName: this.buyer.name,
            lastUpdated: this.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
        }
    }
}

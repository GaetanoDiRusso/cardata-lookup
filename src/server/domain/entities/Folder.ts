import { Person, PersonPrev } from "./Person";
import { Vehicle, VehiclePrev } from "./Vehicle";
import { PFolder, PFolderPrev } from "@/models/PFolder";
import { VehicleDataRetrieval } from "./VehicleDataRetrieval";

export class Folder {
    private vehicleDataRetrievals: VehicleDataRetrieval[] = [];

    constructor(
        readonly id: string,
        readonly ownerId: string, // User who owns this folder
        readonly vehicle: Vehicle,
        readonly seller: Person | null, // Person selling the vehicle (optional)
        readonly buyer: Person | null, // Person buying the vehicle (optional)
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    toPresentation(): PFolder {
        return {
            id: this.id,
            ownerId: this.ownerId,
            vehicle: this.vehicle.toPresentation(),
            seller: this.seller?.toPresentation() || null,
            buyer: this.buyer?.toPresentation() || null,
            vehicleDataRetrievals: this.vehicleDataRetrievals.map(retrieval => retrieval.toPresentation()),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    setVehicleDataRetrievals(vehicleDataRetrievals: VehicleDataRetrieval[]): Folder {
        this.vehicleDataRetrievals = vehicleDataRetrievals;
        return this;
    }
}

export class FolderPrev {
    constructor(
        readonly id: string,
        readonly ownerId: string,
        readonly vehicle: Vehicle,
        readonly buyer: Person | null, // Made optional
        readonly createdAt: Date,
    ) {}

    toPresentation(): PFolderPrev {
        console.log('FolderPrev toPresentation', this);
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
            buyerName: this.buyer?.name || null,
            lastUpdated: this.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
        }
    }
}

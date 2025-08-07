import { PVehicle, PVehiclePrev } from "./PVehicle";
import { PPerson, PPersonPrev } from "./PPerson";
import { PVehicleDataRetrieval } from "./PScrapingResult";

export interface PFolder {
    id: string;
    ownerId: string; // User who owns this folder
    vehicle: PVehicle;
    seller: PPerson; // Person selling the vehicle
    buyer: PPerson; // Person buying the vehicle
    vehicleDataRetrievals: PVehicleDataRetrieval[]; // All vehicle data retrievals for this folder
    createdAt: Date;
    updatedAt: Date;
}

export interface PFolderPrev {
    id: string;
    ownerId: string;
    vehicle: {
        brand: string;
        model: string;
        year: number;
        registrationNumber: string;
        plateNumber: string;
    };
    buyerName: string;
    lastUpdated: string; // ISO date string
}

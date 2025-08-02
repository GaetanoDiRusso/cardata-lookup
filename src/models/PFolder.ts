import { PVehicle, PVehiclePrev } from "./PVehicle";
import { PPerson, PPersonPrev } from "./PPerson";

export interface PFolder {
    id: string;
    ownerId: string;
    vehicle: PVehicle;
    buyer: PPerson;
    seller: PPerson;
    buyerExtraData?: {};
    sellerExtraData?: {};
    createdAt: Date;
    updatedAt: Date;
}


export interface PFolderPrev {
    id: string;
    ownerId: string;
    vehiclePrev: PVehiclePrev;
    buyerPrev: PPersonPrev;
    sellerPrev: PPersonPrev;
}

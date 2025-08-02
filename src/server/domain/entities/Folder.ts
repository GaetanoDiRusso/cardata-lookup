import { Person, PersonPrev } from "./Person";
import { Vehicle, VehiclePrev } from "./Vehicle";
import { PFolder, PFolderPrev } from "@/models/PFolder";
export class Folder {
    constructor(
        readonly id: string,
        readonly ownerId: string,
        readonly vehicle: Vehicle,
        readonly buyer: Person,
        readonly seller: Person,
        readonly buyerExtraData: {},
        readonly sellerExtraData: {},
        readonly createdAt: Date,
        readonly updatedAt: Date,
    ) {}

    toPresentation(): PFolder {
        return {
            id: this.id,
            ownerId: this.ownerId,
            vehicle: this.vehicle.toPresentation(),
            buyer: this.buyer.toPresentation(),
            seller: this.seller.toPresentation(),
            buyerExtraData: this.buyerExtraData,
            sellerExtraData: this.sellerExtraData,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}

export class FolderPrev {
    constructor(
        readonly id: string,
        readonly ownerId: string,
        readonly vehiclePrev: VehiclePrev,
        readonly buyerPrev: PersonPrev,
        readonly sellerPrev: PersonPrev,
    ) {}

    toPresentation(): PFolderPrev {
        return {
            id: this.id,
            ownerId: this.ownerId,
            vehiclePrev: this.vehiclePrev.toPresentation(),
            buyerPrev: this.buyerPrev.toPresentation(),
            sellerPrev: this.sellerPrev.toPresentation(),
        }
    }
}

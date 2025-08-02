import { PPerson } from "@/models/PPerson";
import { Folder, FolderPrev } from "../entities/Folder";
import { VehicleData } from "../entities/Vehicle";
import { PVehicleTransaction } from "@/models/PFolder";

export interface ICreateFolderData {
    ownerId: string;
    vehicle: VehicleData;
    buyer: Omit<PPerson, 'id'>;
    seller: Omit<PPerson, 'id'>;
}

export interface IFolderRepository {
    /**
     * Find all folders by user id
     * @param userId - The id of the user
     * @returns An array of folders
     */
    findAllPrevByUserId(userId: string): Promise<FolderPrev[]>;

    /**
     * Find a folder by id
     * @param folderId - The id of the folder
     * @returns The folder or null if it doesn't exist
     */
    findByFolderId(folderId: string): Promise<Folder | null>;

    /**
     * Create a new folder.
     * Also creates the vehicle, buyer and seller.
     * @param folder - The folder to create
     * @returns The created folder
     */
    create(folder: ICreateFolderData): Promise<Folder>;

    /**
     * Delete a folder by id
     * The folder, vehicle, buyer and seller are NOT deleted.
     * @param folderId - The id of the folder
     */
    delete(folderId: string): Promise<void>;
}

export interface CreateVehicleTransactionDTO {
    vehicle: any; // TODO: Replace with proper vehicle type
    buyer: {
        identificationNumber: string;
        name: string;
        dateOfBirth: Date;
    };
    seller: {
        identificationNumber: string;
        name: string;
        dateOfBirth: Date;
    };
    createdByUserId: string;
    buyerExtraData?: any;
    sellerExtraData?: any;
}

export interface IVehicleTransactionRepository {
    createVehicleTransaction(vehicleTransaction: CreateVehicleTransactionDTO): Promise<PVehicleTransaction>;
}
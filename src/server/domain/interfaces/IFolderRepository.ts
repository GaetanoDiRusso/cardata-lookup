import { PPerson } from "@/models/PPerson";
import { Folder, FolderPrev } from "../entities/Folder";
import { VehicleData } from "../entities/Vehicle";

export interface ICreateFolderData {
    ownerId: string;
    vehicle: VehicleData;
    seller: Omit<PPerson, 'id'>;
    buyer: Omit<PPerson, 'id'>;
}

export interface IFolderRepository {
    /**
     * Find all folders by user id (preview version)
     * @param userId - The id of the user
     * @returns An array of folder previews
     */
    findAllPrevByUserId(userId: string): Promise<FolderPrev[]>;

    /**
     * Find a folder by id
     * @param folderId - The id of the folder
     * @returns The folder or null if it doesn't exist
     */
    findByFolderId(folderId: string): Promise<Folder | null>;

    /**
     * Find all folders for a specific vehicle (by registration number)
     * @param registrationNumber - The vehicle registration number
     * @returns An array of folder previews for that vehicle
     */
    findByVehicleRegistration(registrationNumber: string): Promise<FolderPrev[]>;

    /**
     * Find all folders for a specific person (by identification number)
     * @param identificationNumber - The person identification number
     * @returns An array of folder previews for that person
     */
    findByPersonIdentification(identificationNumber: string): Promise<FolderPrev[]>;

    /**
     * Create a new folder.
     * Creates vehicle and people entries for this specific folder.
     * @param folder - The folder to create
     * @returns The created folder
     */
    create(folder: ICreateFolderData): Promise<Folder>;

    /**
     * Delete a folder by id
     * The folder, vehicle, and people entries for this folder are deleted.
     * @param folderId - The id of the folder
     */
    delete(folderId: string): Promise<void>;
}
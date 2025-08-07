import { PFolder } from "@/models/PFolder";
import { Folder, FolderPrev } from "../../entities/Folder";
import { ICreateFolderData, IFolderRepository } from "../../interfaces/IFolderRepository";
import { VehicleDataRetrievalUseCases } from "../scraping/VehicleDataRetrievalUseCases";
import { ICurrentUserContext } from "../../interfaces/ICurrentUserContext";
import { 
  CreateFolderParams, 
  FindFolderByIdParams, 
  DeleteFolderParams,
  FindFoldersByVehicleRegistrationParams,
  FindFoldersByPersonIdentificationParams
} from "./FolderUseCaseDTOs";

export type CreateNewFolderDTO = ICreateFolderData

export class FolderUseCases {
    private readonly folderRepository: IFolderRepository;
    private readonly vehicleDataRetrievalUseCases: VehicleDataRetrievalUseCases;

    constructor(
        folderRepository: IFolderRepository,
        vehicleDataRetrievalUseCases: VehicleDataRetrievalUseCases
    ) {
        this.folderRepository = folderRepository;
        this.vehicleDataRetrievalUseCases = vehicleDataRetrievalUseCases;
    }

    async createFolder(params: CreateFolderParams, userContext: ICurrentUserContext): Promise<Folder> {
        const result = await this.folderRepository.create({
            ...params.folder,
            ownerId: userContext.userId
        });
        return result;
    }

    async findFoldersPrevByUserId(params: {}, userContext: ICurrentUserContext): Promise<FolderPrev[]> {
        return await this.folderRepository.findAllPrevByUserId(userContext.userId);
    }

    async findFolderById(params: FindFolderByIdParams, userContext: ICurrentUserContext): Promise<Folder | null> {
        const folder = await this.folderRepository.findByFolderId(params.folderId);
        
        if (!folder) {
            return null;
        }

        // Check if the folder belongs to the user
        if (folder.ownerId !== userContext.userId) {
            return null; // Return null instead of throwing to maintain consistency
        }

        // Get all vehicle data retrievals for this folder (full objects, not previews)
        const vehicleDataRetrievals = await this.vehicleDataRetrievalUseCases.findVehicleDataRetrievalsByFolderId({
            folderId: params.folderId
        }, userContext);

        // Create a new Folder instance with the vehicle data retrievals
        const res = new Folder(
            folder.id,
            folder.ownerId,
            folder.vehicle,
            folder.seller,
            folder.buyer,
            folder.createdAt,
            folder.updatedAt,
        );
        res.setVehicleDataRetrievals(vehicleDataRetrievals);

        return res;
    }

    async findFoldersByVehicleRegistration(params: FindFoldersByVehicleRegistrationParams, userContext: ICurrentUserContext): Promise<FolderPrev[]> {
        return await this.folderRepository.findByVehicleRegistration(params.registrationNumber);
    }

    async findFoldersByPersonIdentification(params: FindFoldersByPersonIdentificationParams, userContext: ICurrentUserContext): Promise<FolderPrev[]> {
        return await this.folderRepository.findByPersonIdentification(params.identificationNumber);
    }

    async deleteFolder(params: DeleteFolderParams, userContext: ICurrentUserContext): Promise<boolean> {
        // First check if the folder exists and belongs to the user
        const folder = await this.folderRepository.findByFolderId(params.folderId);
        
        if (!folder || folder.ownerId !== userContext.userId) {
            return false; // Return false if folder doesn't exist or user doesn't own it
        }

        await this.folderRepository.delete(params.folderId);
        return true;
    }
}
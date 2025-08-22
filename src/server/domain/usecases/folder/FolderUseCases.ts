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
import { FolderValidator } from "../../validators/FolderValidator";
import { CustomError, errorCodeEnum } from "@/server/utils/CustomError";

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
        // Validate the folder data
        const validationResult = FolderValidator.validate({
            vehicle: params.folder.vehicle,
            buyer: params.folder.buyer,
            seller: params.folder.seller
        });

        if (!validationResult.isValid) {
            const allErrors = FolderValidator.getAllErrors(validationResult);
            throw new CustomError(
                errorCodeEnum.VALIDATION_ERROR,
                `Error de validación: ${allErrors.join(', ')}`
            );
        }

        const result = await this.folderRepository.create({
            ...params.folder,
            ownerId: userContext.userId
        });
        return result;
    }

    async findFoldersPrevByUserId(_params: {}, userContext: ICurrentUserContext): Promise<FolderPrev[]> {
        const folders = await this.folderRepository.findAllPrevByUserId(userContext.userId);
        
        // Sort folders by createdAt date in descending order (newest first)
        return folders.sort((a, b) => {
            const dateA = a.createdAt.getTime();
            const dateB = b.createdAt.getTime();
            return dateB - dateA; // Descending order (newest first)
        });
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
        const folders = await this.folderRepository.findByVehicleRegistration(params.registrationNumber);
        
        // Sort folders by createdAt date in descending order (newest first)
        return folders.sort((a, b) => {
            const dateA = a.createdAt.getTime();
            const dateB = b.createdAt.getTime();
            return dateB - dateA; // Descending order (newest first)
        });
    }

    async findFoldersByPersonIdentification(params: FindFoldersByPersonIdentificationParams, userContext: ICurrentUserContext): Promise<FolderPrev[]> {
        const folders = await this.folderRepository.findByPersonIdentification(params.identificationNumber);
        
        // Sort folders by createdAt date in descending order (newest first)
        return folders.sort((a, b) => {
            const dateA = a.createdAt.getTime();
            const dateB = b.createdAt.getTime();
            return dateB - dateA; // Descending order (newest first)
        });
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
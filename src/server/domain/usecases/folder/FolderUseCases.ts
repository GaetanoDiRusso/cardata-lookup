import { PFolder } from "@/models/PFolder";
import { Folder, FolderPrev } from "../../entities/Folder";
import { ICreateFolderData, IFolderRepository } from "../../interfaces/IFolderRepository";

export type CreateNewFolderDTO = ICreateFolderData

export class FolderUseCases {
    constructor(private readonly folderRepository: IFolderRepository) { }

    async createFolder(folder: CreateNewFolderDTO): Promise<Folder> {
        const result = await this.folderRepository.create(folder);
        return result;
    }

    async findFoldersPrevByUserId(userId: string): Promise<FolderPrev[]> {
        return await this.folderRepository.findAllPrevByUserId(userId);
    }

    async findFolderById(folderId: string): Promise<Folder | null> {
        return await this.folderRepository.findByFolderId(folderId);
    }

    async findFoldersByVehicleRegistration(registrationNumber: string): Promise<FolderPrev[]> {
        return await this.folderRepository.findByVehicleRegistration(registrationNumber);
    }

    async findFoldersByPersonIdentification(identificationNumber: string): Promise<FolderPrev[]> {
        return await this.folderRepository.findByPersonIdentification(identificationNumber);
    }

    async deleteFolder(folderId: string): Promise<void> {
        await this.folderRepository.delete(folderId);
    }
}
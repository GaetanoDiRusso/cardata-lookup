import { PFolder } from "@/models/PFolder";
import { Folder } from "../../entities/Folder";
import { ICreateFolderData, IFolderRepository } from "../../interfaces/IFolderRepository";

export type CreateNewFolderDTO = ICreateFolderData

export class FolderUseCases {
    constructor(private readonly folderRepository: IFolderRepository) { }

    async createFolder(folder: CreateNewFolderDTO): Promise<Folder> {
        const result = await this.folderRepository.create(folder);
        return result;
    }
}
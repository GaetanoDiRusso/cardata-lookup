import { ICreateFolderData } from '../../interfaces/IFolderRepository';

export interface CreateFolderParams {
  folder: Omit<ICreateFolderData, 'ownerId'>;
}

export interface FindFolderByIdParams {
  folderId: string;
}

export interface DeleteFolderParams {
  folderId: string;
}

export interface FindFoldersByVehicleRegistrationParams {
  registrationNumber: string;
}

export interface FindFoldersByPersonIdentificationParams {
  identificationNumber: string;
}

// Response types (these are the domain entities, not DTOs)
// The use cases will return the domain entities directly
// The server actions will convert them to presentation models 
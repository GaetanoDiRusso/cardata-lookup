"use server";

import { CustomError, errorCodeEnum, errorMessageEnum, createCustomErrorResponse } from "@/server/utils/CustomError";
import { ServerActionResponse } from "@/models/ServerActionResponse";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { getHomeRoute } from "@/constants/navigationRoutes";
import { PFolder, PFolderPrev } from "@/models/PFolder";
import { folderUseCase } from "@/server/di";
import { CreateNewFolderDTO } from "@/server/domain/usecases/folder/FolderUseCases";
import { ICurrentUserContext } from "@/server/domain/interfaces/ICurrentUserContext";
import { sanitizeVehicle, sanitizePerson } from "@/shared/validators/ValidationRules";

export type CreateNewFolderData = Omit<CreateNewFolderDTO, 'ownerId'>;

export const createNewFolder = async (folderData: CreateNewFolderData): Promise<ServerActionResponse<PFolder>> => {
  const session = await getServerSession(authOptions);
  const theError = new CustomError(errorCodeEnum.INVALID_SESSION, errorMessageEnum.INVALID_SESSION);
  if (!(session?.user as any)?.id) {
    return {
      ok: false,
      error: createCustomErrorResponse(theError),
    }
  }

  const userContext: ICurrentUserContext = {
    userId: (session?.user as any).id,
  };

  try {
    // Sanitize the data
    const sanitizedFolderData: CreateNewFolderDTO = {
      vehicle: {
        ...sanitizeVehicle(folderData.vehicle),
        department: sanitizeVehicle(folderData.vehicle).department as any
      },
      buyer: sanitizePerson(folderData.buyer),
      seller: sanitizePerson(folderData.seller),
      ownerId: userContext.userId
    };

    const result = await folderUseCase.createFolder({
      folder: sanitizedFolderData,
    }, userContext);

    revalidatePath(getHomeRoute());

    return {
      ok: true,
      data: result.toPresentation(),
    }
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        ok: false,
        error: createCustomErrorResponse(error),
      }
    }
    
    return {
      ok: false,
      error: createCustomErrorResponse(
        new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Error interno del servidor')
      ),
    }
  }
};

export const getUserFolders = async (): Promise<ServerActionResponse<PFolderPrev[]>> => {
  const session = await getServerSession(authOptions);
  const theError = new CustomError(errorCodeEnum.INVALID_SESSION, errorMessageEnum.INVALID_SESSION);
  if (!(session?.user as any)?.id) {
    return {
      ok: false,
      error: createCustomErrorResponse(theError),
    }
  }

  const userContext: ICurrentUserContext = {
    userId: (session?.user as any).id,
  };

  try {
    console.log('getUserFolders', userContext);
    const folders = await folderUseCase.findFoldersPrevByUserId({}, userContext);
    return {
      ok: true,
      data: folders.map(folder => folder.toPresentation()),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to fetch user folders')),
    }
  }
};

export const getFolderById = async (folderId: string): Promise<ServerActionResponse<PFolder>> => {
  const session = await getServerSession(authOptions);
  const theError = new CustomError(errorCodeEnum.INVALID_SESSION, errorMessageEnum.INVALID_SESSION);
  if (!(session?.user as any)?.id) {
    return {
      ok: false,
      error: createCustomErrorResponse(theError),
    }
  }

  const userContext: ICurrentUserContext = {
    userId: (session?.user as any).id,
  };

  try {
    const folder = await folderUseCase.findFolderById({ folderId }, userContext);
    
    if (!folder) {
      return {
        ok: false,
        error: createCustomErrorResponse(new CustomError(errorCodeEnum.INVALID_ACCOUNT, 'Folder not found or you don\'t have permission to access it')),
      }
    }

    return {
      ok: true,
      data: folder.toPresentation(),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to fetch folder')),
    }
  }
};

export const deleteFolder = async (folderId: string): Promise<ServerActionResponse<void>> => {
  const session = await getServerSession(authOptions);
  const theError = new CustomError(errorCodeEnum.INVALID_SESSION, errorMessageEnum.INVALID_SESSION);
  if (!(session?.user as any)?.id) {
    return {
      ok: false,
      error: createCustomErrorResponse(theError),
    }
  }

  const userContext: ICurrentUserContext = {
    userId: (session?.user as any).id,
  };

  try {
    const success = await folderUseCase.deleteFolder({ folderId }, userContext);
    
    if (!success) {
      return {
        ok: false,
        error: createCustomErrorResponse(new CustomError(errorCodeEnum.INVALID_ACCOUNT, 'Folder not found or you don\'t have permission to delete it')),
      }
    }
    
    revalidatePath(getHomeRoute());

    return {
      ok: true,
      data: undefined,
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to delete folder')),
    }
  }
};

export const getFoldersByVehicleRegistration = async (registrationNumber: string): Promise<ServerActionResponse<PFolderPrev[]>> => {
  const session = await getServerSession(authOptions);
  const theError = new CustomError(errorCodeEnum.INVALID_SESSION, errorMessageEnum.INVALID_SESSION);
  if (!(session?.user as any)?.id) {
    return {
      ok: false,
      error: createCustomErrorResponse(theError),
    }
  }

  const userContext: ICurrentUserContext = {
    userId: (session?.user as any).id,
  };

  try {
    const folders = await folderUseCase.findFoldersByVehicleRegistration({ registrationNumber }, userContext);
    return {
      ok: true,
      data: folders.map(folder => folder.toPresentation()),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to fetch folders by vehicle')),
    }
  }
};

export const getFoldersByPersonIdentification = async (identificationNumber: string): Promise<ServerActionResponse<PFolderPrev[]>> => {
  const session = await getServerSession(authOptions);
  const theError = new CustomError(errorCodeEnum.INVALID_SESSION, errorMessageEnum.INVALID_SESSION);
  if (!(session?.user as any)?.id) {
    return {
      ok: false,
      error: createCustomErrorResponse(theError),
    }
  }

  const userContext: ICurrentUserContext = {
    userId: (session?.user as any).id,
  };

  try {
    const folders = await folderUseCase.findFoldersByPersonIdentification({ identificationNumber }, userContext);
    return {
      ok: true,
      data: folders.map(folder => folder.toPresentation()),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to fetch folders by person')),
    }
  }
};
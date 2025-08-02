"use server";

import { CustomError, errorCodeEnum, errorMessageEnum, createCustomErrorResponse } from "@/server/utils/CustomError";
import { ServerActionResponse } from "@/models/ServerActionResponse";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { getHomeRoute } from "@/constants/navigationRoutes";
import { PFolder } from "@/models/PFolder";
import { folderUseCase } from "@/server/di";
import { CreateNewFolderDTO } from "@/server/domain/usecases/folder/FolderUseCases";

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

  const result = await folderUseCase.createFolder({
    ...folderData,
    ownerId: (session?.user as any).id,
  });

  revalidatePath(getHomeRoute());

  return {
    ok: true,
    data: result.toPresentation(),
  }
};
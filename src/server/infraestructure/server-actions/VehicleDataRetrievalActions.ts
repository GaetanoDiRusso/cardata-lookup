"use server";

import { CustomError, errorCodeEnum, errorMessageEnum, createCustomErrorResponse } from "@/server/utils/CustomError";
import { ServerActionResponse } from "@/models/ServerActionResponse";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { getHomeRoute } from "@/constants/navigationRoutes";
import { PVehicleDataRetrieval, VehicleDataRetrievalType } from "@/models/PScrapingResult";
import { infractionsVehicleDataRetrievalUseCase, vehicleDataRetrievalUseCase } from "@/server/di";
import { ICurrentUserContext } from "@/server/domain/interfaces/ICurrentUserContext";

export type GenerateInfractionsDataRetrievalData = {
  folderId: string;
};

export type InfractionsVehicleDataRetrievalData = {
  hasInfractions: boolean;
};

export const generateInfractionsDataRetrieval = async (data: GenerateInfractionsDataRetrievalData): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await infractionsVehicleDataRetrievalUseCase.generateInfractionsVehicleDataRetrieval({
      folderId: data.folderId,
    }, userContext);

    revalidatePath(getHomeRoute());

    return {
      ok: true,
      data: result.toPresentation(),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to generate infractions data retrieval')),
    }
  }
};

export const getInfractionsDataRetrievalResult = async (folderId: string): Promise<ServerActionResponse<InfractionsVehicleDataRetrievalData | null>> => {
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
    const result = await infractionsVehicleDataRetrievalUseCase.getInfractionsVehicleDataRetrievalResult({
      folderId
    }, userContext);
    
    return {
      ok: true,
      data: result,
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to get infractions data retrieval result')),
    }
  }
};

export const getInfractionsDataRetrievalStatus = async (folderId: string): Promise<ServerActionResponse<{
  status: string;
  hasInfractions?: boolean;
  lastUpdated?: string;
  hasMedia: boolean;
} | null>> => {
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
    const result = await infractionsVehicleDataRetrievalUseCase.getInfractionsVehicleDataRetrievalStatus({
      folderId
    }, userContext);
    
    return {
      ok: true,
      data: result,
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to get infractions data retrieval status')),
    }
  }
};

export const getInfractionsDataRetrievalById = async (retrievalId: string): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await infractionsVehicleDataRetrievalUseCase.getInfractionsVehicleDataRetrievalById({
      id: retrievalId
    }, userContext);
    
    if (!result) {
      return {
        ok: false,
        error: createCustomErrorResponse(new CustomError(errorCodeEnum.INVALID_ACCOUNT, 'Infractions vehicle data retrieval not found or you don\'t have permission to access it')),
      }
    }

    return {
      ok: true,
      data: result.toPresentation(),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to get infractions vehicle data retrieval')),
    }
  }
};

export const getVehicleDataRetrievalById = async (retrievalId: string): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await vehicleDataRetrievalUseCase.findVehicleDataRetrievalById({
      id: retrievalId
    }, userContext);
    
    if (!result) {
      return {
        ok: false,
        error: createCustomErrorResponse(new CustomError(errorCodeEnum.INVALID_ACCOUNT, 'Vehicle data retrieval not found or you don\'t have permission to access it')),
      }
    }

    return {
      ok: true,
      data: result.toPresentation(),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to get vehicle data retrieval')),
    }
  }
};

export const getVehicleDataRetrievalsByFolderId = async (folderId: string): Promise<ServerActionResponse<PVehicleDataRetrieval[]>> => {
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
    const results = await vehicleDataRetrievalUseCase.findVehicleDataRetrievalsByFolderId({
      folderId
    }, userContext);
    
    return {
      ok: true,
      data: results.map(result => result.toPresentation()),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to get vehicle data retrievals')),
    }
  }
};

export const deleteVehicleDataRetrieval = async (retrievalId: string): Promise<ServerActionResponse<void>> => {
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
    const success = await vehicleDataRetrievalUseCase.deleteVehicleDataRetrieval({
      id: retrievalId
    }, userContext);
    
    if (!success) {
      return {
        ok: false,
        error: createCustomErrorResponse(new CustomError(errorCodeEnum.INVALID_ACCOUNT, 'Vehicle data retrieval not found or you don\'t have permission to delete it')),
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
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to delete vehicle data retrieval')),
    }
  }
};

export const deleteVehicleDataRetrievalsByFolderId = async (folderId: string): Promise<ServerActionResponse<void>> => {
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
    const success = await vehicleDataRetrievalUseCase.deleteVehicleDataRetrievalsByFolderId({
      folderId
    }, userContext);
    
    if (!success) {
      return {
        ok: false,
        error: createCustomErrorResponse(new CustomError(errorCodeEnum.INVALID_ACCOUNT, 'Vehicle data retrievals not found or you don\'t have permission to delete them')),
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
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Failed to delete vehicle data retrievals')),
    }
  }
}; 
"use server";

import { CustomError, errorCodeEnum, errorMessageEnum, createCustomErrorResponse } from "@/server/utils/CustomError";
import { ServerActionResponse } from "@/models/ServerActionResponse";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/authOptions";
import { revalidatePath } from "next/cache";
import { getHomeRoute } from "@/constants/navigationRoutes";
import { PVehicleDataRetrieval } from "@/models/PScrapingResult";
import { infractionsVehicleDataRetrievalUseCase, debtVehicleDataRetrievalUseCase, matriculaVehicleDataRetrievalUseCase, paymentAgreementVehicleDataRetrievalUseCase, certificadoSuciveVehicleDataRetrievalUseCase, solicitarCertificadoVehicleDataRetrievalUseCase } from "@/server/di";
import { ICurrentUserContext } from "@/server/domain/interfaces/ICurrentUserContext";

export type GenerateInfractionsDataRetrievalData = {
  folderId: string;
};

export type InfractionsVehicleDataRetrievalData = {
  hasInfractions: boolean;
};

export type GenerateDebtDataRetrievalData = {
  folderId: string;
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
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Error al generar consulta de infracciones')),
    }
  }
};

export const generateDebtDataRetrieval = async (data: GenerateDebtDataRetrievalData): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await debtVehicleDataRetrievalUseCase.generateDebtVehicleDataRetrieval({
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
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Error al generar consulta de deudas')),
    }
  }
};

export type GenerateMatriculaDataRetrievalData = {
  folderId: string;
};

export const generateMatriculaDataRetrieval = async (data: GenerateMatriculaDataRetrievalData): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await matriculaVehicleDataRetrievalUseCase.generateMatriculaVehicleDataRetrieval({
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
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Error al generar consulta de matrícula')),
    }
  }
};

export type GeneratePaymentAgreementDataRetrievalData = {
  folderId: string;
};

export type GenerateSolicitarCertificadoDataRetrievalData = {
  folderId: string;
  userData: {
    fullName: string;
    identificationType: 'CI' | 'RUT';
    identificationNumber: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
};

export const generatePaymentAgreementDataRetrieval = async (data: GeneratePaymentAgreementDataRetrievalData): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await paymentAgreementVehicleDataRetrievalUseCase.generatePaymentAgreementVehicleDataRetrieval({
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
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Error al generar consulta de convenios')),
    }
  }
};

export const generateSolicitarCertificadoDataRetrieval = async (data: GenerateSolicitarCertificadoDataRetrievalData): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await solicitarCertificadoVehicleDataRetrievalUseCase.generateSolicitarCertificadoVehicleDataRetrieval({
      folderId: data.folderId,
      requesterData: data.userData,
    }, userContext);

    revalidatePath(getHomeRoute());

    return {
      ok: true,
      data: result.toPresentation(),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Error al generar solicitud de certificado')),
    }
  }
};

export type GenerateCertificadoSuciveDataRetrievalData = {
  folderId: string;
  requestNumber: string;
};

export const generateCertificadoSuciveDataRetrieval = async (data: GenerateCertificadoSuciveDataRetrievalData): Promise<ServerActionResponse<PVehicleDataRetrieval>> => {
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
    const result = await certificadoSuciveVehicleDataRetrievalUseCase.generateCertificadoSuciveVehicleDataRetrieval({
      folderId: data.folderId,
      requestNumber: data.requestNumber,
    }, userContext);

    revalidatePath(getHomeRoute());

    return {
      ok: true,
      data: result.toPresentation(),
    }
  } catch (error) {
    return {
      ok: false,
      error: createCustomErrorResponse(new CustomError(errorCodeEnum.INTERNAL_SERVER_ERROR, 'Error al generar emisión de certificado SUCIVE')),
    }
  }
};
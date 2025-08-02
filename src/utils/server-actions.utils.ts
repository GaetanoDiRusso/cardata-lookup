import { ServerActionResponse } from "@/models/ServerActionResponse";
import {
  CustomError,
  errorCodeEnum,
  errorMessageEnum,
} from "@/server/utils/CustomError";

export const callServerAction = async <T>(
  action: Promise<ServerActionResponse<T>>
): Promise<T> => {
  const response = await action;
  if (response.ok) {
    return response.data!;
  }

  const errorCode = (
    Object.values(errorCodeEnum).includes(response.error?.code as errorCodeEnum)
      ? response.error!.code
      : errorCodeEnum.UNKWNON_ERROR
  ) as errorCodeEnum;

  const errorMessage = (
    Object.values(errorMessageEnum).includes(
      response.error?.message as errorMessageEnum
    )
      ? response.error!.message
      : errorMessageEnum.UNKWNON_ERROR
  ) as errorMessageEnum;

  throw new CustomError(errorCode, errorMessage);
};

import { ServerActionError } from "@/models/ServerActionError";

export enum errorCodeEnum {
  LOGIN_ERROR = "login_error",
  INTERNAL_SERVER_ERROR = "internal_server_error",
  INVALID_CREDENTIALS = "invalid_credentials",
  ACCOUNT_LOCKED = "account_locked",
  USER_ALREADY_EXISTS = "user_already_exists",
  USER_CREATION_ERROR = "user_creation_error",
  INVALID_SESSION = "invalid_session",
  INVALID_ACCOUNT = "invalid_account",
  ACCOUNT_NOT_VERIFIED = "account_not_verified",
  INVALID_JWT_TOKEN = "jwt_token_error",
  EXPIRED_JWT_TOKEN = "jwt_token_expired",
  INVALID_CHILD = "invalid_child",
  WEAK_PASSWORD = "weak_password",
  FORGOT_PASSWORD_ERROR = "forgot_password_error",
  SEND_EMAIL_ERROR = "send_email_error",
  UNKWNON_ERROR = "unknown_error",
  PASSWORD_RESET_LINK_EXPIRED_OR_INVALID = "password_reset_link_expired_or_invalid",
  INVALID_CREATE_NEW_PASSWORD_LINK = "invalid_create_new_password_link",
  NEW_CHILD_CREATION_ERROR = "new_child_creation_error",
  ERROR_GETTING_PROFILES = "error_getting_profiles",
  CHILD_NAME_ALREADY_EXISTS = "child_name_already_exists",
}

export enum errorMessageEnum {
  LOGIN_ERROR = "Something went wrong while trying to log in, please try again",
  INTERNAL_SERVER_ERROR = "Internal server error",
  INVALID_CREDENTIALS = "Invalid credentials",
  ACCOUNT_LOCKED = "This user is locked out, please contact support",
  USER_ALREADY_EXISTS = "User already exists",
  USER_CREATION_ERROR = "Something went wrong while creating user, please try again",
  INVALID_SESSION = "Something went wrong while trying to read your session, please try again",
  INVALID_ACCOUNT = "This account is not valid or does not exist",
  ACCOUNT_NOT_VERIFIED = "Unable to log in to this account, the user has not verified its email",
  INVALID_JWT_TOKEN = "JWT used in this operation is invalid",
  EXPIRED_JWT_TOKEN = "JWT used in this operation has expired",
  INVALID_CHILD = "The child selected for this operation is invalid",
  WEAK_PASSWORD = "The password provided does not meet the security criteria",
  SEND_EMAIL_ERROR = "Something went wrong while trying to send the email, please try again",
  FORGOT_PASSWORD_ERROR = "Something went wrong while trying to reset your password, please try again",
  UNKWNON_ERROR = "An unknown error occurred",
  PASSWORD_RESET_LINK_EXPIRED_OR_INVALID = "The link used to reset the password is invalid or has expired. Please request a new one.",
  INVALID_CREATE_NEW_PASSWORD_LINK = "The link used to create a new password is invalid or has expired. Please request a new one.",
  NEW_CHILD_CREATION_ERROR = "Error creating new child profile",
  ERROR_GETTING_PROFILES = "Error getting profiles",
  CHILD_NAME_ALREADY_EXISTS = "You already have a child with this name",
}

export class CustomError extends Error {
  code: errorCodeEnum;
  description?: string;

  constructor(code: errorCodeEnum, message: string, description?: string) {
    super(message);
    this.code = code;
    this.description = description || ""
  }
}

export const createCustomErrorResponse = (e: Error|unknown): ServerActionError => {
  if (e instanceof CustomError) {
    return {
      code: e.code,
      message: e.message,
      description: e.description,
    } as ServerActionError;
  }
  return {
    code: errorCodeEnum.INTERNAL_SERVER_ERROR,
    message: errorMessageEnum.INTERNAL_SERVER_ERROR,
    description: `This is an unexpected internal server error: ${e instanceof Error ? e.message : JSON.stringify(e)}`
  } as ServerActionError;
}

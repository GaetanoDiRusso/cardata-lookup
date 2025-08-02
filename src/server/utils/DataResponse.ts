import { CustomError } from "./CustomError";

export type DataResponse<ReponseType> = Promise<ReponseType | CustomError>;

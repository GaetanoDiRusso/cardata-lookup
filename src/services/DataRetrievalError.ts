/**
 * Custom error class for data retrieval operations
 * Similar to CustomError but simplified for data retrieval use cases
 */
export enum dataRetrievalErrorCodeEnum {
  // Empty enum values as requested
}

export enum dataRetrievalErrorMessageEnum {
  // Empty enum values as requested
}

export class DataRetrievalError extends Error {
  code: dataRetrievalErrorCodeEnum;
  description?: string;

  constructor(code: dataRetrievalErrorCodeEnum, message: string, description?: string) {
    super(message);
    this.code = code;
    this.description = description || "";
  }
}

import { VehicleValidator } from './VehicleValidator';
import { PersonValidator } from './PersonValidator';

export interface FolderValidationData {
  vehicle: any;
  buyer?: any; // Made optional
  seller?: any; // Made optional
}

export interface FolderValidationResult {
  isValid: boolean;
  errors: {
    vehicle: string[];
    buyer: string[];
    seller: string[];
    general: string[];
  };
}

export class FolderValidator {
  static validate(data: FolderValidationData): FolderValidationResult {
    const vehicleValidation = VehicleValidator.validate(data.vehicle);
    const buyerValidation = data.buyer ? PersonValidator.validate(data.buyer) : { isValid: true, errors: [] };
    const sellerValidation = data.seller ? PersonValidator.validate(data.seller) : { isValid: true, errors: [] };

    const generalErrors: string[] = [];

    // Check for duplicate identification numbers only if both buyer and seller are provided
    if (data.buyer?.identificationNumber && data.seller?.identificationNumber) {
      if (data.buyer.identificationNumber === data.seller.identificationNumber) {
        generalErrors.push('El comprador y vendedor no pueden tener el mismo número de identificación');
      }
    }

    return {
      isValid: vehicleValidation.isValid && buyerValidation.isValid && sellerValidation.isValid && generalErrors.length === 0,
      errors: {
        vehicle: vehicleValidation.errors,
        buyer: buyerValidation.errors,
        seller: sellerValidation.errors,
        general: generalErrors
      }
    };
  }

  static getAllErrors(validationResult: FolderValidationResult): string[] {
    return [
      ...validationResult.errors.vehicle,
      ...validationResult.errors.buyer,
      ...validationResult.errors.seller,
      ...validationResult.errors.general
    ];
  }
} 
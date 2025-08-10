import { VehicleValidator } from './VehicleValidator';
import { PersonValidator } from './PersonValidator';
import { PVehicle } from '@/models/PVehicle';
import { PPerson } from '@/models/PPerson';

export interface FolderValidationData {
  vehicle: Omit<PVehicle, 'id'>;
  buyer: Omit<PPerson, 'id'>;
  seller: Omit<PPerson, 'id'>;
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
    const buyerValidation = PersonValidator.validate(data.buyer);
    const sellerValidation = PersonValidator.validate(data.seller);

    const generalErrors: string[] = [];

    // Check for duplicate identification numbers
    if (data.buyer.identificationNumber && data.seller.identificationNumber) {
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
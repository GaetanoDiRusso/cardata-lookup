import { validateVehicle } from '@/shared/validators/ValidationRules';
import { PVehicle } from '@/models/PVehicle';

export type VehicleValidationData = Omit<PVehicle, 'id'>;

export interface VehicleValidationResult {
  isValid: boolean;
  errors: string[];
}

export class VehicleValidator {
  static validate(data: VehicleValidationData): VehicleValidationResult {
    return validateVehicle(data);
  }
} 
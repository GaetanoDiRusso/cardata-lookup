import { validatePerson } from '@/shared/validators/ValidationRules';
import { PPerson } from '@/models/PPerson';

export type PersonValidationData = Omit<PPerson, 'id'>;

export interface PersonValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PersonValidator {
  static validate(data: PersonValidationData): PersonValidationResult {
    return validatePerson(data);
  }
} 
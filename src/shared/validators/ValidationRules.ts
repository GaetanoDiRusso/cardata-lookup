import { isValidDepartmentCode } from '@/server/constants/departments';
import { PVehicle } from '@/models/PVehicle';
import { PPerson } from '@/models/PPerson';

// Shared validation rules and constants
export const VALIDATION_RULES = {
  PLATE_NUMBER_REGEX: /^[A-Z]{3}[0-9]{4}$/,
  REGISTRATION_NUMBER_REGEX: /^\d{9}$/,
  IDENTIFICATION_NUMBER_REGEX: /^\d{8}$/,
  DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/,
  NAME_REGEX: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
} as const;

// Vehicle validation
export const validateVehicle = (data: Omit<PVehicle, 'id'>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Plate Number Validation
  if (!data.plateNumber) {
    errors.push('La matrícula es obligatoria');
  } else if (!VALIDATION_RULES.PLATE_NUMBER_REGEX.test(data.plateNumber)) {
    errors.push('La matrícula debe tener el formato XXXNNNN (3 letras + 4 números)');
  }

  // Registration Number (Padrón) Validation
  if (!data.registrationNumber) {
    errors.push('El padrón es obligatorio');
  } else if (!VALIDATION_RULES.REGISTRATION_NUMBER_REGEX.test(data.registrationNumber)) {
    errors.push('El padrón debe tener exactamente 9 dígitos numéricos');
  }

  // Brand Validation
  if (!data.brand) {
    errors.push('La marca es obligatoria');
  }

  // Model Validation
  if (!data.model) {
    errors.push('El modelo es obligatorio');
  }

  // Year Validation
  if (!data.year) {
    errors.push('El año es obligatorio');
  }

  // Department Validation
  if (!data.department) {
    errors.push('El departamento es obligatorio');
  } else if (!isValidDepartmentCode(data.department)) {
    errors.push('El departamento seleccionado no es válido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Person validation
export const validatePerson = (data: Omit<PPerson, 'id'>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Name Validation
  if (!data.name) {
    errors.push('El nombre es obligatorio');
  } else if (!VALIDATION_RULES.NAME_REGEX.test(data.name)) {
    errors.push('El nombre solo puede contener letras y espacios');
  }

  // Cédula de Identidad Validation
  if (!data.identificationNumber) {
    errors.push('La cédula de identidad es obligatoria');
  } else if (!VALIDATION_RULES.IDENTIFICATION_NUMBER_REGEX.test(data.identificationNumber)) {
    errors.push('La cédula de identidad debe tener exactamente 8 dígitos numéricos');
  }

  // Date of Birth Validation
  if (!data.dateOfBirth) {
    errors.push('La fecha de nacimiento es obligatoria');
  } else if (!VALIDATION_RULES.DATE_REGEX.test(data.dateOfBirth)) {
    errors.push('La fecha de nacimiento debe tener el formato YYYY-MM-DD');
  } else {
    const birthDate = new Date(data.dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      errors.push('La fecha de nacimiento no es válida');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Data sanitization
export const sanitizeVehicle = (data: Omit<PVehicle, 'id'>): Omit<PVehicle, 'id'> => ({
  plateNumber: data.plateNumber?.trim().toUpperCase() || '',
  registrationNumber: data.registrationNumber?.trim() || '',
  brand: data.brand?.trim() || '',
  model: data.model?.trim() || '',
  year: Number(data.year) || new Date().getFullYear(),
  department: data.department || 'UYMO'
});

export const sanitizePerson = (data: Omit<PPerson, 'id'>): Omit<PPerson, 'id'> => ({
  name: data.name?.trim().replace(/\s+/g, ' ') || '', // Remove extra spaces
  identificationNumber: data.identificationNumber?.trim() || '',
  dateOfBirth: data.dateOfBirth?.trim() || ''
}); 
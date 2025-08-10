export type DepartmentCode =
  | 'UYAR' // Artigas
  | 'UYCA' // Canelones
  | 'UYCL' // Cerro Largo
  | 'UYCO' // Colonia
  | 'UYDU' // Durazno
  | 'UYFS' // Flores
  | 'UYFD' // Florida
  | 'UYLA' // Lavalleja
  | 'UYMA' // Maldonado
  | 'UYMO' // Montevideo
  | 'UYPA' // Paysandú
  | 'UYRN' // Río Negro
  | 'UYRV' // Rivera
  | 'UYRO' // Rocha
  | 'UYSA' // Salto
  | 'UYSJ' // San José
  | 'UYSO' // Soriano
  | 'UYTA' // Tacuarembó
  | 'UYTT'; // Treinta y Tres

export interface Department {
  code: DepartmentCode;
  name: string;
}

export const DEPARTMENTS: Department[] = [
  { code: 'UYAR', name: 'Artigas' },
  { code: 'UYCA', name: 'Canelones' },
  { code: 'UYCL', name: 'Cerro Largo' },
  { code: 'UYCO', name: 'Colonia' },
  { code: 'UYDU', name: 'Durazno' },
  { code: 'UYFS', name: 'Flores' },
  { code: 'UYFD', name: 'Florida' },
  { code: 'UYLA', name: 'Lavalleja' },
  { code: 'UYMA', name: 'Maldonado' },
  { code: 'UYMO', name: 'Montevideo' },
  { code: 'UYPA', name: 'Paysandú' },
  { code: 'UYRV', name: 'Rivera' },
  { code: 'UYRN', name: 'Río Negro' },
  { code: 'UYRO', name: 'Rocha' },
  { code: 'UYSA', name: 'Salto' },
  { code: 'UYSJ', name: 'San José' },
  { code: 'UYSO', name: 'Soriano' },
  { code: 'UYTA', name: 'Tacuarembó' },
  { code: 'UYTT', name: 'Treinta y Tres' }
];

export const getDepartmentByCode = (code: DepartmentCode): Department | undefined => {
  return DEPARTMENTS.find(dept => dept.code === code);
};

export const getDepartmentByName = (name: string): Department | undefined => {
  return DEPARTMENTS.find(dept => dept.name === name);
};

export const isValidDepartmentCode = (code: string): code is DepartmentCode => {
  return DEPARTMENTS.some(dept => dept.code === code);
}; 
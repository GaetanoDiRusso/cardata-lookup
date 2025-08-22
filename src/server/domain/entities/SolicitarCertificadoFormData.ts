export type SolicitarCertificadoFormData = {
  fullName: string;
  identificationType: 'CI' | 'RUT';
  identificationNumber: string;
  email: string;
  phoneNumber: string;
  address: string;
};

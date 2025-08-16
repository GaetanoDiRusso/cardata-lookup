/**
 * Services index file
 * Export all services for clean imports
 */

export { 
  generateInfractionsDataRetrieval,
  generateDebtDataRetrieval,
  generateMatriculaDataRetrieval,
  generatePaymentAgreementDataRetrieval,
  generateSolicitarCertificadoDataRetrieval,
  generateCertificadoSuciveDataRetrieval,
} from './dataRetrievalService';

export { DataRetrievalError } from './DataRetrievalError';
export type { UserData } from './dataRetrievalService';

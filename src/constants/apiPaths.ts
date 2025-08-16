import { API_BASE_URL } from './config';

/**
 * API paths for data retrieval services
 * Centralized location for all endpoint URLs
 */
export const API_PATHS = {
  DATA_RETRIEVAL: {
    INFRACTIONS: '/api/infractions',
    DEBT: '/api/debt',
    MATRICULA: '/api/matricula',
    PAYMENT_AGREEMENT: '/api/payment-agreement',
    SOLICITAR_CERTIFICADO: '/api/solicitar-certificado',
    CERTIFICADO_SUCIVE: '/api/certificado-sucive',
  },
} as const;

/**
 * Type for data retrieval API paths
 */
export type DataRetrievalApiPath = typeof API_PATHS.DATA_RETRIEVAL[keyof typeof API_PATHS.DATA_RETRIEVAL];

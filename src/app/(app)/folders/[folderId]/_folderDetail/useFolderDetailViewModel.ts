"use client"

import { useEffect, useState } from 'react';
import { PFolder } from '@/models/PFolder';
import { PVehicleDataRetrieval } from '@/models/PScrapingResult';
import { DefaultSession } from 'next-auth';
import { SolicitarCertificadoFormData } from '@/server/domain/entities/SolicitarCertificadoFormData';

export type Params = {
  data: {
    folder: PFolder;
    user?: DefaultSession['user'];
    prefilledData?: SolicitarCertificadoFormData;
  };
};

const useFolderDetailViewModel = ({ data }: Params) => {
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [folderData, setFolderData] = useState<PFolder | null>(data.folder);
  // Track newly added data retrievals in memory (will be lost on page refresh)
  const [newDataRetrievalIds, setNewDataRetrievalIds] = useState<Set<string>>(new Set());

  const closeError = () => {
    setShowError(false);
    setError(null);
  };

  useEffect(() => {
    setFolderData(data.folder);
  }, [data.folder]);

  const addNewDataRetrieval = (dataRetrieval: PVehicleDataRetrieval) => {
    // Add the new data retrieval ID to our tracking Set
    setNewDataRetrievalIds(prev => new Set([...prev, dataRetrieval.id]));
    
    setFolderData(prev => {
      if (!prev) {
        return null;
      }

      return {
        ...prev,
        vehicleDataRetrievals: [...prev.vehicleDataRetrievals, dataRetrieval]
      };
    });
  };

  return {
    data: {
      ...data,
      folder: folderData,
    },
    error,
    showError,
    closeError,
    setError,
    setShowError,
    addNewDataRetrieval,
    newDataRetrievalIds
  };
};

export default useFolderDetailViewModel; 
"use client"

import { useEffect, useState } from 'react';
import { PFolder } from '@/models/PFolder';
import { PVehicleDataRetrieval } from '@/models/PScrapingResult';
import { DefaultSession } from 'next-auth';

export type Params = {
  data: {
    folder: PFolder;
    user?: DefaultSession['user'];
  };
};

const useFolderDetailViewModel = ({ data }: Params) => {
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [folderData, setFolderData] = useState<PFolder | null>(data.folder);

  const closeError = () => {
    setShowError(false);
    setError(null);
  };

  useEffect(() => {
    setFolderData(data.folder);
  }, [data.folder]);

  const addNewDataRetrieval = (dataRetrieval: PVehicleDataRetrieval) => {
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
    addNewDataRetrieval
  };
};

export default useFolderDetailViewModel; 
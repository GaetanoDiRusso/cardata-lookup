"use client"

import { useState } from 'react';
import { PFolder } from '@/models/PFolder';

export type Params = {
  data: {
    folder: PFolder;
  };
};

const useFolderDetailViewModel = ({ data }: Params) => {
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const closeError = () => {
    setShowError(false);
    setError(null);
  };

  return {
    data,
    error,
    showError,
    closeError,
    setError,
    setShowError
  };
};

export default useFolderDetailViewModel; 
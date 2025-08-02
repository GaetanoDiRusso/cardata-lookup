import usePersonBasicDataForm from '@/hooks/usePersonBasicData';
import { useState } from 'react';
const useSellerForm = () => {
    const personBasicDataForm = usePersonBasicDataForm();
    const [saveAsFrequentClient, setSaveAsFrequentClient] = useState(false);

    const handleSaveAsFrequentClient = () => {
        setSaveAsFrequentClient(!saveAsFrequentClient);
    }

    return {
        ...personBasicDataForm,
        saveAsFrequentClient,
        handleSaveAsFrequentClient
    }
}

export type UseSellerFormData = ReturnType<typeof useSellerForm>;
export default useSellerForm;
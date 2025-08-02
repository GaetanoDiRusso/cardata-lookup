import usePersonBasicDataForm, { PersonBasicData } from '@/hooks/usePersonBasicData';
import { useState } from 'react';

export interface BuyerFormData extends PersonBasicData {}

const useBuyerForm = () => {
    const personBasicDataForm = usePersonBasicDataForm();
    const [saveAsFrequentClient, setSaveAsFrequentClient] = useState(false);

    const handleSaveAsFrequentClient = () => {
        setSaveAsFrequentClient(!saveAsFrequentClient);
    }

    return {
        ...personBasicDataForm,
        saveAsFrequentClient,
        handleSaveAsFrequentClient,
    }
}

export type UseBuyerFormData = ReturnType<typeof useBuyerForm>;
export default useBuyerForm;
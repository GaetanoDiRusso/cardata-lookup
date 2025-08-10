import usePersonBasicDataForm, { PersonBasicData } from '@/hooks/usePersonBasicData';

export interface BuyerFormData extends PersonBasicData {}

const useBuyerForm = () => {
    const personBasicDataForm = usePersonBasicDataForm();

    return {
        ...personBasicDataForm,
    }
}

export type UseBuyerFormData = ReturnType<typeof useBuyerForm>;
export default useBuyerForm;
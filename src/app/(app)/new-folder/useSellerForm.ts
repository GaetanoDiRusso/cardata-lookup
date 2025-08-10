import usePersonBasicDataForm from '@/hooks/usePersonBasicData';

const useSellerForm = () => {
    const personBasicDataForm = usePersonBasicDataForm();

    return {
        ...personBasicDataForm,
    }
}

export type UseSellerFormData = ReturnType<typeof useSellerForm>;
export default useSellerForm;
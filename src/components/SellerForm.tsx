import { UseSellerFormData } from '@/app/(app)/new-folder/useSellerForm';
import { PersonForm } from './PersonForm';

export type SellerFormProps = {
    useSellerFormDataInstance: UseSellerFormData;
    errors?: string[];
}

export const SellerForm = ({ useSellerFormDataInstance, errors = [] }: SellerFormProps) => {
    return (
        <PersonForm 
            usePersonFormDataInstance={useSellerFormDataInstance}
            title="Datos del Vendedor"
            errors={errors}
        />
    );
};
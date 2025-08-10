import { UseBuyerFormData } from '@/app/(app)/new-folder/useBuyerForm';
import { PersonForm } from './PersonForm';

export type BuyerFormProps = {
    useBuyerFormDataInstance: UseBuyerFormData;
    errors?: string[];
}

export const BuyerForm = ({ useBuyerFormDataInstance, errors = [] }: BuyerFormProps) => {
    return (
        <PersonForm 
            usePersonFormDataInstance={useBuyerFormDataInstance}
            title="Datos del Comprador"
            errors={errors}
        />
    );
}; 
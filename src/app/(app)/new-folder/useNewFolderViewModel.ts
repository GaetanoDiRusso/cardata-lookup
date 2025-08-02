import React, { useState } from 'react'
import useVehicleForm from './useVehicleForm';
import useBuyerForm from './useBuyerForm';
import useSellerForm from './useSellerForm';
import { callServerAction } from '@/utils/server-actions.utils';
import { createNewFolder as createNewFolderServerAction, CreateNewFolderData as CreateNewFolderServerActionData } from '@/server/infraestructure/server-actions/FolderActions';

const useNewFolderViewModel = () => {
    const sellerForm = useSellerForm();
    const buyerForm = useBuyerForm();
    const vehicleForm = useVehicleForm();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNewFolder = async () => {
        try {
            setIsLoading(true);
            const folderData: CreateNewFolderServerActionData = {
                vehicle: vehicleForm.vehicleFormData,
                buyer: buyerForm.data,
                seller: sellerForm.data,
            }

            const result = await callServerAction(createNewFolderServerAction(folderData));
            console.log(result);
            setIsLoading(false);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit = () => {
        console.log('onSubmit');
    }

    return {
        sellerForm,
        buyerForm,
        vehicleForm,
        onSubmit,
        isLoading,
        error,
        createNewFolder
    }
}

export default useNewFolderViewModel
import React, { useState } from 'react'
import useVehicleForm from './useVehicleForm';
import useBuyerForm from './useBuyerForm';
import useSellerForm from './useSellerForm';
import { callServerAction } from '@/utils/server-actions.utils';
import { createNewFolder as createNewFolderServerAction, CreateNewFolderData as CreateNewFolderServerActionData } from '@/server/infraestructure/server-actions/FolderActions';
import { PFolder } from '@/models/PFolder';
import { validateVehicle, validatePerson } from '@/shared/validators/ValidationRules';

interface ValidationErrors {
  vehicle: string[];
  buyer: string[];
  seller: string[];
  general: string[];
}

const useNewFolderViewModel = () => {
    const sellerForm = useSellerForm();
    const buyerForm = useBuyerForm();
    const vehicleForm = useVehicleForm();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdFolderId, setCreatedFolderId] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
        vehicle: [],
        buyer: [],
        seller: [],
        general: []
    });

    const validateForm = (): boolean => {
        const vehicleValidation = validateVehicle(vehicleForm.vehicleFormData);
        const buyerValidation = buyerForm.data.identificationNumber ? validatePerson(buyerForm.data) : { isValid: true, errors: [] };
        const sellerValidation = sellerForm.data.identificationNumber ? validatePerson(sellerForm.data) : { isValid: true, errors: [] };

        const generalErrors: string[] = [];

        // Check for duplicate identification numbers only if both buyer and seller have identification numbers
        if (buyerForm.data.identificationNumber && sellerForm.data.identificationNumber) {
            if (buyerForm.data.identificationNumber === sellerForm.data.identificationNumber) {
                generalErrors.push('El comprador y vendedor no pueden tener el mismo número de identificación');
            }
        }

        const newValidationErrors: ValidationErrors = {
            vehicle: vehicleValidation.errors,
            buyer: buyerValidation.errors,
            seller: sellerValidation.errors,
            general: generalErrors
        };

        setValidationErrors(newValidationErrors);

        return vehicleValidation.isValid && buyerValidation.isValid && sellerValidation.isValid && generalErrors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent, skipBuyer: boolean = false, skipSeller: boolean = false) => {
        e.preventDefault();
        
        // Clear previous errors
        setError(null);
        setShowError(false);
        setValidationErrors({ vehicle: [], buyer: [], seller: [], general: [] });

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            
            const folderData: CreateNewFolderServerActionData = {
                vehicle: vehicleForm.vehicleFormData,
                buyer: (!skipBuyer && buyerForm.data.identificationNumber) ? buyerForm.data : undefined,
                seller: (!skipSeller && sellerForm.data.identificationNumber) ? sellerForm.data : undefined,
            }

            const result: PFolder = await callServerAction(createNewFolderServerAction(folderData));
            
            // If we get here, the folder was created successfully
            setCreatedFolderId(result.id);
            setShowSuccessModal(true);
        } catch (error: any) {
            const errorMessage = error.message || 'Error inesperado al crear la carpeta';
            setError(errorMessage);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    }

    const closeError = () => {
        setShowError(false);
        setError(null);
    }

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setCreatedFolderId(null);
        // Navigate to home page
        window.location.href = '/';
    }

    const goToFolder = () => {
        if (createdFolderId) {
            window.location.href = `/folders/${createdFolderId}`;
        }
    }

    return {
        sellerForm,
        buyerForm,
        vehicleForm,
        isLoading,
        error,
        showError,
        showSuccessModal,
        createdFolderId,
        validationErrors,
        handleSubmit,
        closeError,
        closeSuccessModal,
        goToFolder
    }
}

export default useNewFolderViewModel
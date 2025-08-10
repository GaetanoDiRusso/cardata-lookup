import { VehicleFormData } from '@/components/VehicleForm';
import React, { useState } from 'react'

const useVehicleForm = () => {
    const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
        plateNumber: '',
        registrationNumber: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        department: 'UYMO', // Default to Montevideo
    });

    const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVehicleFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return {
        vehicleFormData,
        handleVehicleChange,
    }
}

export type UseVehicleFormData = ReturnType<typeof useVehicleForm>;
export default useVehicleForm;
import { VehicleFormData } from '@/components/VehicleForm';
import React, { useState } from 'react'

const useVehicleForm = () => {
    const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
        plateNumber: '',
        registrationNumber: '',
        department: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        type: '',
        cylinders: 0,
        fuel: '',
        attribute: '',
        engineCapacity: 0,
        totalWeight: 0,
        engineNumber: '',
        chassisNumber: '',
        axles: 0,
        passengers: 0,
        ownerName: '',
        ownerIdentification: '',
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
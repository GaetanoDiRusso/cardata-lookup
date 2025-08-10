import React, { useState } from 'react'
import { PPerson } from '@/models/PPerson';

export type PersonBasicData = Omit<PPerson, 'id'>;

const usePersonBasicDataForm = () => {
    const [data, setData] = useState<PersonBasicData>({
        name: '',
        identificationNumber: '',
        dateOfBirth: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    return {
        data,
        onChange: handleChange,
    }
}

export type UsePersonBasicDataForm = ReturnType<typeof usePersonBasicDataForm>;
export default usePersonBasicDataForm;
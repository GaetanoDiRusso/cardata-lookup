import React, { useState } from 'react'
import { PPerson } from '@/models/PPerson';

export type PersonBasicData = Omit<PPerson, 'id'>;

const usePersonBasicDataForm = () => {
    const [dataSource, setDataSource] = useState<'client' | 'new'>('new');

    const [data, setData] = useState<PersonBasicData>({
        name: '',
        identificationNumber: '',
        dateOfBirth: '',
    })

    const [previousClients, setPreviousClients] = useState<PersonBasicData[]>([]);
    const [loadingPreviousClients, setLoadingPreviousClients] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const getPreviousClients = async () => {
        setLoadingPreviousClients(true);
        // const clients = await getClients();
        await new Promise(resolve => setTimeout(resolve, 3000));
        const clients = [
            {
                name: 'Juan Perez',
                identificationNumber: '1234567890',
                dateOfBirth: '1990-01-01',
            },
            {
                name: 'Maria Lopez',
                identificationNumber: '1234567891',
                dateOfBirth: '1991-01-01',
            },
            {
                name: 'Pedro Ramirez',
                identificationNumber: '1234567892',
                dateOfBirth: '1992-01-01',
            }
        ];
        setPreviousClients(clients);
        setLoadingPreviousClients(false);
    }

    const fillDataWithPreviousClient = (clientIdentificationNumber: string) => {
        const client = previousClients.find(client => client.identificationNumber === clientIdentificationNumber);
        if (client) {
            setData(client);
        }
    }

    const onSetDataSource = (dataSource: 'client' | 'new') => {
        if (dataSource === 'client' && previousClients.length === 0) {
            getPreviousClients();
        }

        setDataSource(dataSource);
    }

    return {
        data,
        previousClients,
        loadingPreviousClients,
        onChange: handleChange,
        getPreviousClients,
        fillDataWithPreviousClient,
        dataSource,
        onSetDataSource
    }
}

export type UsePersonBasicDataForm = ReturnType<typeof usePersonBasicDataForm>;
export default usePersonBasicDataForm;
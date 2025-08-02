import { UseBuyerFormData } from '@/app/(app)/new-folder/useBuyerForm';

export type BuyerFormProps = {
    useBuyerFormDataInstance: UseBuyerFormData;
}

export const BuyerForm = ({ useBuyerFormDataInstance }: BuyerFormProps) => {
    return (
        <form className="space-y-6">
            <div className="grid gap-4">
                {useBuyerFormDataInstance.dataSource === 'client' && !useBuyerFormDataInstance.loadingPreviousClients ? (
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <label htmlFor="previousClient" className="block text-sm font-medium text-gray-700 mb-1">
                                {useBuyerFormDataInstance.previousClients.length > 0 ? 'Clientes anteriores' : 'No tienes clientes anteriores'}
                            </label>
                            <select
                                id="previousClient"
                                name="previousClient"
                                onChange={(e) => useBuyerFormDataInstance.fillDataWithPreviousClient(e.target.value)}
                                className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar cliente</option>
                                {useBuyerFormDataInstance.previousClients.map(client => (
                                    <option key={client.identificationNumber} value={client.identificationNumber}>
                                        {client.name} - {client.identificationNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="cursor-pointer w-fit px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => useBuyerFormDataInstance.onSetDataSource('new')}
                        >
                            Usar datos de nuevo cliente
                        </button>
                    </div>
                ) : (<button
                    type="button"
                    className="w-fit px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => useBuyerFormDataInstance.onSetDataSource('client')}
                    disabled={useBuyerFormDataInstance.loadingPreviousClients}
                >
                    {useBuyerFormDataInstance.loadingPreviousClients ? 'Cargando clientes anteriores...' : 'Usar datos de cliente ya existente'}
                </button>)}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={useBuyerFormDataInstance.data.name}
                        onChange={useBuyerFormDataInstance.onChange}
                        disabled={useBuyerFormDataInstance.dataSource === 'client'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese el nombre completo"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="ci" className="block text-sm font-medium text-gray-700 mb-1">
                        Cédula de identidad
                    </label>
                    <input
                        type="text"
                        id="identificationNumber"
                        name="identificationNumber"
                        value={useBuyerFormDataInstance.data.identificationNumber}
                        onChange={useBuyerFormDataInstance.onChange}
                        disabled={useBuyerFormDataInstance.dataSource === 'client'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese la cédula de identidad"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de nacimiento
                    </label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={useBuyerFormDataInstance.data.dateOfBirth}
                        onChange={useBuyerFormDataInstance.onChange}
                        disabled={useBuyerFormDataInstance.dataSource === 'client'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="saveAsFrequentClient"
                        name="saveAsFrequentClient"
                        checked={useBuyerFormDataInstance.dataSource === 'client' || useBuyerFormDataInstance.saveAsFrequentClient}
                        onChange={useBuyerFormDataInstance.handleSaveAsFrequentClient}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={useBuyerFormDataInstance.dataSource === 'client'}
                    />
                    <label htmlFor="saveAsFrequentClient" className="ml-2 block text-sm text-gray-700">
                        Guardar datos de cliente frecuente
                    </label>
                </div>

                {/* <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">Dirección</h3>

                    <div>
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                            Calle y número
                        </label>
                        <input
                            type="text"
                            id="address.street"
                            name="address.street"
                            value={useBuyerFormDataInstance.buyerFormData.address.street}
                            onChange={useBuyerFormDataInstance.onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese la calle y número"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad
                        </label>
                        <input
                            type="text"
                            id="address.city"
                            name="address.city"
                            value={useBuyerFormDataInstance.buyerFormData.address.city}
                            onChange={useBuyerFormDataInstance.onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese la ciudad"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address.department" className="block text-sm font-medium text-gray-700 mb-1">
                            Departamento
                        </label>
                        <select
                            id="address.department"
                            name="address.department"
                            value={useBuyerFormDataInstance.buyerFormData.address.department}
                            onChange={useBuyerFormDataInstance.onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar departamento</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept.code} value={dept.code}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Código postal
                        </label>
                        <input
                            type="text"
                            id="address.zipCode"
                            name="address.zipCode"
                            value={useBuyerFormDataInstance.buyerFormData.address.zipCode}
                            onChange={useBuyerFormDataInstance.onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese el código postal"
                            required
                        />
                    </div>
                </div> */}
            </div>
        </form>
    );
}; 
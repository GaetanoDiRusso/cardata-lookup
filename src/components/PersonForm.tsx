import { UsePersonBasicDataForm } from '@/hooks/usePersonBasicData';
import { ValidationErrorDisplay } from './ValidationErrorDisplay';

export type PersonFormProps = {
    usePersonFormDataInstance: UsePersonBasicDataForm;
    title?: string;
    errors?: string[];
}

export const PersonForm = ({ usePersonFormDataInstance, title, errors = [] }: PersonFormProps) => {
    return (
        <div className="space-y-6">
            {title && (
                <h3 className="text-lg font-medium text-gray-700">{title}</h3>
            )}
            <div className="grid gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={usePersonFormDataInstance.data.name}
                        onChange={usePersonFormDataInstance.onChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.some(error => error.toLowerCase().includes('nombre')) 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                        }`}
                        placeholder="Ingrese el nombre completo"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="identificationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Cédula de Identidad
                    </label>
                    <input
                        type="text"
                        id="identificationNumber"
                        name="identificationNumber"
                        value={usePersonFormDataInstance.data.identificationNumber}
                        onChange={usePersonFormDataInstance.onChange}
                        className={`w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.some(error => error.toLowerCase().includes('cédula')) 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                        }`}
                        placeholder="12345678"
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
                        value={usePersonFormDataInstance.data.dateOfBirth}
                        onChange={usePersonFormDataInstance.onChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.some(error => error.toLowerCase().includes('fecha') || error.toLowerCase().includes('nacimiento')) 
                                ? 'border-red-500' 
                                : 'border-gray-300'
                        }`}
                        required
                    />
                </div>
            </div>

            <ValidationErrorDisplay errors={errors} />
        </div>
    );
}; 
import { UseVehicleFormData } from '@/app/(app)/new-folder/useVehicleForm';
import { PVehicle } from '@/models/PVehicle';
import { DEPARTMENTS } from '@/server/constants/departments';
import { ValidationErrorDisplay } from './ValidationErrorDisplay';

export type VehicleFormData = Omit<PVehicle, 'id'>;

export type VehicleFormProps = {
  useVehicleFormDataInstance: UseVehicleFormData;
  errors?: string[];
}

export const VehicleForm = ({ useVehicleFormDataInstance, errors = [] }: VehicleFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6">
        <div>
          <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Matrícula (XXXNNNN)
          </label>
          <input
            type="text"
            id="plateNumber"
            name="plateNumber"
            pattern="[A-Z]{3}[0-9]{4}"
            maxLength={7}
            value={useVehicleFormDataInstance.vehicleFormData.plateNumber}
            onChange={useVehicleFormDataInstance.handleVehicleChange}
            className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.some(error => error.toLowerCase().includes('matrícula')) 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="ABC1234"
            required
          />
        </div>

        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Padrón
          </label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={useVehicleFormDataInstance.vehicleFormData.registrationNumber}
            onChange={useVehicleFormDataInstance.handleVehicleChange}
            className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.some(error => error.toLowerCase().includes('padrón')) 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="123456789"
            required
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <select
            id="department"
            name="department"
            value={useVehicleFormDataInstance.vehicleFormData.department}
            onChange={useVehicleFormDataInstance.handleVehicleChange}
            className={`w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.some(error => error.toLowerCase().includes('departamento')) 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            required
          >
            <option value="">Seleccionar departamento</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={useVehicleFormDataInstance.vehicleFormData.brand}
            onChange={useVehicleFormDataInstance.handleVehicleChange}
            className={`w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.some(error => error.toLowerCase().includes('marca')) 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="Toyota"
            required
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Modelo
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={useVehicleFormDataInstance.vehicleFormData.model}
            onChange={useVehicleFormDataInstance.handleVehicleChange}
            className={`w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.some(error => error.toLowerCase().includes('modelo')) 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="Corolla"
            required
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <input
            type="number"
            id="year"
            name="year"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={useVehicleFormDataInstance.vehicleFormData.year}
            onChange={useVehicleFormDataInstance.handleVehicleChange}
            className={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.some(error => error.toLowerCase().includes('año')) 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="2024"
            required
          />
        </div>
      </div>

      <ValidationErrorDisplay errors={errors} />
    </div>
  );
}; 
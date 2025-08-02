import { UseVehicleFormData } from '@/app/(app)/new-folder/useVehicleForm';
import { DEPARTMENTS } from '@/server/constants/departments';
import { PVehicle } from '@/models/PVehicle';

export type VehicleFormData = Omit<PVehicle, 'id'>;


export type VehicleFormProps = {
  useVehicleFormDataInstance: UseVehicleFormData;
}

export const VehicleForm = ({ useVehicleFormDataInstance }: VehicleFormProps) => {
  return (
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
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ABC1234"
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
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="123456"
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
          className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
          Marca
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={useVehicleFormDataInstance.vehicleFormData.brand}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Toyota"
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
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Corolla"
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
          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="2024"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={useVehicleFormDataInstance.vehicleFormData.type}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Sedan"
        />
      </div>

      <div>
        <label htmlFor="cylinders" className="block text-sm font-medium text-gray-700 mb-1">
          Cilindros
        </label>
        <input
          type="number"
          id="cylinders"
          name="cylinders"
          min="1"
          value={useVehicleFormDataInstance.vehicleFormData.cylinders}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="4"
        />
      </div>

      <div>
        <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1">
          Combustible
        </label>
        <input
          type="text"
          id="fuel"
          name="fuel"
          value={useVehicleFormDataInstance.vehicleFormData.fuel}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nafta"
        />
      </div>

      <div>
        <label htmlFor="attribute" className="block text-sm font-medium text-gray-700 mb-1">
          Atributo
        </label>
        <input
          type="text"
          id="attribute"
          name="attribute"
          value={useVehicleFormDataInstance.vehicleFormData.attribute}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Particular"
        />
      </div>

      <div>
        <label htmlFor="engineCapacity" className="block text-sm font-medium text-gray-700 mb-1">
          Cilindrada
        </label>
        <input
          type="number"
          id="engineCapacity"
          name="engineCapacity"
          min="0"
          value={useVehicleFormDataInstance.vehicleFormData.engineCapacity}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="2000"
        />
      </div>

      <div>
        <label htmlFor="totalWeight" className="block text-sm font-medium text-gray-700 mb-1">
          P.B.T (Kg)
        </label>
        <input
          type="number"
          id="totalWeight"
          name="totalWeight"
          min="0"
          value={useVehicleFormDataInstance.vehicleFormData.totalWeight}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="1500"
        />
      </div>

      <div>
        <label htmlFor="engineNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número de Motor
        </label>
        <input
          type="text"
          id="engineNumber"
          name="engineNumber"
          value={useVehicleFormDataInstance.vehicleFormData.engineNumber}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ABC123456789"
        />
      </div>

      <div>
        <label htmlFor="chassisNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número de Chasis
        </label>
        <input
          type="text"
          id="chassisNumber"
          name="chassisNumber"
          value={useVehicleFormDataInstance.vehicleFormData.chassisNumber}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="XYZ987654321"
        />
      </div>

      <div>
        <label htmlFor="axles" className="block text-sm font-medium text-gray-700 mb-1">
          Ejes
        </label>
        <input
          type="number"
          id="axles"
          name="axles"
          min="1"
          value={useVehicleFormDataInstance.vehicleFormData.axles}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="2"
        />
      </div>

      <div>
        <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
          Pasajeros
        </label>
        <input
          type="number"
          id="passengers"
          name="passengers"
          min="1"
          value={useVehicleFormDataInstance.vehicleFormData.passengers}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="5"
        />
      </div>

      <div>
        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
          Titular
        </label>
        <input
          type="text"
          id="ownerName"
          name="ownerName"
          value={useVehicleFormDataInstance.vehicleFormData.ownerName}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Juan Pérez"
        />
      </div>

      <div>
        <label htmlFor="ownerIdentification" className="block text-sm font-medium text-gray-700 mb-1">
          CI/RUT Titular
        </label>
        <input
          type="text"
          id="ownerIdentification"
          name="ownerIdentification"
          value={useVehicleFormDataInstance.vehicleFormData.ownerIdentification}
          onChange={useVehicleFormDataInstance.handleVehicleChange}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="1.234.567-8"
        />
      </div>
    </div>
  );
}; 
import { PFolder } from '@/models/PFolder';
import { getDepartmentByCode } from '@/server/constants/departments';

export type FolderBasicInfoProps = {
  folder: PFolder;
}

export const FolderBasicInfo = ({ folder }: FolderBasicInfoProps) => {
  const department = getDepartmentByCode(folder.vehicle.department);

  return (
    <div className="space-y-6">
      {/* Vehicle Information - Full Width */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Datos del Vehículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Matrícula</label>
            <p className="text-gray-900 font-semibold">{folder.vehicle.plateNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Padrón</label>
            <p className="text-gray-900 font-semibold">{folder.vehicle.registrationNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Departamento</label>
            <p className="text-gray-900 font-semibold">{department?.name || folder.vehicle.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Marca</label>
            <p className="text-gray-900 font-semibold">{folder.vehicle.brand}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Modelo</label>
            <p className="text-gray-900 font-semibold">{folder.vehicle.model}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Año</label>
            <p className="text-gray-900 font-semibold">{folder.vehicle.year}</p>
          </div>
        </div>
      </div>

      {/* Only show person information if buyer or seller exists */}
      {(folder.buyer || folder.seller) && (
        <>
          <hr className="border-gray-200" />

          {/* Person Information - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyer Information */}
            {folder.buyer && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Datos del Comprador</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-gray-900 font-semibold">{folder.buyer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Número de Identificación</label>
                    <p className="text-gray-900 font-semibold">{folder.buyer.identificationNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                    <p className="text-gray-900 font-semibold">{folder.buyer.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Seller Information */}
            {folder.seller && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Datos del Vendedor</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-gray-900 font-semibold">{folder.seller.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Número de Identificación</label>
                    <p className="text-gray-900 font-semibold">{folder.seller.identificationNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                    <p className="text-gray-900 font-semibold">{folder.seller.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}; 
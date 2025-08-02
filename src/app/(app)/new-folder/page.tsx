'use client';

import { VehicleForm } from '@/components/VehicleForm';
import { BuyerForm } from '@/components/BuyerForm';
import { SellerForm } from '@/components/SellerForm';
import useNewFolderViewModel from './useNewFolderViewModel';

export default function NewFolder() {
  const { vehicleForm, buyerForm, sellerForm, createNewFolder } = useNewFolderViewModel();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Nueva Carpeta</h1>

      <div className="space-y-8">
        {/* Sección 1: Datos del Vehículo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos del Vehículo (Libreta de propiedad)</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <VehicleForm useVehicleFormDataInstance={vehicleForm} />
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Sección 2: Datos del Comprador */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos del COMPRADOR</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <BuyerForm useBuyerFormDataInstance={buyerForm} />
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Sección 3: Datos del Vendedor */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos del VENDEDOR</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <SellerForm useSellerFormDataInstance={sellerForm} />
          </div>
        </section>

        <button onClick={createNewFolder} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Crear Vehículo
        </button>
      </div>
    </main>
  );
} 
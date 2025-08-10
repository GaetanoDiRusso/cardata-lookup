'use client';

import { VehicleForm } from '@/components/VehicleForm';
import { BuyerForm } from '@/components/BuyerForm';
import { SellerForm } from '@/components/SellerForm';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SuccessModal } from '../_components/SuccessModal';
import { ValidationErrorDisplay } from '@/components/ValidationErrorDisplay';
import useNewFolderViewModel from '../useNewFolderViewModel';

export default function NewFolderView() {
  const { 
    vehicleForm, 
    buyerForm, 
    sellerForm, 
    handleSubmit,
    isLoading,
    error,
    showError,
    showSuccessModal,
    validationErrors,
    closeError,
    closeSuccessModal,
    goToFolder
  } = useNewFolderViewModel();

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Nueva Carpeta</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Errors */}
          {validationErrors.general.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <ValidationErrorDisplay errors={validationErrors.general} />
            </div>
          )}

          {/* Sección 1: Datos del Vehículo */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos del Vehículo (Libreta de propiedad)</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <VehicleForm 
                useVehicleFormDataInstance={vehicleForm} 
                errors={validationErrors.vehicle}
              />
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Sección 2: Datos del Comprador */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos del COMPRADOR</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <BuyerForm 
                useBuyerFormDataInstance={buyerForm} 
                errors={validationErrors.buyer}
              />
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Sección 3: Datos del Vendedor */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos del VENDEDOR</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <SellerForm 
                useSellerFormDataInstance={sellerForm} 
                errors={validationErrors.seller}
              />
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creando carpeta...' : 'Crear Carpeta'}
            </button>
            
            {/* Validation Error Message */}
            {(validationErrors.vehicle.length > 0 || 
              validationErrors.buyer.length > 0 || 
              validationErrors.seller.length > 0 || 
              validationErrors.general.length > 0) && (
              <div className="text-red-600 text-sm flex items-center">
                <span className="mr-1">⚠️</span>
                Por favor, revise y corrija los errores antes de continuar
              </div>
            )}
          </div>
        </form>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        onViewFolder={goToFolder}
      />

      {/* Error Message */}
      <ErrorMessage
        message={error || ''}
        isVisible={showError}
        onClose={closeError}
        autoHideAfter={0} // Don't auto-hide errors
      />
    </>
  );
} 
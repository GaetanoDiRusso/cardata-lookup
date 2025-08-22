'use client';

import { PFolder } from '@/models/PFolder';
import { FolderBasicInfo } from './_components/FolderBasicInfo';
import { DataRetrievalSection } from './_components/DataRetrievalSection';
import { ErrorMessage } from '@/components/ErrorMessage';
import useFolderDetailViewModel from './useFolderDetailViewModel';
import { DefaultSession } from 'next-auth';
import { SolicitarCertificadoFormData } from '@/server/domain/entities/SolicitarCertificadoFormData';

export type Params = {
  data: {
    folder: PFolder;
    user?: DefaultSession['user']; // Using any for now, we can refine this later
    prefilledData?: SolicitarCertificadoFormData;
  };
};

const FolderDetailView = ({ data: _data }: Params) => {
  const { data, error, showError, closeError, addNewDataRetrieval, newDataRetrievalIds } = useFolderDetailViewModel({ data: _data });
  const { folder, user, prefilledData } = data;

  if (!folder) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando carpeta...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Detalles de la Carpeta</h1>
          <p className="text-gray-600">
            Carpeta creada el {new Date(folder.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Basic Information Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Información Básica</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <FolderBasicInfo folder={folder} />
            </div>
          </section>

          {/* Data Retrieval Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Consulta de Datos</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <DataRetrievalSection 
                folder={folder} 
                user={user} 
                prefilledData={prefilledData} 
                addNewDataRetrieval={addNewDataRetrieval}
                newDataRetrievalIds={newDataRetrievalIds}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Error Message */}
      <ErrorMessage
        message={error || ''}
        isVisible={showError}
        onClose={closeError}
        autoHideAfter={0}
      />
    </>
  );
};

export default FolderDetailView; 
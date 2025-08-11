'use client';

import { PFolder } from '@/models/PFolder';
import { FolderBasicInfo } from './_components/FolderBasicInfo';
import { DataRetrievalSection } from './_components/DataRetrievalSection';
import { ErrorMessage } from '@/components/ErrorMessage';
import useFolderDetailViewModel from './useFolderDetailViewModel';
import { DefaultSession } from 'next-auth';

export type Params = {
  data: {
    folder: PFolder;
    user?: DefaultSession['user']; // Using any for now, we can refine this later
  };
};

const FolderDetailView = ({ data }: Params) => {
  const { folder, user } = data;
  const { error, showError, closeError } = useFolderDetailViewModel({ data });

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
              <DataRetrievalSection folder={folder} user={user} />
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
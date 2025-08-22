'use client';

import { FolderCard } from '@/components/FolderCard';
import { Params } from './useHomeViewModel';

type Props = {} & Params

/**
 * This is the main view for the home page.
 * It displays the logged in user's folders.
 */
const HomeView = ({ data }: Props) => {
  const { foldersPrev } = data;

  // Show loading state while data is being fetched
  if (!foldersPrev) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Carpetas</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando carpetas...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Carpetas</h1>
      
      {foldersPrev.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes vehículos registrados.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Ordenadas por fecha de creación (más recientes primero)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foldersPrev.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default HomeView;
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

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Carpetas</h1>
      
      {foldersPrev.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes vehículos registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foldersPrev.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
        </div>
      )}
    </main>
  );
} 

export default HomeView;
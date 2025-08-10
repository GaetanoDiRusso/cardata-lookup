import React from "react";
import { callServerAction } from "@/utils/server-actions.utils";
import { getFolderById } from "@/server/infraestructure/server-actions/FolderActions";
import { PFolder } from "@/models/PFolder";
import FolderDetailView from "./_folderDetail/FolderDetailView";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const FolderDetail = async ({ params }: { params: Promise<{ folderId: string }> }) => {
  const { folderId } = await params;
  let folder: PFolder | null = null;
  
  // Get current user session
  const session = await getServerSession(authOptions);
  
  try {
    folder = await callServerAction(getFolderById(folderId));
    console.log('folder', folder);
  } catch (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Carpeta no encontrada</h1>
          <p className="text-gray-600 mb-4">La carpeta que buscas no existe o no tienes permisos para acceder a ella.</p>
          <a 
            href="/" 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    );
  }

  return (
    <FolderDetailView data={{ folder, user: session?.user }} />
  );
};

export default FolderDetail; 
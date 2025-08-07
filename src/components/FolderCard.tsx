import { Car, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeDate } from '@/utils/date';
import { PFolderPrev } from '@/models/PFolder';

interface FolderCardProps {
  folder: PFolderPrev;
}

export const FolderCard = ({ folder }: FolderCardProps) => {
  return (
    <Link href={`/folders/${folder.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            {folder.vehicle.brand} {folder.vehicle.model} ({folder.vehicle.year})
          </h2>
        </div>
        <p className="text-gray-600 mb-4 truncate">Matrícula: {folder.vehicle.plateNumber}</p>
        <div className="space-y-3 mt-auto">
          <p className="text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="font-medium">Comprador:</span>
            <span className="truncate">{folder.buyerName}</span>
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Última actualización: {formatRelativeDate(folder.lastUpdated)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}; 
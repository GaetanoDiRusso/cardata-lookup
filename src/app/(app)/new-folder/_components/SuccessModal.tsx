import { Modal } from '@/components/Modal';

export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onViewFolder: () => void;
}

export const SuccessModal = ({ isOpen, onClose, onViewFolder }: SuccessModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="¡Carpeta Creada Exitosamente!"
      showCloseButton={true}
    >
      <div className="text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 mb-4">
            La carpeta ha sido creada exitosamente. Puedes ver los detalles de la carpeta haciendo clic en el botón de abajo.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onViewFolder}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Ver Carpeta
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}; 
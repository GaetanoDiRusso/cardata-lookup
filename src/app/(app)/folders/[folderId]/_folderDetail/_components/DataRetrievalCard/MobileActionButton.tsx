import React from 'react';

export type MobileActionButtonProps = {
  buttonText: string;
  label: string;
  isLoading: boolean;
  onAction: () => void;
  isDisabled: boolean;
};

export const MobileActionButton: React.FC<MobileActionButtonProps> = ({
  buttonText,
  label,
  isLoading,
  onAction,
  isDisabled
}) => {
  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={onAction}
        disabled={isDisabled}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {buttonText === 'Emitir' ? 'Emitiendo...' : buttonText === 'Solicitar' ? 'Solicitando...' : 'Consultando...'}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="mr-2">🔍</span>
            {buttonText} {label}
          </div>
        )}
      </button>
    </div>
  );
}; 
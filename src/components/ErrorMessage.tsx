import React, { useEffect } from 'react';

export type ErrorMessageProps = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideAfter?: number; // milliseconds, 0 = no auto-hide
}

export const ErrorMessage = ({ message, isVisible, onClose, autoHideAfter = 5000 }: ErrorMessageProps) => {
  // Auto-hide after specified time
  useEffect(() => {
    if (isVisible && autoHideAfter > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideAfter);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideAfter, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-red-100 transition-colors flex-shrink-0"
          aria-label="Cerrar mensaje de error"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 
import React from 'react';

export type ErrorMessageProps = {
  error: string | null;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <div className="flex items-center">
        <span className="mr-2">⚠️</span>
        {error}
      </div>
    </div>
  );
}; 
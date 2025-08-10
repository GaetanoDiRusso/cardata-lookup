import React from 'react';

export type DataRetrievalHeaderProps = {
  label: string;
  description: string;
  buttonText: string;
  isLoading: boolean;
  isCardCollapsed: boolean;
  onToggleCollapse: () => void;
  onAction: () => void;
  isActionDisabled: boolean;
  actionTitle?: string;
};

export const DataRetrievalHeader: React.FC<DataRetrievalHeaderProps> = ({
  label,
  description,
  buttonText,
  isLoading,
  isCardCollapsed,
  onToggleCollapse,
  onAction,
  isActionDisabled,
  actionTitle
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 overflow-visible">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="mr-3 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center shadow-sm"
            title={isCardCollapsed ? "Expandir tarjeta" : "Colapsar tarjeta"}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                isCardCollapsed ? 'rotate-0' : 'rotate-180'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Title and Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{label}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        
        {/* Action Button - Only show when not collapsed */}
        {!isCardCollapsed && (
          <div className="hidden lg:block relative">
            <button
              onClick={onAction}
              disabled={isActionDisabled}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center group relative text-sm"
              title={actionTitle || `${buttonText} ${label}`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
              ) : (
                <span className="mr-1">🔍</span>
              )}
              {buttonText}
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                {actionTitle || `${buttonText} ${label}`}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 
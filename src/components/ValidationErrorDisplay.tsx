interface ValidationErrorDisplayProps {
  errors: string[];
  className?: string;
}

export const ValidationErrorDisplay = ({ errors, className = '' }: ValidationErrorDisplayProps) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      {errors.map((error, index) => (
        <div key={index} className="text-red-600 text-sm flex items-center">
          <span className="mr-1">•</span>
          {error}
        </div>
      ))}
    </div>
  );
}; 
'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
      {message}
    </div>
  );
};

export default ErrorMessage; 
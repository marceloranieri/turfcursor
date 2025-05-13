'use client';

import React from 'react';

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="text-sm text-red-500 mt-2" role="alert">
      {message}
    </div>
  );
}

// For backward compatibility
export default ErrorMessage; 
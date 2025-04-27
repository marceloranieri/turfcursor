'use client';

import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background-primary focus:text-text-primary focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"
    >
      Skip to content
    </a>
  );
}; 
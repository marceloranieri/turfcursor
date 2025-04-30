'use client';

import React from 'react';
import { useToast } from '../ui/ToastContext';

export const NotificationCenter: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Notification content will be rendered by the Toast component */}
    </div>
  );
}; 
import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-up`}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close notification"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
} 
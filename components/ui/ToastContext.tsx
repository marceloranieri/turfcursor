'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  type: ToastType;
  setType: (type: ToastType) => void;
  duration: number;
  setDuration: (duration: number) => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState(5000);
  const [queue, setQueue] = useState<ToastProps[]>([]);

  // Handle queue management
  useEffect(() => {
    if (!open && queue.length > 0) {
      const nextToast = queue[0];
      setMessage(nextToast.message);
      setType(nextToast.type);
      setDuration(nextToast.duration || 5000);
      setOpen(true);
      setQueue(prev => prev.slice(1));
    }
  }, [open, queue]);

  const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
    const newToast = { message, type, duration };
    
    if (!open) {
      // If no toast is showing, display immediately
      setMessage(message);
      setType(type);
      if (duration) setDuration(duration);
      setOpen(true);
    } else {
      // Otherwise, add to queue
      setQueue(prev => [...prev, newToast]);
    }
  };

  return (
    <ToastContext.Provider
      value={{
        open,
        setOpen,
        message,
        setMessage,
        type,
        setType,
        duration,
        setDuration,
        showToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
} 
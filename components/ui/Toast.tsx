'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { useToast } from './ToastContext';
import {
  ToastRoot,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction
} from './ToastPrimitives';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
  duration?: number;
}

// Context to track toast state
const ToastContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
  type: ToastType;
  duration?: number;
}>({
  open: false,
  setOpen: () => {},
  message: '',
  type: 'info',
});

// Custom hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

// Toast provider component
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState<number | undefined>(5000);

  return (
    <ToastContext.Provider value={{ open, setOpen, message, type, duration }}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          // Default toast options
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          // Custom toast types
          success: {
            duration: 3000,
            icon: '✅',
          },
          error: {
            duration: 4000,
            icon: '❌',
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export default ToastProvider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & {
    variant?: VariantProps<typeof toastVariants>['variant'];
  }
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = 'Toast';

export function Toast() {
  const { open, setOpen, message, type, duration } = useToast();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, setOpen]);

  if (!open) return null;

  return (
    <ToastRoot
      open={open}
      onOpenChange={setOpen}
      className={type}
      duration={duration}
    >
      <ToastTitle>{type.charAt(0).toUpperCase() + type.slice(1)}</ToastTitle>
      <ToastDescription>{message}</ToastDescription>
      <ToastAction asChild altText="Close">
        <ToastClose />
      </ToastAction>
    </ToastRoot>
  );
}

function getToastStyles(type: ToastProps['type']) {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

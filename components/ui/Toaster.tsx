'use client'

import { Toaster as ToasterProvider } from 'react-hot-toast'

export function Toaster() {
  return (
    <ToasterProvider
      position="bottom-right"
      toastOptions={{
        className: 'bg-background text-foreground',
        duration: 3000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }}
    />
  )
} 
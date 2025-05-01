import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal - Turf App',
  description: 'Legal pages for the Turf App',
};

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-primary">
      {children}
    </div>
  );
} 
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal - Turf App',
  description: 'Legal pages for the Turf App',
};

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
} 
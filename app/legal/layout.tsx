'use client';

import { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export const metadata = {
  title: 'Legal - Turf App',
  description: 'Legal pages for the Turf App',
}; 
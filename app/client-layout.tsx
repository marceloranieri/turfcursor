'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MobileLayout from './components/MobileLayout';

// Paths that should not show the mobile navigation
const NO_NAV_PATHS = [
  '/welcome',
  '/auth'  // This will match all paths starting with /auth
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Use startsWith instead of includes for path matching
  const showNav = !NO_NAV_PATHS.some(path => pathname.startsWith(path));

  return (
    <MobileLayout showNav={showNav}>
      {children}
    </MobileLayout>
  );
} 
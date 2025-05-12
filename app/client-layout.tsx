'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MobileLayout from '@/components/MobileLayout';

// Paths that should not show the mobile navigation
const NO_NAV_PATHS = [
  '/welcome',
  '/auth'  // Using just /auth will match all auth routes with startsWith
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Use startsWith instead of includes
  const showNav = !NO_NAV_PATHS.some(path => pathname.startsWith(path));

  return (
    <MobileLayout showNav={showNav}>
      {children}
    </MobileLayout>
  );
} 
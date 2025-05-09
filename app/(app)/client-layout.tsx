'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MobileLayout from '../components/MobileLayout';

// Paths that should not show the mobile navigation
const NO_NAV_PATHS = [
  '/welcome',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = !NO_NAV_PATHS.includes(pathname);

  return (
    <MobileLayout showNav={showNav}>
      {children}
    </MobileLayout>
  );
} 
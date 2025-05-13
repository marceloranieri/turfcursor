'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Paths that should not show the navigation
const NO_NAV_PATHS = [
  '/',
  '/welcome',
  '/auth'
];

export default function MobileLayout({ 
  children, 
  showNav = true 
}: { 
  children: React.ReactNode;
  showNav?: boolean;
}) {
  const pathname = usePathname();
  const shouldShowNav = showNav && !NO_NAV_PATHS.some(path => pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-white">
      <main className={shouldShowNav ? "pb-20" : ""}>
        {children}
      </main>
      {shouldShowNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
          <div className="container mx-auto flex justify-around">
            <Link href="/home" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/explore" className="text-gray-600 hover:text-gray-900">
              Explore
            </Link>
            <Link href="/new" className="text-gray-600 hover:text-gray-900">
              New
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
} 
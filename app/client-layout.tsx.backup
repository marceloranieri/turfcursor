'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { motion } from 'framer-motion';

// Define paths that should not show navigation
const NO_NAV_PATHS = [
  '/welcome',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/callback',
  '/auth/error',
  '/auth/success',
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Check if current path should show navigation
  const showNav = !NO_NAV_PATHS.some(path => pathname.startsWith(path));

  return (
    <>
      <SkipToContent />
      
      <div className="flex h-screen bg-background-primary">
        {showNav && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        
        <motion.main
          id="main-content"
          role="main"
          className={`flex-1 ${showNav ? 'md:ml-64' : ''} relative`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-full">
            {children}
          </div>
        </motion.main>
      </div>

      {/* Toast container for screen readers */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      />
    </>
  );
} 
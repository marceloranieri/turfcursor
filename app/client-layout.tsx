'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { motion } from 'framer-motion';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <SkipToContent />
      
      <div className="flex h-screen bg-background-primary">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <motion.main
          id="main-content"
          role="main"
          className="flex-1 md:ml-64 relative"
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
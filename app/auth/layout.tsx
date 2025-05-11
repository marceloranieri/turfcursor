'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-primary/80 backdrop-blur-sm border-b border-border-primary">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.svg"
              alt="Turf Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-text-primary">Turf</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-primary border-t border-border-primary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-text-secondary">
              © {new Date().getFullYear()} Turf. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link href="/legal/terms" className="text-sm text-text-secondary hover:text-text-primary">
                Terms
              </Link>
              <Link href="/legal/privacy" className="text-sm text-text-secondary hover:text-text-primary">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Full-screen background image - UPDATED PATH */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/turf-app-bg.webp")' }}
      />
      
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black opacity-30 z-10"></div>
      
      {/* Main content - centered with logo */}
      <main className="flex-grow flex items-center justify-center relative z-20 px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/turf-logo.svg"
                alt="Turf Logo"
                width={54}
                height={54}
                className="w-[54px] h-[54px]"
              />
            </Link>
          </div>
          
          {/* Auth form content */}
          {children}
          
          {/* Footer copyright */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white text-opacity-70">
              Copyright © {new Date().getFullYear()} Turf. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 
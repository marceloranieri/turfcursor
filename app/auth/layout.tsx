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
    <div className="min-h-screen flex overflow-hidden bg-background-primary">
      {/* Left Panel - Auth Form */}
      <div className="w-full md:w-2/5 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/turf-logo.svg"
                alt="Turf Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="ml-3 text-xl font-bold">Turf</span>
            </Link>
          </div>
          {/* Auth Form Content */}
          {children}
        </div>
      </div>
      {/* Right Panel - Feature Showcase */}
      <div className="hidden md:block md:w-3/5 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="mb-8 ml-8">
            <h2 className="text-3xl font-bold">Effortlessly manage your debates</h2>
            <h3 className="text-3xl font-bold mb-3">and conversations.</h3>
            <p className="opacity-80 text-lg">Join daily-curated debates on your favorite topics with fresh ideas and your kind of people.</p>
          </div>
          <div className="flex justify-center mb-12">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm p-5 rounded-lg shadow-xl w-full max-w-2xl">
              <div className="relative w-full h-72">
                <Image 
                  src="/images/features/dashboard-preview.png" 
                  alt="Feature preview" 
                  fill
                  className="rounded-md object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 text-white text-opacity-60 text-xs">
            Copyright © {new Date().getFullYear()} Turf. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
} 